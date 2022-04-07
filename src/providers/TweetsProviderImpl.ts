import { Tweet, TweetsProvider } from "../@types/interfaces";

export class TweetsProviderImpl implements TweetsProvider {
  private url = "http://127.0.0.1:5000";

  constructor(url: string) {
    this.url = url;
  }

  async getTweets(params: { date: number }) {
    console.log({ params });
    const tweets: Array<Tweet> = await fetch(
      `${this.url}/tweets?date=${params.date}`
    ).then((r) => r.json());
    return tweets.reverse();
  }
}
