import React from "react";
import { Tooltip, withStyles, Hidden } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const CustomizedTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: "12px",
    width: "240px",
  },
  arrow: {
    "&:before": {
      border: "1px solid #E0E0E0",
      boxShadow: theme.shadows[1],
    },
    color: theme.palette.common.white,
  },
}))(Tooltip);

export const LightTooltip = (props) => {
  const { title, placement = "top-end", children } = props;
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <Hidden only={["xs", "sm", "md"]}>
        <CustomizedTooltip
          disableFocusListener
          disableTouchListener
          title={title}
          arrow
          placement={placement}
        >
          {children ?? (
            <InfoOutlinedIcon
              fontSize="small"
            />
          )}
        </CustomizedTooltip>
      </Hidden>
      <Hidden only={["lg", "xl"]}>
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <div>
            <CustomizedTooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={title}
              arrow
              placement={placement}
            >
              {children ?? (
                <InfoOutlinedIcon
                  fontSize="small"
                  onClick={handleTooltipOpen}
                />
              )}
            </CustomizedTooltip>
          </div>
        </ClickAwayListener>
      </Hidden>
    </>
  );
};
