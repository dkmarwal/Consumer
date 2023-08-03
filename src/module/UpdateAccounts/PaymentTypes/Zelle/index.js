import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  CircularProgress,
  MenuItem,
  Modal,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Notification from "~/components/Notification";
import { connect } from "react-redux";
import { createConsumerZelle } from "~/redux/actions/paymentRegistration";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import ConsumerEnrollmentRemittance from "~/module/Remittance/UpdateAccounts";
import { preferencePaymentType } from "~/config/consumerEnrollmentConst";
import { EmailDeliveryModeId } from "~/config/consumerEnrollmentConst";
import {
  updateConsumerZelleInfo,
  fetchConsumerPaymentDetails,
} from "~/redux/actions/accounts";
import { getMFAStatus } from "~/redux/helpers/user";
import MaskedInput from "~/components/MaskedInput";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import { CheckboxGroup } from "~/components/Forms";
import MFA from "~/module/DFA/MFA";

const styles = (theme) => ({
  container: {
    backgroundColor: "#fff",
    padding: "0",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
    },
    marginBottom: "64px",
    "& h1": {
      fontSize: "16px",
      color: "#000",
      padding: "16px 0 30px 0",
    },
  },
  zelleForm: {
    float: "left",
    width: "100%",
    "& .MuiTextField-root": {
      width: "96%",
      margin: "0 4% 0 0",
      "& .MuiInputLabel-shrink": {
        backgroundColor: "#fff",
      },
    },
    "& .MuiFormControl-root": {
      width: "96%",
      margin: "0 4% 0 0",
      "& .MuiInputLabel-shrink": {
        backgroundColor: "#fff",
      },
    },
    "& .countryCode": {
      width: "100px",
    },
    "& .MuiGrid-item": {
      width: "auto",
      display: "inline-block",
    },
    "& .phoneNumber": {
      width: "300px",
      margin: "0",
      "& input": {
        padding: "19.5px",
      },
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.38) !important",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      color: "rgba(0, 0, 0, 0.38) !important",
    },
  },
  BtnContainer: {
    textAlign: "center",
    display: "block",
    width: "100%",
    margin: "40px 0 0",
    "& button": {
      margin: "0 10px",
      padding: "6px 35px",
      cursor: "pointer",
    },
  },
  authModal: {
    maxWidth: "756px",
    margin: "0 auto",
  },
  backButton: {
    width: 140,
    cursor: "pointer",
    marginRight: "32px",
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
  },
  shareButton: {
    background: `${theme.palette.primary.main}`,
    // borderRadius: theme.spacing(0.75),
    color: theme.palette.common.white,
    width: 140,
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.primary.main,
    },
  },
  zelleHeading: {
    fontSize: "1.5rem",
    marginRight: theme.spacing(1),
    color: theme.palette.common.dark,
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.2rem",
    },
  },
});

class Zelle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenType: "email",
      TokenValue: "",
      countryCode: null,
      inProgress: false,
      errMsg: {
        variant: null,
        notificationMsg: null,
        phoneErr: null,
        emailErr: null,
      },
      remittanceEmail: null,
      openAuthModal: false,
      zelleId: null,
      createAcc:null,
      showMFA: false,
      phoneNum: "",
      phoneCode: "",
      otp: null,
    };
  }

  componentDidMount = () => {
    const { consumerPaymentDetails } = this.props.accounts;
    const ZelleDetailsInfo =
      consumerPaymentDetails?.data?.consumerZelleDetails ?? null;
    if (ZelleDetailsInfo) {
      this.setState({
        tokenType: ZelleDetailsInfo.tokenType,
        TokenValue: ZelleDetailsInfo.tokenValue,
        countryCode: ZelleDetailsInfo.phoneCountryCode,
        zelleId: ZelleDetailsInfo.zelleDetailId,
      });
    } else {
      const { consumerPaymentTypesList } = this.props.paymentRegistration;
      if (
        consumerPaymentTypesList?.data &&
        !consumerPaymentTypesList.data.getZelleTokenFromConsumer
      ) {
        this.setState({
          tokenType: consumerPaymentTypesList.data.zelleTokenType,
          TokenValue: consumerPaymentTypesList.data.zelleTokenValue,
          countryCode: consumerPaymentTypesList.data.zelleTokenType === "phone" ? '+1' : null
        });
      }
    }
  };

  handleSelect = (value) => {
    const { consumerPaymentDetails } = this.props.accounts;
    const ZelleDetailsInfo =
      consumerPaymentDetails?.data?.consumerZelleDetails ?? null;
    this.setState({
      tokenType: value,
      TokenValue: value === ZelleDetailsInfo?.tokenType ? ZelleDetailsInfo?.tokenValue : null,
      countryCode: null,
      errMsg: {
        phoneErr: null,
        emailErr: null,
      },
    });
  };

  handlePhoneChange = (e, type) => {
    if (type === "countryCode") {
      this.setState({
        countryCode: e.target.value,
      });
    } else if (type === "phone") {
      this.setState({
        TokenValue: e.target.value,
        countryCode: "+1",
      });
    }
  };

  handleMailChange = (e) => {
    this.setState({
      TokenValue: e.target.value,
    });
  };

  handleRemittanceEmailValidation = () => {
    const { paymentRegistration, t } = this.props;
    const { selectedRemittanceConfigData } = paymentRegistration;
    const reg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (
      selectedRemittanceConfigData &&
      selectedRemittanceConfigData.remittanceDetails?.find(
        (item) => item.deliveryModeId === EmailDeliveryModeId
      )
    ) {
      if (!selectedRemittanceConfigData.remittanceEmail) {
        return t("updatedAccounts.remittance.emailIdRequired");
      } else if (
        !reg.test(
          String(selectedRemittanceConfigData.remittanceEmail).toLowerCase()
        )
      ) {
        return t("updatedAccounts.remittance.validEmailId");
      }
    }
    return false;
  };

  formValidation = () => {
    const { tokenType, TokenValue } = this.state;
    const { t } = this.props;
    const mailRegx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valid = true;
    let validation = {};
    const remittanceEmailError = this.handleRemittanceEmailValidation();
    let { getZelleTokenFromConsumer } =
      this.props.paymentRegistration?.consumerPaymentTypesList?.data;
    if (getZelleTokenFromConsumer) {
      if (tokenType === "email" && !mailRegx.test(TokenValue)) {
        valid = false;
        validation = {
          ...validation,
          // variant: "error",
          // notificationMsg: "Validation error",
          phoneErr: null,
          emailErr: t("updatedAccounts.remittance.validEmailId"),
        };
      } else if (
        tokenType === "phone" &&
        TokenValue &&
        TokenValue.length < 10
      ) {
        valid = false;
        validation = {
          ...validation,
          // variant: "error",
          // notificationMsg: "Validation error",
          emailErr: null,
          phoneErr: t("updatedAccounts.error.validPhoneNumber"),
        };
      }
    }

    if (remittanceEmailError) {
      this.setState({
        remittanceEmail: remittanceEmailError,
      });
      valid = false;
    }
    this.setState({
      errMsg: validation,
    });
    return valid;
  };

  onSubmit = () => {
    const isValid = this.formValidation();
    const { tokenType, TokenValue, countryCode } = this.state;
    const { setNotificationMessage, dispatch, t } = this.props;
    const { selectedRemittanceConfigData, isRemittanceEnabled } =
      this.props.paymentRegistration;
    let { getZelleTokenFromConsumer } =
      this.props.paymentRegistration?.consumerPaymentTypesList?.data;

    const preferenceType = preferencePaymentType.preferred;

    if (!Boolean(TokenValue) && getZelleTokenFromConsumer) {
      this.setState({
        errMsg: {
          ...this.state.errMsg,
          phoneErr: t("updatedAccounts.error.emptyPhoneNumber"),
          emailErr: t("updatedAccounts.error.emptyToken"),
        },
      });
    } else if (isRemittanceEnabled && !selectedRemittanceConfigData) {
      this.setState({
        errMsg: {
          ...this.state.errMsg,
          variant: "error",
          notificationMsg: t("updatedAccounts.remittance.deliveryMode"),
        },
      });
    } else if (isValid) {
      this.setState(
        {
          inProgress: true,
          remittanceEmail: null,
        },
        () => {

          if (!this.state.zelleId) {
            const type = 'payment_preference';
            getMFAStatus(type).then((response) => {
              if (!response) {
                this.setState({
                  ...this.state,
                  inProgress: false,
                  errMsg: {
                    ...this.state.errMsg,
                    variant: "error",
                    notificationMsg:
                      response?.message ??
                      t("updatedAccounts.message.somethingWentWrong"),
                  },
                });
                return false;
              }
              if (response?.data?.isMfaStatusRequired === 1) {
                this.setState({
                  showMFA: true,
                  phoneNum: response?.data?.phoneNumber,
                  phoneCode: response?.data?.phoneCountryCode,
                  inProgress: false,
                  createAcc: true
                });
              } else {
                this.handleCreateAcc(false);
              }
            });
          } else {
            const type = 'payment_preference';
            getMFAStatus(type).then((response) => {
              if (!response) {
                this.setState({
                  ...this.state,
                  inProgress: false,
                  errMsg: {
                    ...this.state.errMsg,
                    variant: "error",
                    notificationMsg:
                      response?.message ??
                      t("updatedAccounts.message.somethingWentWrong"),
                  },
                });
                return false;
              }
              if (response?.data?.isMfaStatusRequired === 1) {
                this.setState({
                  showMFA: true,
                  phoneNum: response?.data?.phoneNumber,
                  phoneCode: response?.data?.phoneCountryCode,
                  inProgress: false,
                  createAcc: false
                });
              } else {
                this.handleEditAcc(false);
              }
            });
          }
        }
      );
    }
  };

  handleCreateAcc = (flag) =>{
    const { tokenType, TokenValue, countryCode } = this.state;
    const { setNotificationMessage, dispatch, t } = this.props;
    const { selectedRemittanceConfigData, isRemittanceEnabled } =
      this.props.paymentRegistration;
    let { getZelleTokenFromConsumer } =
      this.props.paymentRegistration?.consumerPaymentTypesList?.data;
    const { otp } = this.state;
    const mfaOTP = flag ? otp : null; 
    const preferenceType = preferencePaymentType.preferred;

    let remittanceData = null;
    if (selectedRemittanceConfigData) {
      remittanceData = [
        ...selectedRemittanceConfigData.remittanceDetails,
      ];
      const isEmailSelected =
        selectedRemittanceConfigData.remittanceDetails?.findIndex(
          (item) => item.deliveryModeId === EmailDeliveryModeId
        );
      if (isEmailSelected > -1) {
        remittanceData[isEmailSelected].remittanceEmailId =
          selectedRemittanceConfigData.remittanceEmail;
      }
    }
    dispatch(
      createConsumerZelle(
        tokenType, //bugfix FSINPAYB2B-9990
        TokenValue,
        countryCode,
        preferenceType,
        remittanceData,
        mfaOTP,
      )
    ).then((res) => {
      if (!res) {
        const { error } =
          this.props.paymentRegistration?.zelleInfo ?? {};
        this.setState({
          ...this.state,
          inProgress: false,
          errMsg: {
            ...this.state.errMsg,
            variant: "error",
            notificationMsg: Boolean(error) && error,
          },
        });
        return false;
      } else {
        this.setState({
          inProgress: false,
        });
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          t(
            "updatedAccounts.message.successfulPreferredPaymentMethod",
            {
              paymentMethodName: "Zelle",
            }
          )
        );
      }
    });
  }

  handleEditAcc = (flag) => {
    const { tokenType, TokenValue, countryCode, otp } = this.state;
    const { setNotificationMessage, dispatch, t } = this.props;
    const { selectedRemittanceConfigData } = this.props.paymentRegistration;
    const preferenceType = preferencePaymentType.preferred;
    let remittanceData = null;
    if (selectedRemittanceConfigData) {
      remittanceData = [...selectedRemittanceConfigData.remittanceDetails];
      const isEmailSelected =
        selectedRemittanceConfigData.remittanceDetails?.findIndex(
          (item) => item.deliveryModeId === EmailDeliveryModeId
        );
      if (isEmailSelected > -1) {
        remittanceData[isEmailSelected].remittanceEmailId =
          selectedRemittanceConfigData.remittanceEmail;
      }
    }
    dispatch(
      updateConsumerZelleInfo(
        tokenType, //bugfix FSINPAYB2B-9990
        TokenValue,
        tokenType === "email" ? null : countryCode,
        preferenceType,
        remittanceData,
        this.state.zelleId,
        flag ? otp : null
      )
    ).then((response) => {
      if (!response) {
        const { error } = this.props.accounts?.zelleInfo ?? {};
        this.setState({
          ...this.state,
          inProgress: false,
          errMsg: {
            ...this.state.errMsg,
            variant: "error",
            notificationMsg: Boolean(error) && error,
          },
        });
        return false;
      } else {
        dispatch(fetchConsumerPaymentDetails());
        setNotificationMessage(
          t("updatedAccounts.message.successfulPreferredPaymentMethod", {
            paymentMethodName: "Zelle",
          })
        );
        this.setState({
          processingUpdate: false,
        });
      }
    });
  };
  closeNotification = () => {
    this.setState({
      ...this.state,
      errMsg: {
        ...this.state.errMsg,
        variant: null,
        notificationMsg: null,
      },
    });
  };

  handleRemittanceEmailError = () => {
    this.setState({
      remittanceEmail: null,
    });
  };

  renderPhone = (getZelleTokenFromConsumer) => {
    const { t } = this.props;
    const { errMsg } = this.state;
    return (
      <Grid container item xs={12} sm={12} md={12} lg={12}>
        <Grid item xs={4} sm={4} md={3} lg={3}>
          <TextField
            select
            autoComplete="off"
            autoFocus={false}
            variant="outlined"
            value={"+1"}
            label={t("updatedAccounts.label.countryCode")}
            className="countryCode"
            name="countryCode"
            inputProps={{
              maxLength: 5,
            }}
            style={{ width: "90%" }}
            // onChange={(e) => {
            //   this.handlePhoneChange(e, 'countryCode');
            // }}
            disabled={!getZelleTokenFromConsumer}
          >
            {[{ name: "+1", sortname: "", phonecode: "+1" }].map(
              ({ name, sortname, phonecode }) => (
                <MenuItem key={sortname} value={`${phonecode}`}>
                  {`${phonecode}`}
                </MenuItem>
              )
            )}
          </TextField>
        </Grid>
        <Grid item xs={8} sm={8} md={9} lg={9}>
          <MaskedInput
            fullWidth={true}
            color="secondary"
            variant="outlined"
            autoComplete="off"
            autoFocus={false}
            value={this.state.TokenValue || ""}
            name="phone"
            type="text"
            label={t("updatedAccounts.label.phoneNumber")}
            required
            className="phoneNumber"
            onChange={(e) => {
              this.handlePhoneChange(e, "phone");
            }}
            placeholder={"XXX-XXX-XXXX"}
            error={Boolean(errMsg.phoneErr)}
            helperText={errMsg.phoneErr}
            formatterProps={{
              format: "###-###-####",
              isNumericString: true,
            }}
            inputProps={{
              maxLength: 10,
            }}
            disabled={!getZelleTokenFromConsumer}
          />
        </Grid>
      </Grid>
    );
  };

  render() {
    const { t, classes, closeDialog, paymentRegistration, ...otherProps } =
      this.props;
    const {
      tokenType,
      TokenValue,
      inProgress,
      errMsg,
      remittanceEmail,
      showMFA,
      phoneNum,
      phoneCode,createAcc,
    } = this.state;
    const { consumerPaymentTypesList } = paymentRegistration;
    const { remittanceStatus } = this.props.accounts;
    const { emailErr, notificationMsg, variant } = errMsg;
    let getZelleTokenFromConsumer = null;
    if (this.props.paymentRegistration?.consumerPaymentTypesList) {
      getZelleTokenFromConsumer =
        this.props.paymentRegistration.consumerPaymentTypesList.data
          .getZelleTokenFromConsumer;
    }

    const labelToShow = t("updatedAccounts.zelle.content.zelleInformation");

    return (
      <>
        <Grid container spacing={2} className={classes.container}>
          <>
            <Grid item xs={12} lg={11}>
              <Grid container display="flex" alignItems="center">
                <Typography className={classes.zelleHeading}>
                  {labelToShow}
                </Typography>
                <span>
                  <LightTooltip
                    title={t("updatedAccounts.tooltipText.zelle", {
                      threshold:
                        consumerPaymentTypesList?.data?.thresholds?.CXC,
                    })}
                    placement="right"
                  />
                </span>
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={8} md={5} lg={6}>
                <CheckboxGroup
                  options={[
                    {
                      label: this.props.t("updatedAccounts.label.email"),
                      value: "email",
                    },
                    {
                      label: this.props.t("updatedAccounts.label.phoneNumber"),
                      value: "phone",
                    },
                  ]}
                  selectedOption={tokenType}
                  onChange={(val) => {
                    this.handleSelect(val.value);
                  }}
                  disabled={!getZelleTokenFromConsumer}
                />
              </Grid>

              <Grid item xs={12} lg={11}>
                {Boolean(tokenType) && tokenType === "phone" ? (
                  this.renderPhone(getZelleTokenFromConsumer)
                ) : (
                  <TextField
                    required
                    id="mailInput"
                    label={t("updatedAccounts.zelle.label.tokenValue")}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    value={TokenValue}
                    onChange={(e) => this.handleMailChange(e)}
                    autoComplete="off"
                    error={Boolean(emailErr)}
                    helperText={emailErr}
                    disabled={!getZelleTokenFromConsumer}
                  />
                )}
              </Grid>
            </Grid>
            {remittanceStatus?.data?.isRemittanceEnabled ? (
              <Grid item xs={12} lg={11}>
                <ConsumerEnrollmentRemittance
                  remittanceEmailError={remittanceEmail}
                  handleRemittanceEmailError={this.handleRemittanceEmailError}
                  {...otherProps}
                />
              </Grid>
            ) : null}
          </>
          {showMFA && (
            <Modal
              open={showMFA}
              onClose={() =>
                this.setState({ showMFA: false, inProgress: false })
              }
            >
              <MFA
                onBtnClick={(otp) => {
                  this.setState(
                    {
                      showMFA: false,
                      otp: otp,
                    },
                    () => {
                      createAcc ? this.handleCreateAcc(true) :
                      this.handleEditAcc(true)
                    }
                  );
                }}
                onCancelClick={() =>
                  this.setState({ showMFA: false, inProgress: false })
                }
                phoneNum={phoneNum}
                phoneCode={phoneCode}
                MFAType={"PostLoginMFA"}
              />
            </Modal>
          )}

          <Grid container justifyContent="center">
            {inProgress ? (
              <CircularProgress />
            ) : (
              <Grid
                container
                item
                xs={11}
                sm={7}
                md={11}
                lg={8}
                justifyContent="center"
                spacing={2}
                style={{ marginTop: "8px" }}
              >
                <Grid item xs={6} sm={4} md={4} lg={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={(e) => closeDialog()}
                  >
                    {t("updatedAccounts.buttonLabel.cancel")}
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={this.props.i18n.language === "fr" ? 10 : 6}
                  sm={this.props.i18n.language === "fr" ? 6 : 4}
                  md={4}
                  lg={4}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={() => this.onSubmit()}
                  >
                    {t("updatedAccounts.buttonLabel.update")}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        {notificationMsg && (
          <Notification
            variant={variant}
            message={notificationMsg}
            handleClose={() => this.closeNotification()}
          />
        )}
      </>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.paymentRegistration,
  ...state.accounts,
}))(compose(withTranslation("common"), withStyles(styles))(Zelle));
