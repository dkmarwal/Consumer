import React from 'react';
import {
  withStyles,
  Box,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const styles = (theme) => ({
  checkBoxItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `0.25rem`,
    flex: 1,
    cursor: 'pointer',
    border: '3px solid transparent',
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.5)',
    borderRadius: '4px',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  checked: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.text,
    borderRadius: `4px`,
    position: 'relative',
    border: `3px solid ${theme.palette.primary.main}`,
    boxShadow: 'none',
  },
  checkedIcon: {
    position: 'absolute',
    left: '5px',
    top: '5px',
  },
  hasIconChecked: {
    display: 'block',
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing(0, 0),
  },
  hasIcon: {
    padding: theme.spacing(0, 0),
  },
  hasPaymentIcon: {
    padding: theme.spacing(0, 0),
    display: 'block',
    width: '100%',
  },
  textWithIcon: {
    marginTop: theme.spacing(0),
    paddingLeft: '10px',
  },
  spaceImg: {
    margin: theme.spacing(0, 1),
  },
  notCheckedText: {
    color: theme.palette.text.main,
  },
});

const Checkbox = (props) => {
  const {
    classes,
    onChange,
    label,
    checked,
    icon,
    index,
    paymenthodMethod,
    ...restProps
  } = props;
  const isChecked = checked;
  // useEffect(() => {
  //   onChange && onChange(index, isChecked);
  // }, [isChecked]);
  return (
    <Box
      className={clsx(classes.checkBoxItem, {
        [classes.checked]: isChecked,
      })}
      onClick={(e) => {
        onChange && onChange(e, index, !isChecked);
      }}
    >
      {isChecked && (
        <CheckCircleIcon
          className={clsx(classes.checkedIcon, {
            [classes.hasIconChecked]: icon !== undefined,
          })}
          fontSize="small"
          color="secondary"
        />
      )}
      <Box
        className={
          paymenthodMethod
            ? clsx(classes.itemContainer, {
                [classes.hasPaymentIcon]: icon !== undefined,
              })
            : clsx(classes.itemContainer, {
                [classes.hasIcon]: icon !== undefined,
              })
        }
      >
        {icon && icon}
        <Typography
          className={clsx(
            icon && icon
              ? // ? `${classes.textWithIcon} ${classes.spaceImg} `
                `${classes.spaceImg} `
              : icon !== '',
            !isChecked && classes.notCheckedText
          )}
          variant={'body2'}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(Checkbox);
