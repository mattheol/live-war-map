import React, { useMemo } from "react";
import { Tweet } from "../../@types/interfaces";
import NewsElement from "../NewsElement/NewsElement";
import "./NewsList.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { getDateList } from "../../utils/helpers";
export interface NewsListProps {
  tweets: Array<Tweet>;
  dateFilter: number;
  setDateFilter: (newDateFilter: number) => void;
  onTweetClick: (tweet: Tweet) => void;
}

const NewsList = ({
  tweets,
  onTweetClick,
  dateFilter,
  setDateFilter,
}: NewsListProps) => {
  const dateList = useMemo(getDateList, []);
  return (
    <>
      <div className="news-list-header">
        <h4>News</h4>
        <Box sx={{ width: 150 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Date</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dateFilter + ""}
              label="Data"
              onChange={(e: SelectChangeEvent) => {
                setDateFilter(+e.target.value);
              }}
            >
              {dateList.map((item) => (
                <MenuItem key={item.value + ""} value={item.value + ""}>
                  {item.alias}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      <div className="list-container">
        {tweets.map((tweet) => (
          <NewsElement
            key={tweet.id}
            tweet={tweet}
            onTweetClick={onTweetClick}
          />
        ))}
      </div>
    </>
  );
};

export default NewsList;
