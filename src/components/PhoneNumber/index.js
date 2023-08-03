import React, { useRef } from "react";
import { Grid, Box, withStyles, InputLabel, MenuItem } from "@material-ui/core";
import TextField from "~/components/Forms/TextField";

import { withTranslation } from "react-i18next";
import { compose } from "redux";

const styles = (theme) => ({
  grid: {
    margin: 0,
  },
  label: {
    fontSize: "14px",
    color: "#000000",
  },
  errorLabel: {
    fontSize: "14px",
    color: "#f44336 !important",
  },
  gridItem: {
    padding: theme.spacing(3),
  },
  errorText:{
    color:"#f44336",
    fontSize:"0.75rem"
  },
  phoneText:{
    "& .MuiOutlinedInput-input": {
      textAlign:"center",
      [theme.breakpoints.down("xs")]: {
        padding: "7px 0 6px 2px",
      },
    },
  },
  boxPadding:{
    [theme.breakpoints.down("xs")]: {
      margin: "8px 6px 8px 8px",
    },
  }

});

const PhoneNumber = (props) => {
  const {
    isCountryCode = true,
    prefixCcode,
    value,
    ext,
    ccode,
    error,
    helperText,
    placeholder = "",
    onChange,
    label = "",
    disabled = false,
    ccodeDisabled = true,
    required,
    inputProps,
    t,
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

  //setPhone({ccode:ccode || prefixCcode, num:value, ext:ext, value:phoneValue.join("")});

  const numRef = useRef([]);

  function handleChange(event, index, position) {
    const newValue = event.target.value.trim();
    if (isNaN(event.target.value) && (position == 2 || position == 3)) {
      return false;
    }

    switch (position) {
      case 1:
        phone.ccode = newValue || "";
        //phone.ccode.length===4 && numRef.current.focus();
        // numRef.current && numRef.current.focus();
        break;
      case 2:
        let phoneArr = phone.num.split("");
        phoneArr[index] = newValue.length === 0 ? "*" : newValue;
        phone.num = phoneArr.join("") || "";
        if (newValue.length !== 0 && index < 5) {
          numRef.current[index + 1].focus();
        }
        // numRef.current.children[index].getElementsByClassName("MuiInputBase-root")[0].classList.remove("Mui-focused,Mui-focused")
        // numRef.current.children[index+1].getElementsByClassName("MuiInputBase-root")[0].classList.add("Mui-focused,Mui-focused")
        // numRef.current.children[index+1].classList.add("Mui-focused");
        // tempPhone.length === 10 && extRef.current && extRef.current.focus();
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
      justify="center"
      alignItems="center"
      className={classes.grid}
    >
      {label && (
        <Grid item xs={12}>
          <Box mb={2} mt={1}>
            <InputLabel
              className={helperText ? classes.errorLabel : classes.label}
              htmlFor={`component${error ? "-error" : ""}${
                disabled ? "-disabled" : ""
              }`}
            >
              {label}
              {/* {required ? (
              <span style={{ color: "red", fontSize: "10px" }}>*</span>
            ) : (
              ""
            )} */}
            </InputLabel>
          </Box>
        </Grid>
      )}
      <Grid container item xs={12} md={12}>
        {isCountryCode === true && (
          <Grid item xs={1} md={1} lg={1}>
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
                // label={t("textBox.label.country")}
                className="countyCode"
                inputProps={{
                  maxLength: 5,
                  autoFocus: true,
                  ...inputProps,
                }}
                onChange={(e) => {
                  handleChange(e, null, 1);
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
          </Grid>
        )}
        <Grid item xs={12} md={12} lg={12} style={{ display: "flex" }}>
          {phone?.num?.split("").map((x, i) => {
            return (
              <>
                {(i === 3 || i === 6) && (
                  <Box mx={1} my={2} className={classes.boxPadding}>
                    -
                  </Box>
                )}
                <Box ml={(i === 3 || i === 6 || i === 0) ? 0 : 2}>
                  <Grid
                    item
                    xs
                    className="textBoxGrid"
                    style={{ display: "flex" }}
                  >
                    <TextField
                      error={error}
                      id={`textfield${i}`}
                      inputRef={(el) => (numRef.current[i] = el)}
                      disabled={i > 5 ? true : false}
                      fullWidth={true}
                      placeholder={x === "*" ? "*" : ""}
                      value={x !== "*" ? x : ""}
                      onChange={(e) => {
                        handleChange(e, i, 2);
                      }}
                      onClick={(e)=>
                        {
                          setTimeout(
                            () =>
                            {
                              const length = numRef.current[i].value.length;
                              numRef.current[i].setSelectionRange(length,length);
                            },
                            200
                          );
                        }
                      }
                      className={classes.phoneText}
                      inputProps={{
                        maxLength: 1,
                        ...inputProps,
                      }}
                      color="secondary"
                      variant="outlined"
                      autoComplete="off"
                      {...restProps}
                    />
                  </Grid>
                </Box>
              </>
            );
          })}
        </Grid>
        <Grid item xs={12} md={12} lg={12} style={{ display: "flex" }}>
          <Box my={1} mx={2} className={classes.errorText}>
            {helperText}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default compose(withTranslation("common"), withStyles(styles))(PhoneNumber);
