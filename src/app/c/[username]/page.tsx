import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { getChannelFromUrl } from "@/lib/channel-from-url";
import { Channel } from "@/types/channel";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import SubscribeButton from "./subscribe";

// export const revalidate = 60;

export default async function ChannelPage({
  params,
}: {
  params: { username: string };
}) {
  const session = await getAuthSession();

  const channelId: string | null = await getChannelFromUrl(
    `https://youtube.com/@${params.username}`,
  ).catch(() => null);
  if (!channelId) return notFound();

  const res = await fetch(
    `https://yt.lemnoslife.com/noKey/channels?part=snippet,statistics,brandingSettings&id=${channelId}`,
  );
  const data = await res.json();
  const channel: Channel = data.items[0];

  const subscription =
    session && session.user.channelId !== channelId
      ? await (
          await fetch(
            `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&forChannelId=${channelId}&mine=true&key=${process.env.YOUTUBE_API_KEY}`,
            {
              headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
              },
            },
          )
        ).json()
      : undefined;

  const subscribed = session ? subscription?.items?.length >= 1 : undefined;

  const avatar =
    channel.snippet.thumbnails.high?.url ||
    channel.snippet.thumbnails.medium?.url ||
    channel.snippet.thumbnails.default?.url;

  async function updateSubscription() {
    "use server";
    if (!session || session.user.channelId === channelId) return;
    if (subscribed !== undefined) {
      try {
        if (subscribed)
          await axios.delete(
            `https://youtube.googleapis.com/youtube/v3/subscriptions?id=${subscription?.items?.[0]?.id}&key=${process.env.YOUTUBE_API_KEY}`,
            {
              headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
              },
            },
          );
        else
          await axios.post(
            `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&key=${process.env.YOUTUBE_API_KEY}`,
            {
              snippet: {
                resourceId: {
                  channelId,
                },
              },
            },
            {
              headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
              },
            },
          );
      } catch (err) {
        if (err instanceof AxiosError) {
          console.error(err.response?.data);
        }
      }
    }
    revalidatePath("/c/[username]");
  }

  return (
    <>
      <div className="relative">
        <div className="relative h-[calc(16.1290322581vw_-_1px)]">
          <Image
            src={`https://banner.yt/${channelId}`}
            alt={channel.id}
            fill
            className="obejct-center object-cover"
          />
          <div className="absolute -bottom-14 z-50 flex w-full items-end gap-1.5">
            <Image
              src={avatar!}
              alt={channel.snippet.title}
              width={120}
              height={120}
              className="rounded-full"
            />
            <div className="flex w-full items-center justify-between px-3 pl-0">
              <div>
                <h1 className="text-3xl font-bold">{channel.snippet.title}</h1>
                <p className="text-sm">{channel.snippet.customUrl}</p>
              </div>
              {session &&
              session.user.channelId !== channelId &&
              subscribed !== undefined ? (
                <form action={updateSubscription}>
                  <SubscribeButton subscribed={subscribed} />
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
