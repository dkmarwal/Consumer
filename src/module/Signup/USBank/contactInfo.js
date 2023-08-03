import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  MenuItem,
  withStyles,
  Grid,
  TextField as SelectMenuTextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { withTranslation } from 'react-i18next';
import TextField from '~/components/Forms/TextField';
import { consumerDetails } from '~/redux/actions/DFA';
import { fetchSecurityQuestions } from '~/redux/actions/user';
import { verifyUsername } from '~/redux/actions/consumerRegistration';
import styles from './styles';
import { LightTooltip } from '~/components/Tooltip/LightTooltip';
import Phone from '~/components/TextBox/Phone';
import {
  updateBusinessUserInfo,
  fetchBusinessUserRoles,
} from '~/redux/actions/USBank/consumerRegistration';
import CustomTextField from "~/components/Forms/CustomTextField";

class CompanyInformation extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      isLoading: false,
      user: {},
      validation: {},
      isVerified: (state && state.isVerified) || false,
      businessRoleIds: [],
      consumerInfo: (state && state.consumerInfo) || {},
      openPhoneModal: false,
      takePhoneDuringEnrollment:
        (state && state.takePhoneDuringEnrollment) || false,
    };
  }

  componentDidMount = () => {
    this.fetchSQList();
    this.props.dispatch(fetchBusinessUserRoles());
  };

  fetchSQList = () => {
    this.props.dispatch(fetchSecurityQuestions()).then((response) => {
      if (!response) {
        this.props.handleNotification('error', this.props.user.error);
        return false;
      }
    });
  };

  validateForm = () => {
    const {
      title,
      userName,
      firstName,
      lastName,
      password,
      confirmPassword,
      cphoneNumber,
      workEmail,
      securityQuestionId,
      securityAnswer,
      businessRoleIds,
    } = this.props.updatedBusinessUserInfo;
    const {takePhoneDuringEnrollment} = this.state
    let valid = true;
    let validationErr = {};
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
    if (!title || !title?.trim()?.length) {
      validationErr['title'] = this.props.t(
        'signUp.usBankContactInfoError.titleReq'
      );
      valid = false;
    }

    if (!userName || userName.trim() === '') {
      validationErr['userName'] = this.props.t(
        'signUp.usBankContactInfoError.userNameRequired'
      );
      valid = false;
    } else {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (
        userName &&
        userName.trim().length > 0 &&
        re.test(userName.trim().toLowerCase())
      ) {
        validationErr['userName'] = this.props.t(
          'signUp.usBankContactInfoError.userNameNotEmail'
        );
        valid = false;
      }
      if (
        userName &&
        userName.trim().length > 0 &&
        userName.trim().length < 8
      ) {
        validationErr['userName'] = this.props.t(
          'signUp.usBankContactInfoError.userName'
        );
        valid = false;
      }
    }

    if (!firstName || !firstName?.trim().length) {
      validationErr['firstName'] = this.props.t(
        'signUp.usBankContactInfoError.firstNameReq'
      );
      valid = false;
    }

    if (!lastName || !lastName?.trim().length) {
      validationErr['lastName'] = this.props.t(
        'signUp.usBankContactInfoError.lastNameReq'
      );
      valid = false;
    }

    if (!workEmail || !workEmail?.trim().length) {
      validationErr['workEmail'] = this.props.t(
        'signUp.usBankContactInfoError.workEmailReq'
      );
      valid = false;
    } else {
      const emailRe =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRe.test(workEmail?.trim()?.toLowerCase())) {
        validationErr['workEmail'] = this.props.t(
          'signUp.usBankContactInfoError.workEmailErr'
        );
        valid = false;
      }
    }

  if (takePhoneDuringEnrollment && cphoneNumber && cphoneNumber?.toString().trim().length !== 10) {
      validationErr['cphoneNumber'] = this.props.t(
        'signUp.usBankContactInfoError.phoneNumberLength'
      );
    }

    if (!password || (password && password.trim() === '')) {
      validationErr['password'] = this.props.t(
        'signUp.usBankContactInfoError.passwordRequired'
      );
      valid = false;
    }

    if (password && !re.test(password.trim())) {
      validationErr['password'] = this.props.t(
        'signUp.usBankContactInfoError.password'
      );
      valid = false;
    }

    if (!confirmPassword || confirmPassword.trim() === '') {
      validationErr['confirmPassword'] = this.props.t(
        'signUp.usBankContactInfoError.confirmPasswordRequired'
      );
      valid = false;
    } else if (password !== confirmPassword) {
      validationErr['confirmPassword'] = this.props.t(
        'signUp.usBankContactInfoError.confirmPassword'
      );
      valid = false;
    }

    if (
      !securityQuestionId ||
      (securityQuestionId && securityQuestionId === 0)
    ) {
      validationErr['securityQuestionId'] = this.props.t(
        'signUp.usBankContactInfoError.securityQuestionId'
      );
      valid = false;
    }
    if (!securityAnswer) {
      validationErr['securityAnswer'] = this.props.t(
        'signUp.usBankContactInfoError.securityAnswerReq'
      );
      valid = false;
    } else if (
      securityAnswer &&
      securityAnswer.trim().length > 0 &&
      securityAnswer.trim().length < 6
    ) {
      validationErr['securityAnswer'] = this.props.t(
        'signUp.usBankContactInfoError.securityAnswer'
      );
      valid = false;
    }

    if (!businessRoleIds?.length) {
      validationErr['businessRoleIds'] = this.props.t(
        'signUp.usBankContactInfoError.rolesRequired'
      );
      valid = false;
    }

    this.setState({ validation: validationErr });
    return { valid, validationErr };
  };

  handleChange = ({ target }) => {
    const newUserDetail = { ...this.props.updatedBusinessUserInfo };
    const { name, value, checked } = target;

    switch (name) {
      case 'userName':
        const userName = value.replace(/[^A-Za-z0-9-,_.@]/g, '');
        newUserDetail[name] = userName;
        break;
      case 'securityAnswer':
        const securityAnswer = value.replace(/[^A-Za-z0-9]/g, '');
        newUserDetail[name] = securityAnswer;
        break;
      case 'ssnNumber':
        const ssnNumber = value.replace(/[^0-9]/g, '');
        newUserDetail[name] = ssnNumber;
        break;
      case 'phoneNumber':
        const phoneValue = value;
        newUserDetail['cphoneNumber'] = phoneValue.phone;
        newUserDetail['cphoneExtNumber'] = phoneValue.ext;
        break;
      case 'isCertify':
        newUserDetail[name] = checked;
        break;
      default:
        newUserDetail[name] = value;
        break;
    }

    this.props.dispatch(updateBusinessUserInfo({ ...newUserDetail }));
  };

  handleBusinessUserRoles = ({ target }) => {
    const newUserDetail = { ...this.props.updatedBusinessUserInfo };
    const { value } = target;
    const { businessRoleIds } = this.state;
    const selectedRoleIds = [...businessRoleIds];
    const selectedIdIndex = selectedRoleIds.indexOf(parseInt(value));
    if (selectedIdIndex !== -1) {
      selectedRoleIds.splice(selectedIdIndex, 1);
    } else {
      selectedRoleIds.push(parseInt(value));
    }
    this.props.dispatch(
      updateBusinessUserInfo({
        ...newUserDetail,
        businessRoleIds: selectedRoleIds,
      })
    );
    this.setState({
      businessRoleIds: selectedRoleIds,
    });
  };

  getConsumerDetails = () => {
    this.props.dispatch(consumerDetails()).then((response) => {
      if (!response) {
        return false;
      }
    });
  };

  handleNext = async () => {
    const isDataValid = this.validateForm();
    const { userName } = this.props.updatedBusinessUserInfo;
    if (isDataValid.valid) {
      const isUserNameValid = await this.props.dispatch(
        verifyUsername(userName)
      );
      if (isUserNameValid) {
        this.props.handleTabSwitch(2);
      } else {
        this.handleUserNameValidation();
        return false;
      }
    } else {
      return false;
    }
  };

  handleUserNameValidation = () => {
    const { userName } = this.props.updatedBusinessUserInfo;
    if (
      userName?.trim()?.length &&
      this.props.paymentRegistration?.isUsernameValid?.error
    ) {
      this.setState({
        validation: {
          ...this.state.validation,
          userName: this.props.paymentRegistration.isUsernameValid.error,
        },
      });
      return false;
    }
  };

  render() {
    const { validation,takePhoneDuringEnrollment } =
      this.state;
    const { classes, t, updatedBusinessUserInfo, businessUserRoles, user } =
      this.props;
    const { securityQuestionList } = user;

    const {
      title,
      userName,
      firstName,
      lastName,
      password,
      confirmPassword,
      workEmail,
      cphoneNumber,
      cphoneExtNumber,
      securityQuestionId,
      securityAnswer,
      isCertify,
      businessRoleIds,
    } = updatedBusinessUserInfo;

    return (
      <>
        <input type="email" name="userName" style={{ display: "none" }} />
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          style={{ display: "none" }}
        />
        <Grid container spacing={2}>
          <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <TextField
                  error={validation && validation.title}
                  helperText={validation && validation.title}
                  select
                  fullWidth
                  autoComplete="off"
                  variant="outlined"
                  name="title"
                  label={t("signUp.usBankContactInfo.title")}
                  value={title}
                  onChange={this.handleChange}
                >
                  <MenuItem value=" ">
                    <em>{t("signUp.usBankContactInfo.select")}</em>
                  </MenuItem>
                  <MenuItem value="Mr">
                    {t("signUp.usBankContactInfo.mr")}
                  </MenuItem>
                  <MenuItem value="Mrs">
                    {t("signUp.usBankContactInfo.mrs")}
                  </MenuItem>
                  <MenuItem value="Ms">
                    {t("signUp.usBankContactInfo.ms")}
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <TextField
                  required
                  fullWidth
                  label={t("signUp.usBankContactInfo.userName")}
                  error={validation.userName}
                  helperText={validation.userName || ""}
                  autoFocus={false}
                  autoComplete="off"
                  variant="outlined"
                  value={userName || ""}
                  name="userName"
                  onChange={this.handleChange}
                  inputProps={{
                    maxLength: 50,
                    autocomplete: "new-password",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
            <Box mt={2} className={classes.toolTipMobAdjustment}>
              <LightTooltip
                title={
                  <Typography>{t("signUp.usBankTooltip.username")}</Typography>
                }
                placement="top-end"
              />
            </Box>
          </Grid>
          <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <TextField
                  required
                  fullWidth
                  label={t("signUp.usBankContactInfo.firstName")}
                  error={validation.firstName}
                  helperText={validation.firstName || ""}
                  autoFocus={false}
                  autoComplete="off"
                  variant="outlined"
                  value={firstName || ""}
                  name="firstName"
                  onChange={this.handleChange}
                  inputProps={{
                    maxLength: 50,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <TextField
                  required
                  fullWidth
                  label={t("signUp.usBankContactInfo.lastName")}
                  error={validation.lastName}
                  helperText={validation.lastName || ""}
                  autoFocus={false}
                  autoComplete="off"
                  variant="outlined"
                  value={lastName || ""}
                  name="lastName"
                  onChange={this.handleChange}
                  inputProps={{
                    maxLength: 50,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <CustomTextField
                  required
                  label={t("signUp.usBankContactInfo.password")}
                  error={validation.password}
                  helperText={validation.password || ""}
                  fullWidth={true}
                  autoFocus={false}
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onDrag={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  variant="outlined"
                  value={password || ""}
                  name="password"
                  type="password"
                  onChange={this.handleChange}
                  showEyeIcon={true}
                  inputProps={{
                    autocomplete: "new-password",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <CustomTextField
                  required
                  label={t("signUp.usBankContactInfo.confirmPassword")}
                  error={validation.confirmPassword}
                  helperText={validation.confirmPassword || ""}
                  fullWidth={true}
                  autoFocus={false}
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onDrag={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  variant="outlined"
                  value={confirmPassword || ""}
                  name="confirmPassword"
                  type="password"
                  onChange={this.handleChange}
                  showEyeIcon={true}
                  inputProps={{
                    autocomplete: "new-password",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
            <Box mt={2} className={classes.toolTipMobAdjustment}>
              <LightTooltip
                title={
                  <Typography>{t("signUp.usBankTooltip.password")}</Typography>
                }
                placement="top-end"
              />
            </Box>
          </Grid>
          <Grid item xs={11} sm={11}>
            <TextField
              label={t("signUp.usBankContactInfo.workEmail")}
              error={validation.workEmail}
              required
              helperText={validation.workEmail || ""}
              value={workEmail || ""}
              name="workEmail"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
              dir="horizontal"
              inputProps={{
                maxLength: 100,
              }}
            />
          </Grid>
          {takePhoneDuringEnrollment ? (
            <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
              <Phone
                error={validation.cphoneNumber}
                helperText={validation.cphoneNumber}
                id="phone"
                name="phoneNumber"
                value={cphoneNumber || ""}
                prefixCcode="+1"
                onChange={this.handleChange}
                isExt={true}
                ext={cphoneExtNumber}
                extMaxLength={4}
              />
            </Grid>
          ) : null}

          <Grid item xs={11} sm={11}>
            <SelectMenuTextField
              required
              color="secondary"
              error={validation.securityQuestionId}
              helperText={validation.securityQuestionId || ""}
              select
              SelectProps={{
                MenuProps: {
                  classes: {
                    paper: classes.mobHeight,
                    list: classes.mobWidth,
                  },
                },
              }}
              classes={{ root: classes.optionQuestionLenght }}
              value={securityQuestionId || ""}
              name="securityQuestionId"
              label={t("signUp.usBankContactInfo.securityQuestion")}
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
              dir="horizontal"
            >
              {securityQuestionList ? (
                securityQuestionList.map((option) => (
                  <MenuItem
                    // className={classes.mobHeight}
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
            </SelectMenuTextField>
          </Grid>

          <Grid item xs={11} sm={11}>
            <TextField
              label={t("signUp.usBankContactInfo.securityAnswer")}
              error={validation.securityAnswer}
              required
              helperText={validation.securityAnswer || ""}
              value={securityAnswer || ""}
              name="securityAnswer"
              variant="outlined"
              type="password"
              fullWidth
              onChange={this.handleChange}
              dir="horizontal"
              inputProps={{
                maxLength: 100,
                autocomplete: "new-password",
              }}
            />
          </Grid>

          <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
            <Typography variant="h4">
              {t("signUp.usBankContactInfo.yourRole")}
            </Typography>
            {validation.businessRoleIds && (
              <FormHelperText error={Boolean(validation.businessRoleIds)}>
                {validation.businessRoleIds}
              </FormHelperText>
            )}
            <FormGroup row>
              {businessUserRoles?.data?.map((role) => {
                return (
                  <FormControlLabel
                    label={role.displayName}
                    key={role.roleId}
                    control={
                      <Checkbox
                        checked={businessRoleIds.includes(role.roleId)}
                        value={role.roleId}
                        name="isName"
                        onChange={this.handleBusinessUserRoles}
                        icon={<CheckBoxOutlineBlankIcon />}
                        checkedIcon={<CheckBoxIcon />}
                      />
                    }
                  />
                );
              })}
            </FormGroup>
            <FormGroup style={{ marginTop: "8px" }}>
              <FormControlLabel
                label={t("signUp.usBankContactInfo.disclaimer")}
                control={
                  <Checkbox
                    checked={Boolean(isCertify)}
                    name="isCertify"
                    onChange={this.handleChange}
                    icon={<CheckBoxOutlineBlankIcon />}
                    checkedIcon={<CheckBoxIcon />}
                  />
                }
              />
            </FormGroup>
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
                variant="contained"
                color="primary"
                disableElevation
                disabled={!isCertify}
                onClick={() => this.handleNext()}
                className={classes.getStartedButton}
              >
                {t("signUp.buttonLabel.next")}
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
  ...state.consumerVerification,
}))(compose(withTranslation('common'), withStyles(styles))(CompanyInformation));
