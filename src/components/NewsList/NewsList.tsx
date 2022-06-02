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
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { REFRESH_NEWS_EVENT } from "../../utils/constants";

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
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <h4>News</h4>
          {dateList.findIndex((d) => d.value === dateFilter) === 0 && (
            <IconButton
              onClick={() => {
                window.dispatchEvent(new Event(REFRESH_NEWS_EVENT));
              }}
            >
              <RefreshIcon></RefreshIcon>
            </IconButton>
          )}
        </div>
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
