export interface TweetsProvider {
  getTweets(params: {
    start_date: number;
    end_date: number;
  }): Promise<Array<Tweet>>;
  getTweetVoteInfo(tweetId: string, userId?: string): Promise<VoteInfo>;
  voteForTweet(
    tweetId: string,
    userId: string,
    vote: "real" | "fake" | "empty"
  ): Promise<void>;
  addTweet(model: NewTweet): Promise<void>;
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
  published?: boolean; //default true
  image?: string; //base64
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

export interface VoteInfo {
  real: number;
  fake: number;
  userVote?: string;
}

export interface NewTweet {
  categories: Array<TweetCategory>;
  text: string;
  city: string;
  lat: number;
  lng: number;
  image?: string;
  //TODO rest props
}
