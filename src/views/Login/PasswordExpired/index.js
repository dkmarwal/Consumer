import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  MenuItem,
  CircularProgress,
  ListItem,
  ListItemText,
  List,
  TextField,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styles from "./../styles";
import {
  resetExpiredPassword,
  fetchSecurityQuestions,
} from "~/redux/actions/user";
import { fetchSecurityQuestion } from "~/redux/helpers/user";
import Notification from "~/components/Notification";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import CustomTextField from "~/components/Forms/CustomTextField";
import { LightTooltip } from "~/components/Tooltip/LightTooltip";
import clsx from 'clsx'

class PasswordExpired extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSecurityQuestion: 0,
	  selectedQuestion: "",
      progress: false,
      buttonDisabled: true,
      confirmPassword: null,
      password: null,
      securityQuestionId: null,
      securityAnswer: null,
      securityQuestionList: null,
      validation: {},
      oldPassword: null,
      variant: "success",
      modalMessage: null,
    };
  }

  componentDidMount = async() => {
	await this.getSecurityQuestion();
	this.fetchSQList();
  };

  getSecurityQuestion = () => {
    const { userName } = this.props;
    const routeParam =
      (this.props.match.params && this.props.match.params.clientSlug) ||
      "";
    fetchSecurityQuestion(userName, 5, routeParam).then((res) => {
      this.setState({
        selectedSecurityQuestion:
          res && res.data && res.data.securityQuestionId,
      });
    });
  };

  fetchSQList = () => {
    this.props.dispatch(fetchSecurityQuestions()).then((response) => {
      if (!response) {
        this.setState({
          alertMessageCallbackType: null,
          isLoading: false,
        });
        return false;
      }

      const selectedQuestionobj = this.props.user.securityQuestionList.find((item) => item.questionId == this.state.selectedSecurityQuestion);
      this.setState({
        isLoading: false,
        securityQuestionList: this.props.user.securityQuestionList,
		selectedQuestion: typeof (selectedQuestionobj) !== "undefined" ? selectedQuestionobj["question"] : ""
      });
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validateInput = () => {
    const { password, confirmPassword, securityAnswer, oldPassword } =
      this.state;
    const { t } = this.props;
    let valid = true;
    let validation = {};

    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@$!#%*?&]{8,}$/;
    if (!password || !password?.trim()?.length) {
      validation["password"] = t("login.passwordExpired.error.newPasswordReq");
      valid = false;
    } else if (!re.test(password.trim())) {
      validation["password"] = t("login.passwordExpired.error.password");
      valid = false;
    }
    if (!oldPassword || !oldPassword?.trim()?.length) {
      validation["oldPassword"] = t(
        "login.passwordExpired.error.oldPasswordReq"
      );
      valid = false;
    }
    if (!confirmPassword || !confirmPassword?.trim().length) {
      validation["confirmPassword"] = t(
        "login.passwordExpired.error.confirmNewPasswordReq"
      );
      valid = false;
    } else if (password && confirmPassword && confirmPassword !== password) {
      validation["confirmPassword"] = t(
        "login.passwordExpired.error.confirmPassword"
      );
      valid = false;
    }
    if (!securityAnswer || !securityAnswer?.trim()?.length) {
      validation["securityAnswer"] = t(
        "login.passwordExpired.error.empty_securityAnswer"
      );
      valid = false;
    } else if (
      securityAnswer?.trim()?.length > 0 &&
      securityAnswer?.trim()?.length < 6
    ) {
      validation["securityAnswer"] = t(
        "login.passwordExpired.error.securityAnswer"
      );
      valid = false;
    }
    this.setState({ validation: { ...validation } });
    return valid;
  };

  getQueryVar = (key) => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) === key) {
        return decodeURIComponent(pair[1]);
      }
    }
  };
  onSubmit = async () => {
    const isValid = this.validateInput();
    const rParam =
      (this.props.match.params &&
        this.props.match.params.clientSlug) ||
      "";
    if (isValid) {
      this.setState(
        {
          progress: true,
        },
        async () => {
          const {
            password,
            selectedSecurityQuestion,
            securityAnswer,
            oldPassword,
          } = this.state;
          const { userName } = this.props;

          this.props
            .dispatch(
              resetExpiredPassword({
                userName,
                oldPassword,
                updatedPassword: password,
                securityQuestionId: selectedSecurityQuestion,
                securityAnswer, rParam
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  progress: false,
                  variant: "error",
                  modalMessage: this.props.user.error,
                });
                return false;
              }
              this.setState({
                progress: false,
                buttonDisabled: true,
                variant: "success",
                modalMessage: this.props.user.error,
              });
              const { user } = this.props;
              if (
                user &&
                user.dfaDetails &&
                user.dfaDetails.isMFALoginRequired === 1
              ) {
                this.props.onCancel();
              } else {
                this.postLogin();
              }
            });
        }
      );
    }
  };
  postLogin = () => {
    this.props.getConsumerDetails();
  };
  render() {
    const {
      securityQuestionList,
      oldPassword,
      password,
      confirmPassword,
      securityAnswer,
      validation,
      selectedSecurityQuestion,
      variant,
      modalMessage,
	  selectedQuestion
    } = this.state;
    const { classes, user, t } = this.props;
    const brandInfo = user?.brandInfo ?? {};
    const clientLogo = brandInfo.logo || null;
    return (
      <Fragment>
        <Grid container justify="center">
          <Grid
            item
            xs={12}
            md={this.props.i18n.language === "fr" ? 9 : 8}
            lg={this.props.i18n.language === "fr" ? 9 : 8}
          >
            <Box p={1} my={4} bgcolor="white" borderRadius={8}>
              {clientLogo && (
                <Box
                  display="flex"
                  justifyContent="center"
                  mt={2}
                  alignItems="center"
                >
                  <img
                    src={clientLogo}
                    alt="Client logo"
                    className={classes.imageAvatar || ""}
                    height="34"
                  />
                </Box>
              )}
              <Box display="flex" justifyContent="center" mt={2} mx={1}>
                <Typography variant="h3" className={clsx("welcomeHeader", classes.welcomeText)}>
                {this.props.user.brandInfo.login_welcome_msg}
                </Typography>
              </Box>

              <Box display="flex" pt={3} justifyContent="center">
                <Typography variant="body1" className={classes.heading}>
                  {t("login.passwordExpired.label.resetPassword")}
                </Typography>
              </Box>
              <Box mt={2}>
                <Box p={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={11} lg={11}>
                      <CustomTextField
                        required
                        error={validation && validation.oldPassword}
                        name="oldPassword"
                        id="oldPassword"
                        placeholder={t(
                          "login.passwordExpired.placeholder.oldPassword"
                        )}
                        label={t(
                          "login.passwordExpired.placeholder.oldPassword"
                        )}
                        type="password"
                        value={oldPassword}
                        onChange={this.handleChange}
                        helperText={validation && validation.oldPassword}
                        showEyeIcon={false}
                        InputProps={{
                          classes: {
                            root: classes.passwordTextField,
                          },
                        }}
                        inputProps={{
                          autocomplete: "new-password",
                        }}
                      />
                    </Grid>
                    <Grid item xs={11} lg={11}>
                      <CustomTextField
                        required
                        error={validation && validation.password}
                        helperText={validation && validation.password}
                        name="password"
                        id="password"
                        placeholder={t(
                          "login.passwordExpired.placeholder.newPassword"
                        )}
                        label={t(
                          "login.passwordExpired.placeholder.newPassword"
                        )}
                        type="password"
                        value={password}
                        onChange={this.handleChange}
                        showEyeIcon={true}
                        InputProps={{
                          classes: {
                            root: classes.passwordTextField,
                          },
                        }}
                        inputProps={{
                          autocomplete: "new-password",
                        }}
                      />
                    </Grid>
                    <Grid item xs={1} lg={1} alignItems="center">
                      <Box mt={2}>
                        <LightTooltip
                          title={
                            <>
                              <Typography>
                                {t(
                                  "signUp.passwordTooltip.passwordRequirements"
                                )}
                              </Typography>
                              <List>
                                <ListItem className={classes.listItemsTooltip}>
                                  <ListItemText>
                                    <span style={{ paddingRight: "4px" }}>
                                      {"\u2022"}
                                    </span>
                                    {t("signUp.passwordTooltip.point1")}
                                  </ListItemText>
                                </ListItem>
                                <ListItem className={classes.listItemsTooltip}>
                                  <ListItemText>
                                    <span style={{ paddingRight: "4px" }}>
                                      {"\u2022"}
                                    </span>
                                    {t("signUp.passwordTooltip.point2")}
                                  </ListItemText>
                                </ListItem>
                                <ListItem className={classes.listItemsTooltip}>
                                  <ListItemText>
                                    <span style={{ paddingRight: "4px" }}>
                                      {"\u2022"}
                                    </span>
                                    {t("signUp.passwordTooltip.point3")}
                                  </ListItemText>
                                </ListItem>
                                <ListItem className={classes.listItemsTooltip}>
                                  <ListItemText>
                                    <span style={{ paddingRight: "4px" }}>
                                      {"\u2022"}
                                    </span>
                                    {t("signUp.passwordTooltip.point4")}
                                  </ListItemText>
                                </ListItem>
                                <ListItem className={classes.listItemsTooltip}>
                                  <ListItemText>
                                    <span style={{ paddingRight: "4px" }}>
                                      {"\u2022"}
                                    </span>
                                    {t("signUp.passwordTooltip.point5")}
                                  </ListItemText>
                                </ListItem>
                              </List>
                            </>
                          }
                          placement="right"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={11} lg={11}>
                      <CustomTextField
                        required
                        error={validation && validation.confirmPassword}
                        helperText={validation && validation.confirmPassword}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder={t(
                          "login.passwordExpired.placeholder.confirmPassword"
                        )}
                        label={t(
                          "login.passwordExpired.placeholder.confirmPassword"
                        )}
                        type="password"
                        value={confirmPassword}
                        onChange={this.handleChange}
                        showEyeIcon={true}
                        InputProps={{
                          classes: {
                            root: classes.passwordTextField,
                          },
                        }}
                        inputProps={{
                          autocomplete: "new-password",
                        }}
                      />
                    </Grid>
                    <Grid item xs={11} lg={11}>
                      <TextField
                        disabled={true}
                        label={t(
                          "login.passwordExpired.placeholder.securityQuestionId"
                        )}
                        required
                        error={validation && validation.securityQuestionId}
                        helperText={validation && validation.securityQuestionId}
						title={selectedQuestion || ""}
                        fullWidth={true}
                        select
                        value={selectedSecurityQuestion}
                        autoComplete="off"
                        color="secondary"
                        variant="outlined"
                        name="securityQuestionId"
                        classes={{ root: classes.optionQuestionLenght }}
                        onChange={this.handleChange}
                      >
                        {securityQuestionList ? (
                          securityQuestionList.map((option) => (
                            <MenuItem
                              key={option.questionId}
                              value={option.questionId}
                            >
                              <Box component="div" whiteSpace="normal">
                                {option.question}
                              </Box>
                            </MenuItem>
                          ))
                        ) : (
                          <Box
                            width="100px"
                            display="flex"
                            mt={1.875}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <CircularProgress color="primary" />
                          </Box>
                        )}
                      </TextField>
                    </Grid>
                    <Grid item xs={11} lg={11}>
                      <TextField
                        color="secondary"
                        required
                        error={validation && validation.securityAnswer}
                        helperText={validation && validation.securityAnswer}
                        name="securityAnswer"
                        id="securityAnswer"
                        label={t(
                          "login.passwordExpired.placeholder.securityAnswer"
                        )}
                        placeholder={t(
                          "login.passwordExpired.placeholder.securityAnswer"
                        )}
                        type="password"
                        variant="outlined"
                        value={securityAnswer}
                        onChange={this.handleChange}
                        InputProps={{
                          classes: {
                            root: classes.passwordTextField,
                          },
                        }}
                        inputProps={{
                          minLength: 6,
                          autocomplete: "new-password",
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box justifyContent="center" display="flex">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.onSubmit()}
                    size="medium"
                    className={classes.passExpSave}
                  >
                    {t("login.passwordExpired.label.save")}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        {modalMessage && (
          <Notification variant={variant} message={modalMessage} />
        )}
      </Fragment>
    );
  }
}

export default connect((state) => ({ ...state.user }))(
  compose(withTranslation("common"), withStyles(styles))(PasswordExpired)
);
