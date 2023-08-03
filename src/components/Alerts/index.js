import React from "react";

import CloseIcon from "@material-ui/icons/Close";
import {
  IconButton,
  makeStyles,
  Snackbar, SnackbarContent
} from "@material-ui/core";

import { amber, green } from '@material-ui/core/colors';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
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
		display: 'flex',
		alignItems: 'center',
	}
}))

export default function CustomizedAlert(props){

    const {alertType, handleClose, message} = props;
    const classes = useStyles();
  return (
        <Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={props.open}
				onClose={handleClose}
				onExited={props.onExit}
				autoHideDuration={props.autoHideDuration || 4000}
				ContentProps={{
					'aria-describedby': 'client-snackbar',
				}}
			>
				<SnackbarContent
					className={clsx(classes[alertType])}
					aria-describedby="client-snackbar"
					message={
						<span id="client-snackbar">{message}</span>
					}
					action={[
						<IconButton
							key="close"
							aria-label="close"
							color="inherit"
							onClick={handleClose}
						>
							<CloseIcon />
						</IconButton>
					]}
				/>
			</Snackbar>
  );
}