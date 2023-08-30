import { Innertube } from "youtubei.js";

export async function getChannelFromUrl(url: string) {
  const innerTube = await Innertube.create();
  const resolved = await innerTube.resolveURL(url);
  const channelId = resolved.payload.browseId;
  return channelId;
}
