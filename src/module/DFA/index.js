import { Grid, Typography, CircularProgress } from "@material-ui/core";
import React from "react";
import Button from "@material-ui/core/Button";
import PhoneIcon from "@material-ui/icons/Phone";
import MessageIcon from "@material-ui/icons/Message";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import Phone from "~/components/TextBox/Phone";
import { compose } from "redux";
import { withTranslation } from "react-i18next";

class DFAEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneErr: null,
      ccode: null,
      ext: null,
      phone: null,
      prefixCcode: null,
      isLoading: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      ...e.target.value,
      phoneErr: null,
    });
  };

  handleBtnClick = (e) => {
    const { id } = e.currentTarget;
    const { phone, ccode } = this.state;
    const { t } = this.props;

    const phoneRegx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phoneRegx.test(phone)) {
      this.setState({
        phoneErr: t("dfa.error.invalidPhoneNumber"),
      });
    } else {
      this.setState(
        {
          isLoading: true,
        },
        () => {
          this.props.preVerificationData({
            phoneNumber: phone,
            selectedMode: id,
            ccode: ccode,
          });
        }
      );
    }
  };

  skipBtnClick = () => {
    this.props.isSkipBtnClicked(true);
  };

  render() {
    const { classes, t } = this.props;
    const { phone, phoneErr, isLoading } = this.state;

    return (
      <>
        <Grid container className={classes.DFAContainer}>
          <Typography variant="h1">
            {t("dfa.message.verifyPhoneNumber")}
          </Typography>

          <Typography className={classes.discTxt}>
            {t("dfa.message.securePayments")}
          </Typography>

          <Grid container className={classes.phoneBox}>
            <Phone
              isExt={false}
              error={Boolean(phoneErr)}
              helperText={phoneErr}
              id="phoneNumber"
              name="phoneNumber"
              ext=""
              value={phone}
              ccode=""
              prefixCcode="+1"
              ccodeDisabled={false}
              onChange={(e) => this.handleChange(e)}
            />
          </Grid>

          <Typography variant="h6">
            {t("dfa.message.oneTimeVerificationCode")}
          </Typography>

          <Grid container className={classes.btnContainer}>
            <Grid item xs={6}>
              <Button
                color="primary"
                className={classes.skipBtn}
                onClick={(e) => this.skipBtnClick(e)}
              >
                {t("dfa.buttonLabel.skip")}
              </Button>
            </Grid>

            {isLoading ? (
              <CircularProgress />
            ) : (
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.callBtn}
                  id="PHONE"
                  onClick={(e) => this.handleBtnClick(e)}
                >
                  {t("dfa.buttonLabel.call")} <PhoneIcon />
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  className={classes.msgBtn}
                  id="SMS"
                  onClick={(e) => this.handleBtnClick(e)}
                >
                  {t("dfa.buttonLabel.text")} <MessageIcon />
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </>
    );
  }
}

export default compose(withTranslation("common"), withStyles(styles))(DFAEdit);
