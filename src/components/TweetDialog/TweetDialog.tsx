import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import React, { useEffect, useMemo, useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Tweet, VoteInfo } from "../../@types/interfaces";
import "./TweetDialog.css";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import { getIconForCategory } from "../../utils/helpers";
import { createTweetsProvider } from "../../providers/TweetsProviderFactory";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../providers/FirebaseProvider";
import { Button, ButtonGroup, Paper } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";

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
  const [user, usrloading, error] = useAuthState(auth);
  const [voteInfo, setVoteInfo] = useState<VoteInfo | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const provider = useMemo(createTweetsProvider, []);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setVoteInfo(undefined);
    if (tweet) {
      setOpen(true);
      let cancel = false;
      const fetchVoteInfo = async () => {
        const newVoteInfo = await provider.getTweetVoteInfo(
          tweet.id,
          user?.uid
        );
        if (cancel) return;
        setVoteInfo(newVoteInfo);
      };
      fetchVoteInfo();
      return () => {
        cancel = true;
      };
    }
  }, [tweet, user, provider]);

  const onClose = () => {
    setOpen(false);
    onClosed();
  };

  const renderTweet = () => {
    if (!tweet) return null;
    const published = tweet.published ?? true;
    if (!published) {
      return (
        <Paper sx={{ padding: "20px 30px" }}>
          {tweet.image && (
            <div className="unpublished_tweet_img_container">
              <img
                src={tweet.image}
                style={{
                  objectFit: "contain",
                  height: "100%",
                  width: "100%",
                }}
              />
            </div>
          )}
          <div style={{ fontSize: 18 }}>{tweet.text}</div>
        </Paper>
      );
    }
    return <TwitterTweetEmbed tweetId={tweet.tweetId ?? tweet.id} />;
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
        {loading && (
          <Backdrop open={loading} sx={{ zIndex: 99999 }}>
            <CircularProgress />
          </Backdrop>
        )}
        {tweet?.categories && voteInfo && (
          <div className="tweet-dialog-content-header">
            <div>
              {[
                tweet.mainCategory,
                ...tweet.categories.filter((c) => c !== tweet.mainCategory),
              ].map((category) => (
                <img
                  key={category + "_dial"}
                  height="35px"
                  width="35px"
                  src={getIconForCategory(category)}
                ></img>
              ))}
            </div>
            <ButtonGroup>
              <Button
                color={"success"}
                variant={
                  voteInfo.userVote && voteInfo.userVote === "real"
                    ? "contained"
                    : "outlined"
                }
                onClick={async () => {
                  if (!user?.uid) {
                    enqueueSnackbar("You have to be logged in order to vote", {
                      variant: "info",
                      autoHideDuration: 2500,
                    });
                    return;
                  }
                  if (voteInfo.userVote !== "real") {
                    setLoading(true);
                    await provider.voteForTweet(tweet.id, user.uid, "real");
                    if (voteInfo.userVote === "fake") {
                      setVoteInfo({
                        ...voteInfo,
                        fake: voteInfo.fake - 1,
                        real: voteInfo.real + 1,
                        userVote: "real",
                      });
                    } else {
                      setVoteInfo({
                        ...voteInfo,
                        real: voteInfo.real + 1,
                        userVote: "real",
                      });
                    }
                    setLoading(false);
                  } else {
                    setLoading(true);
                    await provider.voteForTweet(tweet.id, user.uid, "empty");
                    setVoteInfo({
                      ...voteInfo,
                      real: voteInfo.real - 1,
                      userVote: "empty",
                    });
                    setLoading(false);
                  }
                }}
              >
                Real ({voteInfo.real})
              </Button>
              <Button
                color={"error"}
                variant={
                  voteInfo.userVote && voteInfo.userVote === "fake"
                    ? "contained"
                    : "outlined"
                }
                onClick={async () => {
                  if (!user?.uid) {
                    enqueueSnackbar("You have to be logged in order to vote", {
                      variant: "info",
                      autoHideDuration: 2500,
                    });
                    return;
                  }
                  if (voteInfo.userVote !== "fake") {
                    setLoading(true);
                    await provider.voteForTweet(tweet.id, user.uid, "fake");
                    if (voteInfo.userVote === "real") {
                      setVoteInfo({
                        ...voteInfo,
                        fake: voteInfo.fake + 1,
                        real: voteInfo.real - 1,
                        userVote: "fake",
                      });
                    } else {
                      setVoteInfo({
                        ...voteInfo,
                        fake: voteInfo.fake + 1,
                        userVote: "fake",
                      });
                    }
                    setLoading(false);
                  } else {
                    setLoading(true);
                    await provider.voteForTweet(tweet.id, user.uid, "empty");
                    setVoteInfo({
                      ...voteInfo,
                      fake: voteInfo.fake - 1,
                      userVote: "empty",
                    });
                    setLoading(false);
                  }
                }}
              >
                Fake ({voteInfo.fake})
              </Button>
            </ButtonGroup>
          </div>
        )}
        {renderTweet()}
      </DialogContent>
    </Dialog>
  );
};

export default TweetDialog;
