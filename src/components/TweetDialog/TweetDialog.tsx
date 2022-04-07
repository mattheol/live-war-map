import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import React, { useEffect, useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Tweet } from "../../@types/interfaces";
import "./TweetDialog.css";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";

export interface TweetDialogProps {
  tweet?: Tweet;
  onClosed: () => void;
}

const useStyles = makeStyles(() => ({
  paper: { width: "600px", maxWidth: "100%" },
}));

const TweetDialog = ({ tweet, onClosed }: TweetDialogProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (tweet) {
      setOpen(true);
    }
  }, [tweet]);

  const onClose = () => {
    setOpen(false);
    onClosed();
  };

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        style={{
          height: "100vh",
          overflow: "auto",
          marginTop: "15px",
        }}
      >
        {tweet?.id && <TwitterTweetEmbed tweetId={tweet.id} />}
      </DialogContent>
    </Dialog>
  );
};

export default TweetDialog;
