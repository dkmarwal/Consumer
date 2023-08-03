import React, { useState, useEffect } from "react";
import { withStyles, Box, Typography } from "@material-ui/core";
import clsx from "clsx";

const styles = (theme) => ({
  checkBoxGroupContainer: {
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: `4px`,
    padding: theme.spacing(0.5),
    display: "flex",
    height: "44px",
  },
  checkBoxItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    cursor: "pointer",
    padding: "5px 25px",
  },
  checked: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    borderRadius: `4px`,
    position: "relative",
  },
  checkedIcon: {
    maxWidth: "15px",
    position: "absolute",
    left: "10px",
  },
  caption: {
    border: "2px solid red",
  },
  disabledCheckBox: {
    backgroundColor: "#CCCCCC", //theme.palette.highlight.main,
  },
  disabledItem: {
    cursor: "default",
  },
});

const CheckboxGroup = (props) => {
  const { classes, options, selectedOption, onChange, disabled } = props;
  const [checkedIndex, setCheckedIndex] = useState(
    selectedOption ? selectedOption : 0
  );
  useEffect(() => {
    setCheckedIndex(selectedOption);
  }, [selectedOption]);

  const readOnly = disabled || false;
  return (
    <Box className={classes.checkBoxGroupContainer}>
      {options.map((option, index) => (
        <Box
          key={`checkbox-group-item-${index}`}
          className={clsx(
            classes.checkBoxItem,
            readOnly &&
              option.value === checkedIndex &&
              classes.disabledCheckBox,
            readOnly && classes.disabledItem,
            {
              [classes.checked]: option.value === checkedIndex,
            }
          )}
          onClick={(e) => {
            !readOnly && setCheckedIndex(option.value);
            !readOnly && onChange && onChange(option, index, e);
          }}
        >
          <Typography
            variant={option.value === checkedIndex ? "body2" : "body2"}
          >
            {option.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default withStyles(styles)(CheckboxGroup);
