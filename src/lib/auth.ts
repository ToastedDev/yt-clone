import { PrismaAdapter } from "@next-auth/prisma-adapter";
import axios from "axios";
import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      channelId: string;
      accessToken: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        id: token.sub,
        channelId: token.channelId,
        name: token.name,
        username: token.username,
        email: token.email,
        image: token.picture,
        accessToken: token.accessToken,
      },
    }),
    jwt: async ({ account, token }) => {
      if (account) {
        token.accessToken = account.access_token;
        const { data } = await axios
          .get(
            `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key=${process.env.YOUTUBE_API_KEY}`,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            },
          )
          .catch(() => ({ data: null }));

        if (data && data.items) {
          const item = data.items[0];
          token.channelId = item.id;
          token.name = item.snippet.title;
          token.username = item.snippet.customUrl.replace("@", "");
          token.picture =
            item.snippet.thumbnails.high?.url ||
            item.snippet.thumbnails.medium?.url ||
            item.snippet.thumbnails.default?.url;
        }
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "https://www.googleapis.com/auth/youtube",
            "https://www.googleapis.com/auth/youtube.force-ssl",
            "https://www.googleapis.com/auth/youtube.readonly",
            "https://www.googleapis.com/auth/youtubepartner",
          ].join(" "),
        },
      },
    }),
  ],
};

export const getAuthSession = () => getServerSession(authOptions);
