import React from "react";
import { Typography, Box } from "@material-ui/core";
import images1 from "~/assets/images/nonCDM_verification-1.1.svg";
import images4 from "~/assets/images/check_circle.svg";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles({
  root: {},
  whiteText: {
    color: "#fff",
    marginBottom: 18,
  },
  whiteTextOpacity: {
    color: "#fff",
    marginBottom: 18,
    opacity: 0.5,
  },
  image: {
    width: 145,
    height: 110,
  },
  imageOpacity: {
    width: 80,
    height: 60,
    opacity: 0.5,
    marginRight: 10,
  },
  checkHide: {
    display: "none",
  },
  checkShow: {
    display: "Block",
  },
});

const NonCDMCard = (props) => {
  const classes = useStyles();
  const { step, t } = props;
  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Box width="80%" py={3} mt={6.5}>
        <Typography variant="h1" gutterBottom className={classes.whiteText}>
          {step === 2
            ? t("card.journeyCompleted")
            : t("card.yourPaymentIsJust3StepsAway")}
        </Typography>
        <Box my={4} pb={1} pt={3}>
          <Typography
            variant="h5"
            align="left"
            gutterBottom
            className={clsx({
              [classes.whiteText]: step === 1,
              [classes.whiteTextOpacity]: step !== 1,
            })}
          >
            {t("card.authenticatePayment")}
          </Typography>
          <Box
            my={3}
            pl={2}
            width={1}
            display="flex"
            justifyContent="left"
            alignItems="flex-start"
          >
            <img
              src={images1}
              alt={t("card.authenticateYourself")}
              className={clsx({
                [classes.image]: step === 1,
                [classes.imageOpacity]: step !== 1,
              })}
            />
            {step > 1 && <img src={images4} alt="Check" />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default compose(withTranslation("common"))(NonCDMCard);
