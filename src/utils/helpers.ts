import { TweetCategory } from "../@types/interfaces";
import {
  aerialIcon,
  bombingIcon,
  explosionIcon,
  killIcon,
  liberationIcon,
  shootingIcon,
  warningIcon,
  civilianIcon,
  vehicleIcon,
  arrestIcon,
  minesIcon,
  droneIcon,
  chemicalIcon,
  politicsIcon,
  buildingsIcon,
} from "../icons/icons";

const categoryToIconMapping: Record<TweetCategory, string> = {
  aerial: aerialIcon,
  bombing: bombingIcon,
  explosion: explosionIcon,
  warning: warningIcon,
  shooting: shootingIcon,
  liberation: liberationIcon,
  kill: killIcon,
  civilian: civilianIcon,
  vehicle: vehicleIcon,
  arrest: arrestIcon,
  drone: droneIcon,
  mines: minesIcon,
  chemical: chemicalIcon,
  politics: politicsIcon,
  governments: politicsIcon, //duplicate
  buildings: buildingsIcon,
};

const categoryToTextMapping: Record<TweetCategory, string> = {
  aerial: "Aerial",
  bombing: "Bombing",
  explosion: "Explosion",
  warning: "Warning",
  shooting: "Shooting",
  liberation: "Liberation",
  kill: "Kill",
  civilian: "Civilian",
  vehicle: "Vehicle",
  arrest: "Arrest",
  drone: "Drone",
  mines: "Mines",
  chemical: "Chemical",
  politics: "Politics",
  governments: "Politics", //duplicate
  buildings: "Buildings",
};

export function getIconForCategory(category: TweetCategory) {
  if (!category) return warningIcon;
  return categoryToIconMapping[category];
}

export function getTextForCategory(category: TweetCategory) {
  if (!category) return "Warning";
  return categoryToTextMapping[category];
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

const startDate = 1649455201000;

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
