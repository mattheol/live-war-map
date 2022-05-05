import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { NewTweet, TweetCategory } from "../../@types/interfaces";
import "./CreateTweetDialog.css";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import {
  categories,
  OPEN_ADD_DIALOG_EVENT,
  REFRESH_NEWS_EVENT,
} from "../../utils/constants";
import { Formik } from "formik";
import * as Yup from "yup";
import SaveIcon from "@mui/icons-material/Save";
import { cities } from "../../utils/constants";
import { getIconForCategory, readDataUrl } from "../../utils/helpers";
import { createTweetsProvider } from "../../providers/TweetsProviderFactory";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../providers/FirebaseProvider";
import { TextField, Autocomplete, Stack, Button, Paper } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";
import UploadIcon from "@mui/icons-material/Upload";

export interface CreateTweetDialogProps {
  onClosed: () => void;
}

const tweetSchema = Yup.object().shape({
  text: Yup.string()
    .required("Required")
    .test("len", "Min 3 characters", (val) => (val ?? "").length >= 3),
  categories: Yup.array(Yup.string()).min(1, "Select at least one category"),
  city: Yup.string().required("Required"),
  image: Yup.string(),
});

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
        {loading && (
          <Backdrop open={loading} sx={{ zIndex: 99999 }}>
            <CircularProgress />
          </Backdrop>
        )}
        <Formik
          enableReinitialize={true}
          initialValues={
            {
              text: "",
              categories: [] as Array<TweetCategory>,
              city: "",
              coords: undefined,
              image: undefined,
            } as Partial<NewTweet>
          }
          validationSchema={tweetSchema}
          onSubmit={async (values) => {
            setLoading(true);
            await provider.addTweet(values as NewTweet);
            setLoading(false);
            onClose();
            window.dispatchEvent(new Event(REFRESH_NEWS_EVENT));
          }}
        >
          {({
            values,
            touched,
            errors,
            setFieldValue,
            handleChange,
            handleSubmit,
          }) => {
            return (
              <Stack spacing={3} style={{ marginTop: 15 }}>
                <Paper className="form_img_container">
                  {values.image && (
                    <img
                      src={values.image}
                      style={{
                        objectFit: "contain",
                        height: "70%",
                        width: "70%",
                      }}
                    />
                  )}
                  <label htmlFor="upload-photo">
                    <input
                      style={{ display: "none" }}
                      id="upload-photo"
                      name="upload-photo"
                      type="file"
                      accept=".jpg,.png,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          readDataUrl(file).then((dataUrl) => {
                            setFieldValue("image", dataUrl);
                          });
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      component="span"
                      color={
                        !!(touched.image && errors.image) ? "error" : "primary"
                      }
                      style={{ marginTop: "10px" }}
                      endIcon={<UploadIcon />}
                    >
                      {!values.image ? "Upload photo" : "Change photo"}
                    </Button>
                  </label>
                  {values.image && (
                    <Button
                      variant="contained"
                      component="span"
                      color={"error"}
                      onClick={() => {
                        setFieldValue("image", undefined);
                      }}
                      style={{ marginTop: "10px" }}
                      endIcon={<CloseIcon />}
                    >
                      Delete photo
                    </Button>
                  )}
                </Paper>
                <TextField
                  label="Text"
                  variant="outlined"
                  error={!!(touched.text && errors.text)}
                  helperText={touched.text && errors.text}
                  required
                  value={values.text || ""}
                  onChange={handleChange("text")}
                  minRows={5}
                  multiline
                />
                <Autocomplete
                  value={values.categories}
                  options={categories}
                  multiple
                  limitTags={5}
                  style={{ flex: 1 }}
                  onChange={(e, value) => {
                    setFieldValue("categories", value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!(touched.categories && errors.categories)}
                      helperText={touched.categories && errors.categories}
                      label="Select categories (max 5)"
                    />
                  )}
                />
                <Autocomplete
                  options={cities}
                  style={{ flex: 1 }}
                  getOptionLabel={(option) => option.city}
                  onChange={(e, value) => {
                    setFieldValue("city", value?.city);
                    setFieldValue("lat", value?.lat);
                    setFieldValue("lng", value?.lng);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="City" />
                  )}
                />
                <Button
                  size="large"
                  variant="contained"
                  onClick={async () => {
                    handleSubmit();
                  }}
                  startIcon={<SaveIcon />}
                >
                  Publish
                </Button>
              </Stack>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTweetDialog;
