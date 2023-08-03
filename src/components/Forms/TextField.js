import React from "react";
import {
  TextField as MUITextField,
  withStyles,
  Tooltip,
  InputAdornment,
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import clsx from "clsx";

const styles = (theme) => ({
  textField: {
    fontSize: "16px",
    color: theme.palette.common.dark,
    "& .MuiFormLabel-root.Mui-disabled":{
      color:'rgba(0, 0, 0, 0.38) !important'
    }
  },
  imgIcon: {
    padding: "2px",
  },
  cssLabel: {
    color: theme.palette.common.main,
    fontSize: "14px",
  },
  cssDisabled: {
    "&::before": {
      borderBottomStyle: "solid",
    },
  },
  cssFilledInput: {
    lineHeight: "16px",
    fontSize: "16px",
    "&::before": {
      borderBottom: `1px solid ${theme.palette.primary.light}`,
    },
    "&$cssDisabled": {
      "&::before": {
        borderBottom: `1px solid rgba(0,0,0,0.42)`,
      },
    },
    "& .MuiInputBase-input": {
      color: theme.palette.common.dark,
      display: "flex",
    },
    "& .MuiInputBase-input.Mui-disabled":{
      color:"rgba(0, 0, 0, 0.38)"
    }
  },
  errorLabel: {
    "& .MuiFormLabel-root.Mui-error": {
      color: "#E02020 !important",
    },
  },
});

const TextField = (props) => {
  const {
    classes,
    id,
    name,
    label,
    value,
    type,
    required,
    select,
    onChange,
    onBlur,
    onClick,
    helperText,
    error,
    disabled,
    children,
    tooltipProps,
    showPaymentIcons,
    cardType,
    inputProps,
    t,
    tReady,
    endAdornmentText,
    ...restProps
  } = props;
  const getPaymentIcon = () => {
    switch (cardType) {
      case "Both":
        return (
          <>
            <img
              src={require(`~/assets/icons/visa.svg`)}
              className={classes.imgIcon}
              alt=""
            />
            <img
              src={require(`~/assets/icons/master_card.svg`)}
              className={classes.imgIcon}
              alt=""
            />
          </>
        );
      case "Visa":
        return (
          <>
            <img
              src={require(`~/assets/icons/visa.svg`)}
              className={classes.imgIcon}
              alt=""
            />
          </>
        );
      case "MasterCard":
        return (
          <>
            <img
              src={require(`~/assets/icons/master_card.svg`)}
              className={classes.imgIcon}
              alt=""
            />
          </>
        );
      default:
        return (
          <>
            <img
              src={require(`~/assets/icons/visa.svg`)}
              className={classes.imgIcon}
              alt=""
            />
            <img
              src={require(`~/assets/icons/master_card.svg`)}
              className={classes.imgIcon}
              alt=""
            />
          </>
        );
    }
  };

  const info = tooltipProps && (
    <Tooltip
      title={tooltipProps.title}
      arrow
      placement="right"
    >
      {tooltipProps.icon || <InfoOutlinedIcon />}
    </Tooltip>
  );

  return (
    <div>
      <MUITextField
        color="secondary"
        autoComplete="off"
        autoFocus={false}
        select={select ? true : false}
        name={name}
        id={id}
        label={label}
        type={type}
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
          endAdornment: showPaymentIcons ? (
            <InputAdornment position="end">
              {
                <Tooltip title={""} arrow placement="right">
                  {getPaymentIcon()}
                </Tooltip>
              }
            </InputAdornment>
          ) : tooltipProps ? (
            <InputAdornment position="end">{info}</InputAdornment>
          ) : endAdornmentText ?? null,
          classes: {
            root: classes.cssFilledInput,
            disabled: classes.cssDisabled,
          },
        }}
        onChange={onChange}
        onClick={onClick}
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
  withTranslation("common"),
  withStyles(styles)
)(TextField);
