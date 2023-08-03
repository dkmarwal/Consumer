import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import {
  Typography,
  Button,
  Box,
  Modal,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  CircularProgress,
  TextField,
} from '@material-ui/core';
import { connect } from 'react-redux';
import CustomTextField from '~/components/Forms/CustomTextField';
import { styles } from './styles';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  fetchUserProfileDetails,
  updateB2CUserProfileDetails,
  deleteB2CUserProfile,
  getMFAStatus,
} from '~/redux/helpers/user';
import Notification from '~/components/Notification';
import {
  postProfileDelete,
  fetchSecurityQuestions,
} from '~/redux/actions/user';
import ConfirmationDialog from '~/components/Dialogs/confirmationDialog';
import config from '~/config';
import { Link } from 'react-router-dom';
import { LightTooltip } from '~/components/Tooltip/LightTooltip';
import MFA from '~/module/DFA/MFA';
import Phone from '~/components/TextBox/Phone';

const EditProfile = (props) => {
  const { classes, user, t } = props;
  const routeParam =
    (props.match.params && props.match.params.clientSlug) || '';
  const { info, securityQuestionList } = user;
  const [profileInfo, setProfileInfo] = useState({
    userName: '',
    oldPassword: '',
    defPassword: '',
    password: '',
    confirmNewPassword: '',
    otp: null,
    securityQuestionId: null,
    securityAnswer: '',
    phone: '',
    phoneCountryCode: '',
  });
  const [validation, setValidation] = useState({});
  const [notificationVariant, setNotificationVariant] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [passDialog, setPassDialog] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [phoneNum, setPhoneNum] = useState('');
  const [phoneCode, setPhoneCode] = useState('');

  React.useEffect(() => {
    fetchUserProfileDetails(info.userId).then((response) => {
      if (response.data) {
        const {
          securityQuestionId,
          userName,
          securityAnswer,
          phone,
          phoneCountryCode,
        } = response.data;
        setProfileInfo({
          ...profileInfo,
          userName,
          securityQuestionId,
          phone,
          securityAnswer,
          phoneCountryCode,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  React.useEffect(() => {
    fetchSQList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSQList = () => {
    props.dispatch(fetchSecurityQuestions()).then((response) => {
      if (!response) {
        setNotificationMessage(
          this.props.user.error ??
            t('editProfile.userProfileFieldName.somethingWentWrong')
        );
        setNotificationVariant('error');
        return false;
      }
    });
  };

  const handleValidation = () => {
    const { userName, oldPassword, password, confirmNewPassword, phone, securityAnswer, securityQuestionId } = profileInfo;
    let isValid = true;
    const tempValidation = {};
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!userName || !userName.trim().length) {
      tempValidation.userName = t(
        'editProfile.userProfileFieldName.userNameReq'
      );
      isValid = false;
    }

    if (passDialog) {
      if (!oldPassword || !oldPassword.trim().length) {
        tempValidation.oldPassword = t(
          'editProfile.userProfileFieldName.oldPassReq'
        );
        isValid = false;
      }

      if (!password || !password.trim().length) {
        tempValidation.password = t(
          'editProfile.userProfileFieldName.newPassReq'
        );
        isValid = false;
      } else {
        if (!re.test(password.trim())) {
          tempValidation['password'] = t(
            'editProfile.userProfileFieldName.PasswordSuggestion'
          );
          isValid = false;
        } else if (
          !confirmNewPassword ||
          !confirmNewPassword.trim().length ||
          confirmNewPassword.trim() !== password.trim()
        ) {
          tempValidation.confirmNewPassword = t(
            'editProfile.userProfileFieldName.invalidNewPassword'
          );
          isValid = false;
        }
      }
    } else {
      if (!oldPassword || !oldPassword.trim().length) {
        tempValidation.oldPassword = t(
          'editProfile.userProfileFieldName.passReq'
        );
        isValid = false;
      }
    }

    if(!securityQuestionId){
      tempValidation.securityQuestionId = t(
        'editProfile.userProfileFieldName.securityQuestionReq'
      );
      isValid = false;
    }
    if(!securityAnswer || !securityAnswer.trim()?.length){
      tempValidation.securityAnswer = t(
        'editProfile.userProfileFieldName.securityAnswerReq'
      );
      isValid = false;
    } else if(securityAnswer.trim().length < 6){
      tempValidation.securityAnswer = t(
        'editProfile.userProfileFieldName.securityAnswerLength'
      );
      isValid = false;
    }
    if(!phone || !phone.trim()?.length){
      tempValidation.phone = t(
        'editProfile.userProfileFieldName.phoneReq'
      );
      isValid = false;
    } else if(phone.toString().trim().length<10){
      tempValidation.phone = t(
        'editProfile.userProfileFieldName.phoneLength'
      );
      isValid = false;
    }

    setValidation(tempValidation);
    return isValid;
  };

  const handleEditProfile = () => {
    setNotificationVariant(null);
    setNotificationMessage(null);
    const isValid = handleValidation();
    if (isValid) {
      if (passDialog) {
        const type = 'profile_update';
        getMFAStatus(type).then((response) => {
          if (!response || response.error) {
            setNotificationMessage(
              response?.message ??
                t('editProfile.userProfileFieldName.somethingWentWrong')
            );
            setNotificationVariant('error');
            return false;
          }
          if (response?.data?.isMfaStatusRequired === 1) {
            setShowMFA(true);
            setPhoneNum(response?.data?.phoneNumber);
            setPhoneCode(response?.data?.phoneCountryCode);
          } else {
            updateProfile(null);
          }
        });
      } else {
        updateProfile(null);
      }
    }
  };
  const updateProfile = (otp) => {
    setProfileInfo({ ...profileInfo, otp: otp });
    updateB2CUserProfileDetails({ ...profileInfo, otp: otp }).then(
      (response) => {
        if (!response || response.error) {
          setNotificationMessage(
            response?.message ??
              t('editProfile.userProfileFieldName.somethingWentWrong')
          );
          setNotificationVariant('error');
        } else {
          setNotificationVariant('success');
          setNotificationMessage(response.message);
        }
      }
    );
  };

  const handleChange = (fieldName, { target }) => {
    const { value } = target;
    switch (fieldName) {
      case 'userName':
        const userName = value.replace(/[^A-Za-z0-9-,_.@]/g, '');
        setProfileInfo({ ...profileInfo, [fieldName]: userName });
        break;
      case 'securityAnswer':
        const securityAnswer = value.replace(/[^A-Za-z0-9]/g, '');
        setProfileInfo({ ...profileInfo, [fieldName]: securityAnswer });
        break;
      case 'phone':
        const phoneValue = value;
        setProfileInfo({ ...profileInfo, [fieldName]: phoneValue.phone });
        break;
      default:
        setProfileInfo({ ...profileInfo, [fieldName]: value });
        break;
    }
  };

  const handleDeleteProfile = () => {
    setNotificationVariant(null);
    setNotificationMessage(null);
    deleteB2CUserProfile().then((response) => {
      if (!response || response.error) {
        setNotificationMessage(
          response?.message ??
            t('editProfile.userProfileFieldName.somethingWentWrong')
        );
        setNotificationVariant('error');
      } else {
        setTimeout(() => {
          props.dispatch(postProfileDelete());
        }, 1000);
        setNotificationVariant('success');
        setNotificationMessage(response.message);
      }
    });
  };

  const handleDelete = () => {
    setOpenDialog(false);
    handleDeleteProfile();
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const redirectToDashboard = () => {
    props.history.push(`${config.baseName}/${routeParam}/`);
  };

  const toggleNewPass = () => {
    setPassDialog(!passDialog);
    setProfileInfo({
      ...profileInfo,
      oldPassword: '',
      password: '',
      confirmNewPassword: '',
    });
    setValidation({});
  };

  return (
    <>
      <Modal open={showMFA} onClose={() => setShowMFA(false)}>
        <MFA
          onBtnClick={(otp) => {
            setShowMFA(false);
            // setProfileInfo({ ...profileInfo, otp: num });
            updateProfile(otp);
          }}
          onCancelClick={() => setShowMFA(false)}
          phoneNum={phoneNum}
          phoneCode={phoneCode}
          MFAType={'PostLoginMFA'}
          isProfileUpdate={1}
        />
      </Modal>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
        lg={12}
        md={12}
        xl={9}
      >
        <Grid
          item
          lg={12}
          md={12}
          xl={12}
          className={classes.profileTabContainer}
          style={{ background: 'none' }}
        >
          <Grid
            container
            item
            spacing={2}
            alignItems='center'
            className={classes.marginClass}
            style={{ marginBottom: '16px' }}
          >
            <Grid item xs sm md lg xl className={classes.profileDetailHeading}>
              <Typography variant='h1'>
                {t('editProfile.userProfileFieldName.profileDetails')}
              </Typography>
            </Grid>
            <Grid
              xs={1}
              md={1}
              lg={1}
              xl={1}
              style={{ cursor: 'pointer' }}
              onClick={() => handleOpenDialog()}
            >
              <DeleteIcon fontSize='small' />
            </Grid>
          </Grid>
          <Grid
            item
            container
            spacing={2}
            alignItems='top'
            className={classes.marginClass}
          >
            <Grid item xs sm md lg xl>
              <CustomTextField
                fullWidth
                label={t('editProfile.userProfileFieldName.userName')}
                required
                name='userName'
                variant='outlined'
                value={profileInfo.userName || ''}
                error={Boolean(validation.userName)}
                helperText={validation.userName}
                onChange={(e) => handleChange('userName', e)}
                autoComplete='off'
                inputProps={{
                  maxLength: 50,
                  autocomplete: 'new-password',
                }}
              />
            </Grid>
            <Grid xs={1} md={1} lg={1} xl={1}>
              <Box mt={3}>
                <LightTooltip
                  title={
                    <List>
                      <ListItem className={classes.listItemsTooltip}>
                        <ListItemText>
                          <span style={{ paddingRight: '4px' }}>
                            {'\u2022'}
                          </span>
                          {t('signUp.usernameTooltip.point1')}
                        </ListItemText>
                      </ListItem>
                      <ListItem className={classes.listItemsTooltip}>
                        <ListItemText>
                          <span style={{ paddingRight: '4px' }}>
                            {'\u2022'}
                          </span>
                          {t('signUp.usernameTooltip.point2')}
                        </ListItemText>
                      </ListItem>
                      <ListItem className={classes.listItemsTooltip}>
                        <ListItemText>
                          <span style={{ paddingRight: '4px' }}>
                            {'\u2022'}
                          </span>
                          {t('signUp.usernameTooltip.point3')}
                        </ListItemText>
                      </ListItem>
                    </List>
                  }
                  placement='top-end'
                />
              </Box>
            </Grid>
          </Grid>

          <Grid
            item
            container
            spacing={2}
            alignItems='top'
            className={classes.marginClass}
          >
            <Grid item xs={11} sm={8} md={8} lg xl>
              {' '}
              {passDialog ? (
                <CustomTextField
                  label={t('editProfile.userProfileFieldName.OldPassword')}
                  required
                  name='oldPassword'
                  variant='outlined'
                  value={profileInfo.oldPassword}
                  error={Boolean(validation.oldPassword)}
                  helperText={validation.oldPassword}
                  onChange={(e) => handleChange('oldPassword', e)}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onDrag={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  autoComplete='off'
                  type='password'
                  showEyeIcon={false}
                  fullWidth
                  inputProps={{
                    autocomplete: 'new-password',
                  }}
                />
              ) : (
                <CustomTextField
                  label={t('editProfile.userProfileFieldName.password')}
                  required
                  name='oldPassword'
                  variant='outlined'
                  value={profileInfo.oldPassword}
                  error={Boolean(validation.oldPassword)}
                  helperText={validation.oldPassword}
                  onChange={(e) => handleChange('oldPassword', e)}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onDrag={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  autoComplete='off'
                  type='password'
                  showEyeIcon={true}
                  fullWidth
                  inputProps={{
                    autocomplete: 'new-password',
                  }}
                />
              )}
            </Grid>
            <Grid
              item
              xs
              sm
              md
              lg={props.i18n.language !== 'en' ? 4 : 3}
              xl={props.i18n.language !== 'en' ? 3 : 2}
            >
              <Box mt={{ xs: 0, sm: 2, md: 2, lg: 2 }}>
                <Link
                  to='#'
                  className={classes.changePassContainer}
                  onClick={() => toggleNewPass()}
                >
                  <Typography className={classes.changePass}>
                    {t('editProfile.userProfileFieldName.changePass')}
                  </Typography>
                </Link>
              </Box>
            </Grid>
          </Grid>
          {passDialog ? (
            <Grid
              item
              container
              alignItems='top'
              spacing={2}
              className={classes.marginClass}
            >
              <Grid item xs={11} sm={11} md lg xl>
                <CustomTextField
                  fullWidth
                  label={t('editProfile.userProfileFieldName.NewPassword')}
                  required
                  name='password'
                  variant='outlined'
                  value={profileInfo.password}
                  error={Boolean(validation.password)}
                  type='password'
                  autoComplete='off'
                  helperText={validation.password}
                  onChange={(e) => handleChange('password', e)}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onDrag={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  showEyeIcon={true}
                />
              </Grid>
              <Grid item xs={11} sm={11} md lg xl>
                <CustomTextField
                  fullWidth
                  label={t(
                    'editProfile.userProfileFieldName.ConfirmNewPassword'
                  )}
                  required
                  name='confirmNewPassword'
                  variant='outlined'
                  value={profileInfo.confirmNewPassword}
                  error={Boolean(validation.confirmNewPassword)}
                  helperText={validation.confirmNewPassword}
                  onChange={(e) => handleChange('confirmNewPassword', e)}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onDrag={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  autoComplete='off'
                  type='password'
                  showEyeIcon={true}
                />
              </Grid>
              <Grid xs={1} md={1} lg={1} xl={1}>
                <Box mt={3}>
                  <LightTooltip
                    title={
                      <>
                        <Typography>
                          {t('signUp.passwordTooltip.passwordRequirements')}
                        </Typography>
                        <List>
                          <ListItem className={classes.listItemsTooltip}>
                            <ListItemText>
                              <span style={{ paddingRight: '4px' }}>
                                {'\u2022'}
                              </span>
                              {t('signUp.passwordTooltip.point1')}
                            </ListItemText>
                          </ListItem>
                          <ListItem className={classes.listItemsTooltip}>
                            <ListItemText>
                              <span style={{ paddingRight: '4px' }}>
                                {'\u2022'}
                              </span>
                              {t('signUp.passwordTooltip.point2')}
                            </ListItemText>
                          </ListItem>
                          <ListItem className={classes.listItemsTooltip}>
                            <ListItemText>
                              <span style={{ paddingRight: '4px' }}>
                                {'\u2022'}
                              </span>
                              {t('signUp.passwordTooltip.point3')}
                            </ListItemText>
                          </ListItem>
                          <ListItem className={classes.listItemsTooltip}>
                            <ListItemText>
                              <span style={{ paddingRight: '4px' }}>
                                {'\u2022'}
                              </span>
                              {t('signUp.passwordTooltip.point4')}
                            </ListItemText>
                          </ListItem>
                          <ListItem className={classes.listItemsTooltip}>
                            <ListItemText>
                              <span style={{ paddingRight: '4px' }}>
                                {'\u2022'}
                              </span>
                              {t('signUp.passwordTooltip.point5')}
                            </ListItemText>
                          </ListItem>
                        </List>
                      </>
                    }
                    placement='top-end'
                  />
                </Box>
              </Grid>
            </Grid>
          ) : null}
          <Grid
            item
            container
            spacing={2}
            alignItems='top'
            className={classes.marginClass}
          >
            <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
              <Phone
                error={validation.phone}
                helperText={validation.phone}
                id='phone'
                name='phone'
                required
                value={(profileInfo && profileInfo.phone) || ''}
                prefixCcode='+1'
                onChange={(e) => handleChange('phone', e)}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            spacing={2}
            alignItems='top'
            className={classes.marginClass}
          >
            <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
              <TextField
                required
                color='secondary'
                error={validation.securityQuestionId}
                helperText={validation.securityQuestionId || ''}
                select
                SelectProps={{
                  MenuProps: {
                    classes: {
                      paper: classes.mobHeight,
                    },
                  },
                }}
                classes={{ root: classes.optionQuestionLenght }}
                value={profileInfo.securityQuestionId || ''}
                name='securityQuestionId'
                label={t(
                  'editProfile.userProfileFieldName.securityQuestion'
                )}
                variant='outlined'
                fullWidth
                onChange={(event) => handleChange('securityQuestionId', event)}
                dir='horizontal'
              >
                {securityQuestionList ? (
                  securityQuestionList.map((option) => (
                    <MenuItem
                      // className={classes.mobHeight}
                      key={option.questionId}
                      value={option.questionId}
                    >
                      <Box component='div' whiteSpace='normal'>
                        {option.question}
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <Box
                    width='100px'
                    display='flex'
                    mt={1.875}
                    justifyContent='center'
                    alignItems='center'
                  >
                    <CircularProgress color='primary' />
                  </Box>
                )}
              </TextField>
            </Grid>
          </Grid>
          <Grid
            item
            container
            spacing={2}
            alignItems='top'
            className={classes.marginClass}
          >
            <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
              <CustomTextField
                fullWidth
                label={t(
                  'editProfile.userProfileFieldName.securityAnswer'
                )}
                required
                inputProps={{
                  maxLength: 100,
                  autocomplete: "new-password",
                }}
                name='securityAnswer'
                variant='outlined'
                value={profileInfo.securityAnswer}
                error={Boolean(validation.securityAnswer)}
                type='password'
                autoComplete='off'
                helperText={validation.securityAnswer}
                onChange={(e) => handleChange('securityAnswer', e)}
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent='center'
            xs={12}
            md={12}
            lg={12}
            xl={12}
            spacing={2}
            style={{ marginTop: '8px' }}
          >
            <Grid item xs={6} sm={4} md={4} lg={3}>
              <Button
                variant='outlined'
                color='primary'
                fullWidth
                onClick={() => redirectToDashboard()}
              >
                {t('editProfile.userProfileFieldName.cancelButtonText')}
              </Button>
            </Grid>
            <Grid
              item
              xs={props.i18n.language === 'fr' ? 10 : 6}
              sm={4}
              md={4}
              lg={3}
            >
              <Button
                fullWidth
                variant='contained'
                color='primary'
                onClick={() => handleEditProfile()}
              >
                {t('editProfile.userProfileFieldName.saveButtonText')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {notificationMessage && (
          <Notification
            variant={notificationVariant}
            message={notificationMessage}
            handleClose={() => {
              setNotificationMessage(null);
              setNotificationVariant(null);
            }}
          />
        )}
        <ConfirmationDialog
          handleClose={handleCloseDialog}
          open={openDialog}
          handleConfirmation={handleDelete}
          dialogTitle={t('editProfile.userProfileFieldName.deleteDialogTitle')}
          dialogContentText={t(
            'editProfile.userProfileFieldName.deleteDialogText'
          )}
          confrimationButtonName={t(
            'editProfile.userProfileFieldName.deleteButtonText'
          )}
          cancelButtonName={t(
            'editProfile.userProfileFieldName.cancelButtonText'
          )}
        />
      </Grid>
    </>
  );
};

export default connect((state) => ({
  ...state.user,
  ...state.DFA,
}))(compose(withTranslation('common'), withStyles(styles))(EditProfile));
