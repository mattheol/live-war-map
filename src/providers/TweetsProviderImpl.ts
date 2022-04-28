import { Tweet, TweetsProvider, VoteInfo } from "../@types/interfaces";
import { createFetchUrl } from "../utils/helpers";

export class TweetsProviderImpl implements TweetsProvider {
  private url = "http://127.0.0.1:5000";

  constructor(url: string) {
    this.url = url;
  }

  async getTweetVoteInfo(tweetId: string, userId?: string): Promise<VoteInfo> {
    const urlParams = new URLSearchParams({
      tweetId: tweetId,
    });
    if (userId) {
      urlParams.set("userId", userId);
    }
    const url = `${this.url}/vote-info`;
    const fetchUrl = createFetchUrl(url, urlParams);
    try {
      const res = await fetch(fetchUrl).then((f) => f.json());
    } catch {}
    // return res;
    return {
      real: 3,
      fake: 2,
      userVote: Math.random() > 0.5 ? "real" : "fake",
    };
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
