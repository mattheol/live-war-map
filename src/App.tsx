import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Tweet } from "./@types/interfaces";
import "./App.css";
import MapElement from "./components/MapElement/MapElement";
import NewsList from "./components/NewsList/NewsList";
import TweetDialog from "./components/TweetDialog/TweetDialog";
import { auth, logout, signInViaTwitter } from "./providers/FirebaseProvider";
import { createTweetsProvider } from "./providers/TweetsProviderFactory";

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [activeTweet, setActiveTweet] = useState<Tweet | undefined>(undefined);
  const [tweetsLoading, setTweetsLoading] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<number>(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return today.getTime();
  });
  const { enqueueSnackbar } = useSnackbar();
  const provider = useMemo(createTweetsProvider, []);
  useEffect(() => {
    let cancel = false;
    const fetchNews = async () => {
      setTweetsLoading(true);
      const startDate = new Date(dateFilter);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(dateFilter);
      endDate.setHours(23, 59, 59, 59);
      const tweets: Tweet[] = await provider.getTweets({
        start_date: startDate.getTime(),
        end_date: endDate.getTime(),
      });
      if (cancel) return;
      setTweetsLoading(false);
      setTweets(tweets);
    };
    fetchNews();
    return () => {
      cancel = true;
    };
  }, [dateFilter]);

  if (loading || tweetsLoading) {
    return (
      <div className="app-container">
        <Backdrop open={loading || tweetsLoading} sx={{ zIndex: 9999 }}>
          <CircularProgress />
        </Backdrop>
      </div>
    );
  }

  return (
    <div className="app-container">
      <TweetDialog
        tweet={activeTweet}
        onClosed={() => {
          setActiveTweet(undefined);
        }}
      />
      <div className="map-container">
        <MapElement
          tweets={tweets}
          onTweetClick={(tweet: Tweet) => {
            setActiveTweet(tweet);
          }}
        />
      </div>
      <div className="right-panel">
        <div className="user-panel">
          {user ? (
            <Button
              size="large"
              title="Sign out"
              endIcon={<LogoutIcon />}
              onClick={async () => {
                await logout();
                enqueueSnackbar("You have signed out", {
                  variant: "info",
                  autoHideDuration: 3000,
                });
              }}
            >
              Sign out
            </Button>
          ) : (
            <Button
              size="large"
              title="Sign in"
              onClick={async () => {
                try {
                  await signInViaTwitter();
                  enqueueSnackbar("You have signed in", {
                    variant: "success",
                    autoHideDuration: 3000,
                  });
                } catch (e) {
                  enqueueSnackbar("Sign in error", {
                    variant: "error",
                    autoHideDuration: 3000,
                  });
                }
              }}
            >
              Sign in
              <LoginIcon />
            </Button>
          )}
        </div>
        <NewsList
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          tweets={tweets}
          onTweetClick={(tweet: Tweet) => {
            setActiveTweet(tweet);
          }}
        />
      </div>
    </div>
  );
}

export default App;
