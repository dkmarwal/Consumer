import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  Box,
  Typography,
  Button,
  withStyles,
  Grid,
  MenuItem,
} from "@material-ui/core";
import { CountryIso, CityIso, StatesIso } from "~/components/CSC";
import { withTranslation } from "react-i18next";
import trim from "deep-trim-node";
import TextField from "~/components/Forms/TextField";
import CustomTextField from "~/components/Forms/CustomTextField";
import config from "~/config";
import { consumerDetails } from "~/redux/actions/DFA";
import { login } from "~/redux/actions/user";
import {
  verifyUsername,
  updateSnackbar,
} from "~/redux/actions/consumerRegistration";
import styles from "./styles";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import Phone from "~/components/TextBox/Phone";
import {
  updateBusinessUserInfo,
  registerBusinessTypePayee,
} from "~/redux/actions/USBank/consumerRegistration";

class CompanyInformation extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      isLoading: false,
      user: {},
      validation: {},
      btnDisabled: false,
      token: (state && state.token) || null,
      isVerified: (state && state.isVerified) || false,
      consumerInfo: (state && state.consumerInfo) || {},
      isSSN: 0,
      takePhoneDuringEnrollment:
        (state && state.takePhoneDuringEnrollment) || false,
    };
  }

  validateForm = () => {
    const {
      companyName,
      country,
      state,
      city,
      address,
      zipCode,
      fax,
      fedtaxId,
      ssnNumber,
      phoneNumber,
    } = this.props.updatedBusinessUserInfo;
    const { isSSN } = this.state;
    let valid = true;
    let validationErr = {};
    if (!companyName || !companyName?.trim()?.length) {
      validationErr["companyName"] = this.props.t(
        "signUp.usBankCompanyInfoError.companyNameReq"
      );
      valid = false;
    }
    if (!country || !country?.trim()?.length) {
      validationErr["country"] = this.props.t(
        "signUp.usBankCompanyInfoError.countryReq"
      );
      valid = false;
    }
    if (!state || !state?.trim()?.length) {
      validationErr["state"] = this.props.t(
        "signUp.usBankCompanyInfoError.stateReq"
      );
      valid = false;
    }
    if (!city || !city?.trim()?.length) {
      validationErr["city"] = this.props.t(
        "signUp.usBankCompanyInfoError.cityReq"
      );
      valid = false;
    }
    if (!address || !address?.trim()?.length) {
      validationErr["address"] = this.props.t(
        "signUp.usBankCompanyInfoError.addressReq"
      );
      valid = false;
    }
    if (!zipCode || !zipCode?.trim()?.length) {
      validationErr["zipCode"] = this.props.t(
        "signUp.usBankCompanyInfoError.zipCodeReq"
      );
      valid = false;
    } else if (zipCode && zipCode?.toString()?.trim()?.length < 5) {
      validationErr["zipCode"] = this.props.t(
        "signUp.usBankCompanyInfoError.zipMinLength"
      );
      valid = false;
    }
    if (
      phoneNumber &&
      phoneNumber?.toString().trim().length !== 10
    ) {
      validationErr["phoneNumber"] = this.props.t(
        "signUp.usBankCompanyInfoError.phoneNumberLength"
      );
    }
    if (fax && fax?.toString()?.trim()?.length !== 10) {
      validationErr["fax"] = this.props.t(
        "signUp.usBankCompanyInfoError.faxLength"
      );
      valid = false;
    }
    if (isSSN) {
      if (!ssnNumber || !ssnNumber?.toString()?.trim()?.length) {
        validationErr["ssnNumber"] = this.props.t(
          "signUp.usBankCompanyInfoError.ssnReq"
        );
        valid = false;
      } else if (ssnNumber?.toString()?.trim()?.length !== 9) {
        validationErr["ssnNumber"] = this.props.t(
          "signUp.usBankCompanyInfoError.ssnLength"
        );
        valid = false;
      }
    } else {
      if (!fedtaxId || !fedtaxId?.toString()?.trim()?.length) {
        validationErr["fedtaxId"] = this.props.t(
          "signUp.usBankCompanyInfoError.federalTaxIdReq"
        );
        valid = false;
      } else if (fedtaxId?.toString()?.trim()?.length !== 9) {
        validationErr["fedtaxId"] = this.props.t(
          "signUp.usBankCompanyInfoError.federalTaxIdLength"
        );
        valid = false;
      }
    }
    this.setState({ validation: validationErr });
    return valid;
  };

  handleChange = (field, event) => {
    const newUserDetail = { ...this.props.updatedBusinessUserInfo };

    switch (field) {
      case "ssnNumber":
        const ssnNumber = event.target.value.replace(/[^0-9]/g, "");
        newUserDetail[field] = ssnNumber;
        newUserDetail["fedtaxId"] = "";
        break;
      case "fedtaxId":
        const fedTaxID = event.target.value.replace(/[^0-9]/g, "");
        newUserDetail[field] = fedTaxID;
        newUserDetail["ssnNumber"] = "";
        break;
      case "fax":
        const fax = event.target.value.replace(/[^0-9]/g, "");
        newUserDetail[field] = fax;
        break;
      case "phone":
        const phoneValue = event.target.value;
        newUserDetail["phoneNumber"] = phoneValue.phone;
        newUserDetail["phoneExtNumber"] = phoneValue.ext;
        break;
      default:
        newUserDetail[field] = event.target.value;
        break;
    }

    this.props.dispatch(updateBusinessUserInfo({ ...newUserDetail }));
  };

  getConsumerDetails = () => {
    this.props.dispatch(consumerDetails()).then((response) => {
      if (!response) {
        return false;
      }
    });
  };

  handleSubmit = () => {
    let { token, consumerInfo, takePhoneDuringEnrollment } = this.state;
    const { updatedBusinessUserInfo } = this.props;
    const valid = this.validateForm();
    if (!valid) {
      return false;
    }

    if (this.props.paymentRegistration?.isUsernameValid?.error) {
      this.setState({
        validation: {
          ...valid.validationErr,
          userName: this.props.paymentRegistration.isUsernameValid.error,
        },
      });
      return false;
    }
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) || "";
    if (consumerInfo?.isMFARegistrationRequired === 1) {
      this.props.history.push({
        pathname: `${config.baseName}/${routeParam}/dfa`,
        state: {
          loginId: updatedBusinessUserInfo.userName,
          password: updatedBusinessUserInfo.password,
          dfaDetails: this.props.user?.dfaDetails,
          clientName: this.props.location.state.clientName,
          paymentAmount: this.props.location.state.paymentAmount,
          token: token,
          user: trim(updatedBusinessUserInfo),
          consumerSlugUrl: routeParam,
          consumerInfo: consumerInfo,
          isVerified: true,
          phone: consumerInfo?.phoneNumber || "",
          takePhoneDuringEnrollment: takePhoneDuringEnrollment,
        },
      });
    } else {
      this.props.handleNotification("loading", "");
      this.setState(
        {
          btnDisabled: true,
        },
        () => {
          const roleIdMask =
            this.props.updatedBusinessUserInfo.businessRoleIds?.reduce(
              function (x, y) {
                return x + y;
              },
              0
            );
          this.props
            .dispatch(
              registerBusinessTypePayee({
                userData: trim(this.props.updatedBusinessUserInfo),
                roleIdMask,
                takePhoneDuringEnrollment
              })
            )
            .then(async (response) => {
              if (!response) {
                this.props.handleNotification(
                  "error",
                  this.props.businessUserRegistrationData.error
                );
                this.setState({
                  btnDisabled: false,
                });
                return false;
              }
              this.props.dispatch(
                updateSnackbar({
                  message: this.props.t("signUp.successfullyReg"),
                  severity: "success",
                  openSnackbar: true,
                })
              );

              const routeParam =
                (this.props.match.params &&
                  this.props.match.params.clientSlug) ||
                "";
              const creds = {
                userName: this.props.updatedBusinessUserInfo.userName,
                password: this.props.updatedBusinessUserInfo.password,
                portalTypeId: 5,
                consumerSlugUrl: routeParam || "",
                isOnboarding: 1,
              };
              this.props.dispatch(login(creds)).then((response) => {
                if (!response) {
                  this.props.handleNotification("error", this.props.user.error);
                  this.setState({
                    btnDisabled: false,
                  });
                  return false;
                }
                this.getConsumerDetails();
              });
            });
        }
      );
    }
  };

  handleBlurUsername = () => {
    this.props.dispatch(verifyUsername(this.state.user.userName));
  };

  handleSSNChange = ({ target }) => {
    const { value } = target;
    const newUserDetail = { ...this.props.updatedBusinessUserInfo };
    this.setState({
      isSSN: value,
      validation: {
        ...this.state.validation,
        ssnNumber: null,
        fedtaxId: null,
      },
    });
    this.props.dispatch(
      updateBusinessUserInfo({
        ...newUserDetail,
        ssnNumber: null,
        fedtaxId: null,
      })
    );
  };

  render() {
    const { validation, btnDisabled, isSSN } =
      this.state;
    const { classes, t, updatedBusinessUserInfo } = this.props;
    const {
      companyName,
      address,
      country,
      city,
      state,
      zipCode,
      fax,
      website,
      phoneNumber,
      phoneExtNumber,
      fedtaxId,
      ssnNumber,
    } = updatedBusinessUserInfo;

    return (
      <>
        <Grid
          container
          item
          xs={11}
          sm={11}
          md={11}
          lg={11}
          xl={11}
          spacing={2}
        >
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              required
              fullWidth
              label={t("signUp.usBankCompanyInfo.companyName")}
              error={validation.companyName}
              helperText={validation.companyName || ""}
              autoFocus={false}
              autoComplete="off"
              variant="outlined"
              value={companyName || ""}
              name="companyName"
              onChange={(event) => this.handleChange("companyName", event)}
              inputProps={{
                maxLength: 50,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CountryIso
              name="country"
              label={t("signUp.usBankCompanyInfo.country")}
              selectedCountry={country}
              onChange={(e) => this.handleChange("country", e)}
              error={Boolean(validation.country)}
              helperText={validation.country}
              required
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              required
              fullWidth
              label={t("signUp.usBankCompanyInfo.address")}
              error={validation.address}
              helperText={validation.address || ""}
              autoFocus={false}
              autoComplete="off"
              variant="outlined"
              value={address || ""}
              name="address"
              onChange={(event) => this.handleChange("address", event)}
              inputProps={{
                maxLength: 70,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <StatesIso
              name="state"
              label={t("signUp.usBankCompanyInfo.state")}
              error={Boolean(validation.state)}
              helperText={validation.state}
              selectedState={state}
              selectedCountry={country}
              onChange={(e) => this.handleChange("state", e)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CityIso
              name="city"
              label={t("signUp.usBankCompanyInfo.city")}
              error={Boolean(validation.city)}
              helperText={validation.city}
              selectedState={state}
              selectedCountry={country}
              selectedCity={city}
              onChange={(e) => this.handleChange("city", e)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              required
              fullWidth
              label={t("signUp.usBankCompanyInfo.zipCode")}
              error={validation.zipCode}
              helperText={validation.zipCode || ""}
              autoFocus={false}
              autoComplete="off"
              variant="outlined"
              value={zipCode || ""}
              name="zipCode"
              onChange={(event) => this.handleChange("zipCode", event)}
              inputProps={{
                maxLength: 10,
                minLength: 5,
              }}
            />
          </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Phone
                error={validation.phoneNumber}
                helperText={validation.phoneNumber}
                id="phone"
                name="phone"
                isExt={true}
                value={phoneNumber || ""}
                prefixCcode="+1"
                onChange={(e) => this.handleChange("phone", e)}
                ext={phoneExtNumber}
                extMaxLength={4}
              />
            </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              label={t("signUp.usBankCompanyInfo.fax")}
              error={validation.fax}
              helperText={validation.fax || ""}
              autoFocus={false}
              autoComplete="off"
              variant="outlined"
              value={fax || ""}
              name="fax"
              onChange={(event) => this.handleChange("fax", event)}
              inputProps={{
                maxLength: 10,
                minLength: 10,
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
          >
            <TextField
              fullWidth
              label={t("signUp.usBankCompanyInfo.website")}
              error={validation.website}
              helperText={validation.website || ""}
              autoFocus={false}
              autoComplete="off"
              variant="outlined"
              value={website || ""}
              name="website"
              onChange={(event) => this.handleChange("website", event)}
              inputProps={{
                maxLength: 50,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField select value={isSSN} onChange={this.handleSSNChange}>
              <MenuItem value={0}>
                {t("signUp.usBankCompanyInfo.federalTaxId")}
              </MenuItem>
              <MenuItem value={1}>
                {t("signUp.usBankCompanyInfo.ssnNumber")}
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid
          container
          item
          spacing={2}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ marginTop: "8px" }}
        >
          <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
            {isSSN ? (
              <CustomTextField
                required
                label={t("signUp.usBankCompanyInfo.ssnNumber")}
                error={validation.ssnNumber}
                helperText={validation.ssnNumber || ""}
                value={ssnNumber || ""}
                name="ssnNumber"
                variant="outlined"
                fullWidth
                onChange={(event) => this.handleChange("ssnNumber", event)}
                dir="horizontal"
                inputProps={{
                  maxLength: 9,
                  minLength: 9,
                }}
                showEyeIcon={true}
              />
            ) : (
              <CustomTextField
                required
                label={t("signUp.usBankCompanyInfo.federalTaxId")}
                error={validation.fedtaxId}
                helperText={validation.fedtaxId || ""}
                value={fedtaxId || ""}
                name="fedtaxId"
                variant="outlined"
                fullWidth
                onChange={(event) => this.handleChange("fedtaxId", event)}
                dir="horizontal"
                inputProps={{
                  maxLength: 9,
                  minLength: 9,
                }}
                showEyeIcon={true}
              />
            )}
          </Grid>

          <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
            <Box mt={2} className={classes.toolTipMobAdjustment}>
              <LightTooltip
                title={
                  <>
                    <Typography>
                      {isSSN
                        ? t("signUp.usBankTooltip.ssn")
                        : t("signUp.usBankTooltip.federalTaxId")}
                    </Typography>
                  </>
                }
                placement="top-end"
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid
            item
            xs={11}
            sm={11}
            md={11}
            lg={11}
            xl={11}
            style={{ marginTop: "8px" }}
          >
            <Typography variant="h4">{t("signUp.note")}</Typography>
          </Grid>
          <Grid
            container
            item
            spacing={2}
            justifyContent="center"
            className={classes.guestUserBtn}
          >
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                onClick={() => this.props.handleTabSwitch(0)}
                className={classes.getStartedButton}
              >
                {t("signUp.buttonLabel.back")}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                disabled={btnDisabled}
                onClick={() => this.handleSubmit()}
                className={classes.getStartedButton}
              >
                {t("signUp.buttonLabel.register")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.DFA,
  ...state.paymentRegistration,
  ...state.USBankConsumerRegistration,
}))(compose(withTranslation("common"), withStyles(styles))(CompanyInformation));
