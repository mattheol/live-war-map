import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { NewTweet } from "../../@types/interfaces";
import "./CreateTweetDialog.css";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import { OPEN_ADD_DIALOG_EVENT } from "../../utils/constants";

import { getIconForCategory } from "../../utils/helpers";
import { createTweetsProvider } from "../../providers/TweetsProviderFactory";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../providers/FirebaseProvider";
import { TextField, Autocomplete } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";

export interface CreateTweetDialogProps {
  onClosed: () => void;
}

const useStyles = makeStyles(() => ({
  paper: { width: "600px", maxWidth: "100%" },
}));

const CreateTweetDialog = ({ onClosed }: CreateTweetDialogProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [user, usrloading, error] = useAuthState(auth);
  const [model, setModel] = useState<Partial<NewTweet>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const provider = useMemo(createTweetsProvider, []);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const listener = () => {
      console.log("herr");
      setModel({});
      setOpen(true);
    };
    window.addEventListener(OPEN_ADD_DIALOG_EVENT, listener);
    return () => {
      window.removeEventListener(OPEN_ADD_DIALOG_EVENT, listener);
    };
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    setModel({});
    onClosed();
  }, [onClosed]);

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
          overflow: "auto",
          marginTop: "15px",
        }}
      >
        TESTT
      </DialogContent>
    </Dialog>
  );
};

export default CreateTweetDialog;
