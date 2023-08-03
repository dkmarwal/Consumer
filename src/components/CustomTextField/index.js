import React from "react";
import {
  Grid,
  TextField,
  makeStyles,
  InputLabel,
} from "@material-ui/core";

const useStyle = makeStyles({
  grid: {
    marginBottom: "5px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: 1.6,
    color: "#000000",
  },
  textField: {
    height: "0.8rem",
  },
});

const CustomTextField = (props) => {
  const {
    error = false,
    helperText,
    label = "",
    disabled = false,
    name = "demo",
    handleChange,
    dir = "horizontal",
    required,
    ...restProps
  } = props;
  const classes = useStyle();
  return (
    <Grid
      container
      item
      direction={dir}
      justify="center"
      alignItems="center"
      className={classes.grid}
    >
      {label && (
        <Grid item xs={6} sm={4}>
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
      <Grid item xs={6} sm={8}>
        <TextField
          error={error}
          helperText={helperText}
          fullWidth={true}
          autoComplete="off"
          variant="outlined"
          name={name}
          size="small"
          inputProps={{ height: "0.8rem" }}
          {...restProps}
        />
      </Grid>
    </Grid>
  );
};

export default CustomTextField;
