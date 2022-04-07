export interface TweetsProvider {
  getTweets(params: {
    start_date: number;
    end_date: number;
  }): Promise<Array<Tweet>>;
}

export interface Tweet {
  id: string;
  city: string;
  date: string;
  text: string;
  category: TweetCategory;
  lat: number;
  lng: number;
  source?: "twitter" | "app"; //default twitter
}

export type TweetCategory =
  | "aerial"
  | "explosion"
  | "shooting"
  | "bomb"
  | "liberation"
  | "kill"
  | "warning";
