import { TweetsProvider } from "../@types/interfaces";
import { TweetsProviderImpl } from "./TweetsProviderImpl";

//TODO move to config
const url = "http://127.0.0.1:5000";

export const createTweetsProvider = (): TweetsProvider => {
  return new TweetsProviderImpl(url);
};
