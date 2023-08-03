import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  Grid,
  TextField,
  Box,
  makeStyles,
  Typography,
  Button,
} from "@material-ui/core";
import clsx from 'clsx'
import { withTranslation } from "react-i18next";

const useStyle = makeStyles((theme) => ({
  paper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    background: theme.palette.background.white,
    borderRadius: theme.spacing(1),
    alignItems: "center",
    flexDirection: "column",
    margin: theme.spacing(3, 0),
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
    },
  },
  heading: {
    paddingTop: 0,
    color: theme.palette.text.main,
    fontSize: 24,
    fontWeight: 500,
  },
  clientLogo: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  logoImg: {
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "20px",
    borderRight: "1px solid #ddd",
  },
  logoLabel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    color: "rgba(0,0,0,0.74)",
    fontFamily: "'Roboto', Arial, Helvetica, sans-serif",
  },
  textField: {
    marginTop: "22px",
  },
  blueBtn: {
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: "14px",
    padding: "8px 20px",
    minWidth: 140,
    boxShadow: "none",
  },
  imageAvatar: {
    width: "100%",
    maxWidth: "120px",
    objectFit: "contain",
    [theme.breakpoints.down("sm")]: {
      maxWidth: 140,
      height: "auto",
      maxHeight: 50,
    },
  },
  welcomeText:{
    [theme.breakpoints.down("xs")]: {
     fontSize:'1rem'
    },
    wordBreak: "break-word"
  },
}));

const ForgotPassword = (props) => {
  const {
    credentials,
    handleChange,
    onSubmit,
    onCancel,
    validation,
    brandInfo,
    t,
  } = props;
  const classes = useStyle();
  const clientLogo = brandInfo.logo || null;

  return (
    <>
      <Grid item xs="11" sm="6" md="9" lg="8" xl="5">
        <div className={classes.paper}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Grid item xs={12} md={12} lg={12} className={classes.logoLabel}>
              {clientLogo && (
                <Box>
                  <img
                    src={clientLogo}
                    className={classes.imageAvatar || ""}
                    height="34"
                    alt="client logo"
                  />
                </Box>
              )}
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center" mt={2} mx={1}>
            <Typography variant="h3" align="center" className={clsx("welcomeHeader",classes.welcomeText)}>
              {props.user.brandInfo.login_welcome_msg}
            </Typography>
          </Box>
          <Box display="flex" pt={3} pb={2} justifyContent="center" textAlign={"center"} >
            <Typography variant="body1" className={classes.heading}>
              {t("login.forgotPassword.label.forgotPassword")}?
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            py={2}
            width={1}
          >
            <Box display="flex" justifyContent="center" width={1}>
              <TextField
                fullWidth={true}
                required
                error={validation && validation.Email}
                helperText={validation && validation.Email}
                autoComplete="off"
                value={(credentials && credentials.Email) || ""}
                name="Email"
                placeholder={t("login.forgotPassword.placeholder.userName")}
                onChange={(event) => handleChange("Email", event)}
                dir="horizontal"
                size="medium"
                variant="outlined"
                inputProps={{
                  maxLength: 50,
                  autocomplete: "new-password",
                }}
                label={t("login.forgotPassword.label.userName")}
              />
            </Box>
          </Box>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={5} sm={4} md={4} lg={5}>
              <Button variant="outlined" onClick={() => onCancel()} fullWidth>
                {t("login.buttonLabel.cancel")}
              </Button>
            </Grid>
            <Grid item xs={5} sm={4} md={4} lg={5}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onSubmit()}
                fullWidth
              >
                {t("login.buttonLabel.submit")}
              </Button>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </>
  );
};


export default connect((state) => ({ ...state.user }))(
  compose(withTranslation("common"))(ForgotPassword)
);