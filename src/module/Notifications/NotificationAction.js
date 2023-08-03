import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MarkReadIcon from '~/assets/icons/notiMarkRead.svg';
import DeleteNotiIcon from '~/assets/icons/notiDelete.svg';
import { Box, Typography, withStyles } from '@material-ui/core';
import {withTranslation} from 'react-i18next'

const ITEM_HEIGHT = 48;

function NotificationAction({ userId, NotificationId, read, markReadNotification, markClearNotification , t}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [clearNotify, setClearNotify] = useState(true);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markReadHandler = () => {
    markReadNotification(read, userId, NotificationId, Boolean(read) ? 'undoMarkRead': 'markRead');
    handleClose();
  }

  const deleteNotificationHandler = () => {
    markClearNotification(clearNotify, userId, NotificationId, 'clear');
    setClearNotify(true);
    handleClose();
  }
  
const CustomTypography = withStyles((theme) => ({
  root: {
        marginLeft:'5px'
      }
}))(Typography);

  const options = [
    { key: 1, label: Boolean(read) ? 'Mark as Unread' : 'Mark as read', onClickListener: markReadHandler, icon: MarkReadIcon },
    { key: 2, label: 'Remove this notification', onClickListener: deleteNotificationHandler, icon:  DeleteNotiIcon }
  ];

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map(({ key, label, onClickListener, icon }) => (
          <MenuItem key={key} onClick={onClickListener}>
            <Box display='flex' flexDirection='row' justifyContent='space-around' pr={1}>
              <img src={icon} alt="label" />
              <CustomTypography variant='subtitle1'> {t(`notifications.label.${label}`)}</CustomTypography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
export default withTranslation('common')(NotificationAction)
