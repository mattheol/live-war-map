import { Tweet, TweetsProvider } from "../@types/interfaces";

export class TweetsProviderImpl implements TweetsProvider {
  private url = "http://127.0.0.1:5000";

  constructor(url: string) {
    this.url = url;
  }

  async getTweets(params: { start_date: number; end_date: number }) {
    console.log({
      start_date: new Date(params.start_date).toLocaleDateString(),
      end_date: new Date(params.end_date).toLocaleDateString(),
    });
    const tweets: Array<Tweet> = await fetch(
      `${this.url}/tweets?start_date=${params.start_date}&end_date=${params.end_date}`
    ).then((r) => r.json());
    return tweets.reverse().filter((t) => t.categories && t.mainCategory);
  }
}
