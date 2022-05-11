import {
  NewTweet,
  Tweet,
  TweetsProvider,
  VoteInfo,
} from "../@types/interfaces";
import { TOKEN_KEY, SECRET_KEY } from "../utils/constants";
import { createFetchUrl } from "../utils/helpers";

export class TweetsProviderImpl implements TweetsProvider {
  private url = "http://127.0.0.1:5000";

  constructor(url: string) {
    this.url = url;
  }

  async addTweet(model: NewTweet, shouldPublish: boolean): Promise<void> {
    const urlParams = new URLSearchParams(
      shouldPublish
        ? {
            token: localStorage.getItem(TOKEN_KEY) || "",
            secret: localStorage.getItem(SECRET_KEY) || "",
          }
        : undefined
    );
    const url = `${this.url}/add_tweet`;
    const fetchUrl = createFetchUrl(url, urlParams);
    const body = JSON.stringify(model);
    try {
      await fetch(fetchUrl, { method: "POST", body }).then((f) => f.json());
    } catch {}
    // return res;
  }

  async getTweetVoteInfo(tweetId: string, userId?: string): Promise<VoteInfo> {
    const urlParams = new URLSearchParams({
      tweetId: tweetId,
    });
    if (userId) {
      urlParams.set("userId", userId);
    }
    const url = `${this.url}/vote_info`;
    const fetchUrl = createFetchUrl(url, urlParams);
    try {
      const res: VoteInfo = await fetch(fetchUrl).then((f) => f.json());
      return res;
    } catch (e) {
      console.error({ e });
      throw new Error((e as any).message);
    }
  }

  async voteForTweet(
    tweetId: string,
    userId: string,
    vote: "real" | "fake" | "empty"
  ): Promise<void> {
    const urlParams = new URLSearchParams({
      tweetId: tweetId,
      userId: userId,
      vote,
    });
    const url = `${this.url}/vote`;
    const fetchUrl = createFetchUrl(url, urlParams);
    try {
      await fetch(fetchUrl, { method: "POST" });
    } catch (e) {
      console.error({ e });
    }
    // return res.vote;
  }

  async getTweets(params: { start_date: number; end_date: number }) {
    // console.log({
    //   start_date: new Date(params.start_date).toLocaleDateString(),
    //   end_date: new Date(params.end_date).toLocaleDateString(),
    // });
    const tweets: Array<Tweet> = await fetch(
      `${this.url}/tweets?start_date=${params.start_date}&end_date=${params.end_date}`
    ).then((r) => r.json());
    return [...tweets.reverse()].filter((t) => t.categories && t.mainCategory);
  }
}
