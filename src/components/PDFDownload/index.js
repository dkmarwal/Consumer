import React from "react";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  iconText: (props) => ({
    fontWeight: 600,
    marginLeft: props.marginLeft || 3,
    textTransform: "capitalize",
    fontSize: props.fontSize || 14,
    color: props.color || theme.palette.text.main,
  }),
}));

export default function ExportAsBtn(props) {
  const classes = useStyles(props);

  return (
    <>
      <Button onClick={props.onClick}>
        <GetAppIcon fontSize="small" />
        <Typography variant="h6" className={classes.iconText}>
          {props.btnName}
        </Typography>
      </Button>
    </>
  );
}
