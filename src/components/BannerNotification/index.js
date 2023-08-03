import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import {
  Box,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  notificationBanner: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: "10px 40px 10px 10px",
    width: "270px",
    height: "auto",
    backgroundColor: "white",
    position: "relative",
  },
  closeBanner: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  title: {
    color: "rgba(0,0,0,0.87)",
    fontFamily: "Interstate",
  },
  content: {
    color: "#7F7F7F",
    fontFamily: "Interstate",
  },
}));

export default function BannerNotification({
  handleClose,
  title = "New Notification",
  description = "Notification descrition",
}) {
  const classes = useStyles();
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={true}
      autoHideDuration={10000}
      onClose={handleClose}
    >
      <Paper elevation={3} className={classes.notificationBanner}>
        <Typography noWrap variant="h3" className={classes.title}>
          {title}
        </Typography>
        <Typography variant="h3" className={classes.content}>
          {description}
        </Typography>
        <Box className={classes.closeBanner}>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Snackbar>
  );
}
