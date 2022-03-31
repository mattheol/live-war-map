export interface NewsProvider {
  getNews(params: { limit?: number; lastId?: number });
}

export interface Tweet {
  uuid: string;
  created_at: number;
  source?: "twitter";
  text: string;
  media?: Array<{ type: "video" | "image"; content_type: string }>;
  _tweetId?: string;
}
