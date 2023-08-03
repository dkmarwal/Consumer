import React from "react";
import { Button as MUIButton, withStyles } from "@material-ui/core";
import clsx from "clsx";

const styles = (theme) => ({
  primarycontained: {
    ...theme.typography.h6,
    backgroundColor: `${theme.palette.button.primary} !important`,
    color: theme.palette.secondary.contrastText,
    boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.19)",
    padding: "0 2.75rem",
    height: "2.5rem",
  },
  primaryoutlined: {
    ...theme.typography.h6,
    border: `1px solid ${theme.palette.button.primary} !important`,
    color: theme.palette.text.primary,
    boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.19)",
    padding: "0.7rem 2.75rem",
    height: "2.5rem",
  },
  primarytext: {
    border: `none`,
    color: theme.palette.button.primary,
  },
});

const Button = (props) => {
  const { classes, className, ...restProps } = props;
  return (
    <MUIButton
      variant={props.variant || "contained"}
      className={clsx(classes[`${props.color}${props.variant}`], className)}
      onClick={props.onClick}
      {...restProps}
    >
      {props.children}
    </MUIButton>
  );
};

export default withStyles(styles)(Button);
