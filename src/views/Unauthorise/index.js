import React from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import Access_Denied from "~/assets/icons/access_denied.svg";
import { withTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    background: theme.palette.background.header,
    display: "flex",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    textAlign: "center",
    color: "#0B1941",
    fontWeight: 700,
  },
  subHeading: {
    fontSize: 24,
    textAlign: "center",
    color: "#4c4c4c",
    fontWeight: "normal",
    width: "60%",
  },
}));

const Unauthorise = (props) => {
  const classes = useStyles();
  const { t } = props;
  return (
    <div className={classes.root}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box pb={5}>
          <img
            src={Access_Denied}
            alt={t("unauthorize.unAuthories.AccessDenied")}
            width="392"
          />
        </Box>
        <Box pb={5}>
          <Typography variant="h1" className={classes.heading}>
            {t("unauthorize.unAuthories.ACCESSDENIED")}
          </Typography>
        </Box>
        <Typography variant="h4" className={classes.subHeading}>
          {t("unauthorize.unAuthories.notAccessMsg")}
        </Typography>
      </Box>
    </div>
  );
};

export default withTranslation()(Unauthorise);
