import { TweetCategory } from "../@types/interfaces";
import {
  aerialIcon,
  bombIcon,
  explosionIcon,
  killIcon,
  liberationIcon,
  shootingIcon,
  warningIcon,
} from "../icons/icons";

const categoryToIconMapping: Record<TweetCategory, string> = {
  aerial: aerialIcon,
  bomb: bombIcon,
  explosion: explosionIcon,
  warning: warningIcon,
  shooting: shootingIcon,
  liberation: liberationIcon,
  kill: killIcon,
};
export function getIconForCategory(category: TweetCategory) {
  if (!category) return warningIcon;
  return categoryToIconMapping[category];
}
