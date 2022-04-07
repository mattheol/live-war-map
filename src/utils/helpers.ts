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

(Date as any).prototype.addDays = function (days: any) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

function getDates(startDate: any, stopDate: any) {
  let dateArray = new Array();
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

const startDate = 1649293037000;

export const getDateList = (): Array<{ value: number; alias: string }> => {
  const sDate = new Date(startDate);
  sDate.setHours(0, 0, 0, 0);
  const dates = getDates(sDate, new Date()).reverse() as Array<Date>;
  dates.forEach((d) => {
    d.setHours(12, 0, 0, 0);
  });
  return dates.map((d, i) => ({
    value: d.getTime(),
    alias: i === 0 ? "Dzisiaj" : d.toLocaleDateString(),
  }));
};
