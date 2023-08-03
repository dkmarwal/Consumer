import React from "react";
import { makeStyles } from "@material-ui/core";
import { Tabs as MUITabs } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    color: theme.palette.secondary.dark,
    borderRadius: "4px",
    textTransform: "capitalize",
    backgroundColor: theme.palette.background.active,
    border: "1px solid",
    boxShadow:
      "0px 1px 3px 0px rgba(0,0,0,0.50), 0px 1px 3px 0px rgb(255 255 255), 0px 1px 3px 0px rgba(0,0,0,0.50)",
    fontWeight: "bold",
  },
  flexContainer: {
    margin: "5px",
  },
  checkedIcon: {
    position: "relative",
  },
  checkClass: {
    height: "22px",
    width: "22px",
    position: "absolute",
    left: "-11%",
    top: "7%",
  },
  indicator: {
    backgroundColor: "transparent",
    color: theme.palette.background.active,
    borderRadius: "5px",
    textTransform: "capitalize",
  },

  selected: {
    backgroundColor: theme.palette.button.primary,
    color: theme.palette.background.active,
    borderRadius: "4px",
    textTransform: "capitalize",
  },
}));
const useTabsStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "10px",
  },
}));

function Tabs(props) {
  const classes = useStyles();
  const tabClasses = useTabsStyles();
  return (
    <MUITabs
      value={props.value}
      onChange={props.onChange}
      variant={props.variant}
      TabIndicatorProps={{ className: classes.indicator }}
      classes={tabClasses}
    >
      {props.labels.map(function (item, i) {
        return (
          <Tab
            key={`tab${i}`}
            label={
              <span className={classes.checkedIcon}>
                {props.value === i && (
                  <img
                    className={classes.checkClass}
                    src={require(`~/assets/icons/checkTick.svg`)}
                    alt=""
                  />
                )}
                <span>{item}</span>
              </span>
            }
            classes={classes}
          />
        );
      })}
    </MUITabs>
  );
}

export default Tabs;
