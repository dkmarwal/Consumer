/**
 * For New consumer Enrollment journey
 * consists of eye icon in text field
 * on the basis of props
 */

import React from 'react';
import {
  TextField as MUITextField,
  withStyles,
  InputAdornment,
} from '@material-ui/core';

import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import clsx from 'clsx';
const styles = (theme) => ({
  textField: {
    fontSize: '16px',
    color: theme.palette.common.dark,
  },
  imgIcon: {
    padding: '2px',
  },
  cssLabel: {
    color: theme.palette.common.main,
    fontSize: '14px',
  },
  cssDisabled: {
    '&::before': {
      borderBottomStyle: 'solid',
    },
  },
  cssFilledInput: {
    lineHeight: '16px',
    fontSize: '16px',
    '&::before': {
      borderBottom: `1px solid ${theme.palette.primary.light}`,
    },
    '&$cssDisabled': {
      '&::before': {
        borderBottom: `1px solid rgba(0,0,0,0.42)`,
      },
    },
    '& .MuiInputBase-input': {
      color: theme.palette.common.dark,
      // display: 'flex',
    },
  },
  errorLabel: {
    '& .MuiFormLabel-root.Mui-error': {
      color: '#E02020 !important',
    },
  },
  eyeIcon: {
    color: "#4c4c4c",
    cursor: 'pointer'
  }
});

const CustomTextField = (props) => {
  const {
    classes,
    id,
    name,
    label,
    value,
    type = 'text',
    required,
    select,
    onChange,
    onBlur,
    helperText,
    error,
    disabled,
    children,
    showEyeIcon,
    cardType,
    inputProps,
    t,
    tReady,
    showStarred,
    ...restProps
  } = props;

  const [visibleText, setVisibleText] = React.useState(false);
  const showText = () => {
    setVisibleText(!visibleText);
  };

  return (
    <div>
      <MUITextField
        color='secondary'
        autoComplete="off"
        autoFocus={false}
        select={select ? true : false}
        name={name}
        id={id}
        label={label}
        type={showEyeIcon && !showStarred ? (visibleText ? 'text' : 'password') : type}
        variant="outlined"
        value={value}
        required={required ? true : false}
        className={clsx(classes.textField, error && classes.errorLabel)}
        inputProps={{
          ...inputProps,
        }}
        InputLabelProps={{
          classes: {
            root: classes.cssLabel,
          },
        }}
        InputProps={{
          endAdornment: showEyeIcon ? (
            <InputAdornment position="end">
              {visibleText ? (
                <VisibilityIcon
                  onClick={() => showText()}
                  fontSize="small"
                  className={classes.eyeIcon}
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() => showText()}
                  fontSize="small"
                  className={classes.eyeIcon}
                />
              )}
            </InputAdornment>
          ) : null,
          classes: {
            root: classes.cssFilledInput,
            disabled: classes.cssDisabled,
          },
        }}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        disabled={disabled}
        fullWidth
        {...restProps}
      >
        {select && children}
      </MUITextField>
    </div>
  );
};

export default compose(
  withTranslation('common'),
  withStyles(styles)
)(CustomTextField);
