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
  categories: Array<TweetCategory>;
  mainCategory: TweetCategory;
  lat: number;
  lng: number;
  source?: "twitter" | "app"; //default twitter
}

export type TweetCategory =
  | "aerial"
  | "explosion"
  | "shooting"
  | "bombing"
  | "liberation"
  | "kill"
  | "warning"
  | "civilian"
  | "vehicle"
  | "arrest"
  | "drone"
  | "mines"
  | "chemical"
  | "politics"
  | "governments"
  | "buildings";
