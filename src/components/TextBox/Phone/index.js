import React, { useRef } from "react";
import { Grid, Box, withStyles, InputLabel, MenuItem } from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import MaskedInput from "~/components/MaskedInput";
import { withTranslation } from "react-i18next";
import { compose } from "redux";

const styles = (theme) => ({
  grid: {
    margin: 0,
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
  },
  gridItem: {
    padding: theme.spacing(3),
  },
});

const Phone = (props) => {
  const {
    isExt = false,
    isCountryCode = true,
    prefixCcode,
    value,
    ext,
    ccode,
    error,
    helperText,
    phoneExtHelperText = "",
    placeholder = "",
    onChange,
    label = "",
    disabled = false,
    ccodeDisabled = true,
    required,
    inputProps,
    t,
    placeHolderText = "",
    extMaxLength=10,
    ...restProps
  } = props;
  const { classes } = props;

  const phoneValue = [prefixCcode, ccode, value, ext];
  let phone = {
    ccode: ccode || prefixCcode,
    num: value,
    ext: ext,
    value: phoneValue.join(""),
  };

  const numRef = useRef(null);
  const extRef = useRef(null);

  function handleChange(event, position) {
    const newValue = event.target.value.trim();

    if (isNaN(event.target.value) && (position === 2 || position === 3)) {
      return false;
    }

    const tempPhone = newValue.split("");
    switch (position) {
      case 1:
        phone.ccode = newValue || "";
        //phone.ccode.length===4 && numRef.current.focus();
        numRef.current && numRef.current.focus();
        break;
      case 2:
        phone.num = newValue || "";
        tempPhone.length === 10 && extRef.current && extRef.current.focus();
        break;
      case 3:
        phone.ext = newValue || "";
        break;
      default:
        break;
    }

    const phoneValue = [phone.ccode, phone.num, phone.ext];
    const newPhone = {
      ccode: phone.ccode,
      num: phone.num,
      ext: phone.ext,
      value: phoneValue.join(""),
    };
    phone = { ...newPhone };

    onChange({
      target: {
        name: props.name,
        value: {
          phone: phone.num,
          ext: phone.ext,
          ccode: phone.ccode,
          prefixCcode: prefixCcode,
        },
      },
    });
  }

  return (
    <Grid
      container
      item
      // direction={dir}
      justify="center"
      alignItems="center"
      className={classes.grid}
    >
      {label && (
        <Grid item xs={6} md={4}>
          <InputLabel
            className={classes.label}
            htmlFor={`component${error ? "-error" : ""}${
              disabled ? "-disabled" : ""
            }`}
          >
            {label}
            {required ? (
              <span style={{ color: "red", fontSize: "10px" }}>*</span>
            ) : (
              ""
            )}
          </InputLabel>
        </Grid>
      )}
      <Grid container item xs={label ? 6 : 12} md={label ? 8 : 12}>
        <Grid item xs md lg>
          {isCountryCode === true && (
            <Box>
              <TextField
                select
                required={required ? true : false}
                placeholder={placeholder || ""}
                disabled={ccodeDisabled}
                autoComplete="off"
                autoFocus={false}
                variant="outlined"
                value={"+1"}
                label={t("textBox.label.country")}
                className="countyCode"
                inputProps={{
                  maxLength: 5,
                  ...inputProps,
                }}
                onChange={(e) => {
                  handleChange(e, 1);
                }}
                {...restProps}
              >
                {[{ name: "+1", sortname: "", phonecode: "+1" }].map(
                  ({ name, sortname, phonecode }) => (
                    <MenuItem key={sortname} value={`${phonecode}`}>
                      {`${phonecode}`}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Box>
          )}
        </Grid>
        <Grid item xs={8} md={8} lg={8}>
          <Box ml={2}>
            <MaskedInput
              disabled={disabled}
              fullWidth={true}
              required={Boolean(required)}
              color="secondary"
              variant="outlined"
              autoComplete="off"
              autoFocus={false}
              value={phone.num || ""}
              name="phone"
              type="text"
              label={label || t("textBox.label.phone")}
              inputRef={numRef}
              className="phoneNumber"
              onChange={(e) => {
                handleChange(e, 2);
              }}
              placeholder={placeHolderText ?? "XXX-XXX-XXXX"}
              error={error}
              helperText={helperText}
              formatterProps={{
                format: "###-###-####",
                isNumericString: true,
              }}
              inputProps={{
                maxLength: 10,
                ...inputProps,
              }}
              {...restProps}
            />
          </Box>
        </Grid>
        {isExt === true ? (
          <Grid item xs={12} md={3} lg>
            <Box ml={2}>
              <TextField
                error={phoneExtHelperText}
                helperText={phoneExtHelperText}
                disabled={disabled}
                fullWidth={true}
                label={t("textBox.label.ext")}
                autoComplete="off"
                variant="outlined"
                className="extNumber"
                inputRef={extRef}
                inputProps={{
                  maxLength: extMaxLength,
                  ...inputProps,
                }}
                value={phone.ext || ""}
                onChange={(e) => {
                  handleChange(e, 3);
                }}
                {...restProps}
              />
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default compose(withTranslation("common"), withStyles(styles))(Phone);
