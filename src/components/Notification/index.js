import React, { Component } from "react";
import { Snackbar, SnackbarContent, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { amber, green } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
}));

const NotificationWrapper = (props) => {
	const { message } = props
	const classes = useStyles()
	return (
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={props.open}
				onClose={props.onClose}
				onExited={props.onExit}
				autoHideDuration={props.autoHideDuration || 6000}
				ContentProps={{
					'aria-describedby': 'client-snackbar',
				}}
			>
				<SnackbarContent
					className={clsx(classes[props.variant])}
					aria-describedby="client-snackbar"
					message={
						<span id="client-snackbar">{message}</span>
					}
					action={[
						<IconButton
							key="close"
							aria-label="close"
							color="inherit"
							onClick={props.onClose}
						>
							<CloseIcon />
						</IconButton>
					]}
				/>
			</Snackbar>
	)
}

export default class Notification extends Component {
  state = {
    open: true,
  };
  handleClose = () => {
    this.setState({
      open: false,
    });
    this.props.handleClose && this.props.handleClose();
  };
  render() {
    const { open } = this.state;
    return (
      <NotificationWrapper
        open={open}
        onClose={this.handleClose}
        {...this.props}
      />
    );
  }
}
