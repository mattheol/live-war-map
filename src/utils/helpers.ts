import { TweetCategory } from "../@types/interfaces";
import { aerialIcon, explosionIcon } from "../icons/icons";

export function getIconForCategory(category?: TweetCategory) {
  switch (category) {
    case "explosion":
      return explosionIcon;
    case "aerial":
    default:
      return aerialIcon;
  }
}
