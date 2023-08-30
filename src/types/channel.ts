export interface Channel {
  kind: "youtube#channel";
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: `@${string}`;
    publishedAt: string;
    thumbnails: Record<
      "default" | "medium" | "high",
      | {
          url: string;
          width: number;
          height: number;
        }
      | undefined
    >;
    localized: {
      title: string;
      description: string;
    };
    country: string;
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
  brandingSettings: {
    channel: {
      title: string;
      description: string;
      keywords: string;
      unsubscribedTrailer: string;
      country: string;
    };
    image: {
      bannerExternalUrl: string;
    };
  };
}
