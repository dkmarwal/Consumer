import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import NotificationsIcon from "@material-ui/icons/Notifications";
import {
  Typography,
  Box,
  Grid,
  Divider,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
} from "@material-ui/core";
import {
  NotificationContainer,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import {
  getNotifications,
  processNotificationsAction,
} from "~/redux/helpers/notificationSetttings";
import { NoitificationDialog } from "~/components/Dialogs";
import NotificationAction from "./NotificationAction";
import Moment from "react-moment";
import 'moment/locale/fr';
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
import NotiDollarIcon from "~/assets/icons/notiDollar.svg";
import NotiDollarUnreadIcon from "~/assets/icons/notiDollarUnread.svg";
import NotiProfileIcon from "~/assets/icons/notiProfile.svg";
import NotiProfileUnreadIcon from "~/assets/icons/notiProfileUnread.svg";
import NotiSettingIcon from "~/assets/icons/notiProfile.svg";
import NotiSettingUnreadIcon from "~/assets/icons/notiProfile.svg";
import config from "~/config";
import BannerNotification from "../../components/BannerNotification";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { compose } from "redux";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    marginRight: theme.spacing(2),
    maxHeight: "80vh",
    overflowX: "hidden",
    overflowY: "auto",
    minWidth: "450px",
    width: "40%",
    padding: 10,
  },
  notifySidePanel: {
    padding: "0px",
  },
}));
const usePropoverStyles = makeStyles((theme) => ({
  menuList: {
    display: "flex",
    flexDirection: "row",
  },
  paper: {
    height: "80vh",
    overflow: "hidden",
  },
}));

const useMenuListStyles = makeStyles((theme) => ({
  menuList: {
    width: "100%",
    flexDirection: "column",
  },
  menuItem: {
    width: "100%",
    flexDirection: "row",
  },
}));

const useCustomStyles = makeStyles((theme) => ({
  notificationContainer: {
    position: "relative",
  },
  notificationAlert: {
    textAlign: "center",
    width: "15px",
    borderRadius: "50%",
    height: "15px",
    backgroundColor: "red",
    position: "absolute",
    left: "20px",
    top: "0px",
  },
  menuList: {
    width: "100%",
  },
  content: {
    fontWeight: "normal",
    fontSize: "0.9375rem",
    color: "#7F7F7F",
    fontFamily: "Interstate",
  },
  item: {
    padding: "0px",
  },
  headTitle: {
    fontWeight: "normal",
    fontSize: "1.25rem",
    color: "#121212",
    fontFamily: "Interstate",
    marginLeft: "15px",
  },

  underlIned: {
    fontWeight: "normal",
    fontSize: "0.8125rem",
    textTransform: "none",
    textDecoration: "underline",
    color: "#0B1941",
    fontFamily: "Interstate",
    cursor: "pointer",
  },
  title: {
    fontWeight: "normal",
    fontSize: "0.9375rem",
    color: "rgba(0,0,0,0.87)",
    fontFamily: "Interstate",
  },
  text: {
    fontWeight: "normal",
    fontSize: "0.9375rem",
    color: "#7F7F7F",
    fontFamily: "Interstate",
  },
  timestamp: {
    fontWeight: "normal",
    fontSize: "0.8125rem",
    color: "#0B1941",
    fontFamily: "Interstate",
  },
  timeContent: {
    fontWeight: "normal",
    fontSize: "0.8125rem",
    color: "#7F7F7F",
    fontFamily: "Interstate",
  },
  Icon: {
    width: "15px",
    height: "15px",
  },

  notificationList: {
    height: "100%",
    alignItems: "stretch",
  },
  divider: {
    height: "1px",
    opacity: "0.12",
    backgroundColor: "#000000",
  },
  notiCatgoryIcon: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  circleUnread: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  noNotifications: {
    padding: "10px",
    display: "flex",
    alignItems: "center",
  },
}));

function Notifications({ user, history, t, ...props }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState();
  const anchorRef = useRef(null);
  const [clearNotify, setClearNotify] = useState(true);
  const [readNotify, setReadNotify] = useState(true);
  const [showAllNotification, setShowAllNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    openNotiCounter: 0,
    title: "",
    description: "",
  });
  const [openSystemNotification, setOpenSystemNotification] = useState(false);

  useEffect(() => {
    console.log("++++++++++++++ notifications userData ++++++++++++ ", user);
    if (user.info) {
      console.log("++++++++++++++ user Data ++++++++++++ ", user.info);
      setUserId(user.info.userId);
    }
    fetchNotifications();
  }, [clearNotify, readNotify]);

  useEffect(() => {
    if (user.info) {
      console.log("++++++++++++++ user Data ++++++++++++ ", user.info);
      setUserId(user.info.userId);
    }
    console.log(
      " ++++++++++++ config.apiBase.notificationSocket ++++++++ ",
      config.apiBase.notificationSocket
    );
    const socket = socketIOClient(config.notificationSocket, {
      path: "/socket",
    });
    console.log(" ++++++++++socket +++++++++ ", socket);

    socket.emit("subscribe_notification", { userId: user.info.userId });
    socket.on("new_notification", ({ title, description, counter }) => {
      const desc = description
        ? description.substr(0, description.indexOf(".") + 1)
        : "";
      console.log(" +++++++ data Socket counter ++++++++", counter);
      setNotificationData({
        title,
        //description,
        description: desc,
        openNotiCounter: counter,
      });
      setOpenSystemNotification(true);
      fetchNotifications();
    });
    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
  }, []);

  // classes define
  const classes = useStyles();
  const customClasses = useCustomStyles();
  const propoverClass = usePropoverStyles();
  const menuListClasses = useMenuListStyles();

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(user.info.userId);
      // const response = await getNotifications(616);
      console.log(" +++++++ fetchNotifications +++++++", response);
      if (!response.error && response.data) {
        const Notifications = response.data && response.data.reduce((obj, values) => {
          obj[values.notificationId] = values;
          return obj;
        }, {});
        setNotifications(Notifications);
        console.log(
          "+++++++++++ Notifications Obj ++++++++++++++++",
          Notifications
        );
      } else {
        //NotificationManager.error(response.message || '', 'Error!!', 2000);
      }
    } catch (error) {
      //NotificationManager.error(error || 'Server Exception', 'Error!!', 2000);
    }
  };

  const ClearAllNotificationHandler = async () => {
    console.log(" ++++++ ClearAllNotificationHandler +++ ");
    if (clearNotify) {
      const response = await notificationAction(userId, 1, "clearAll");
      if (response) {
        setClearNotify(false);
      }
    } else {
      const response = await notificationAction(userId, 1, "undoClearAll");
      setClearNotify(true);
    }
  };

  const readAllNotificationHandler = () => {
    console.log(" ++++++ readAllNotificationHandler +++ ");
    if (readNotify) {
      notificationAction(userId, 1, "markReadAll");
    } else {
      notificationAction(userId, 1, "undoMarkReadAll");
    }
  };

  const markReadNotification = async (
    readNotify,
    userId,
    NotificationId,
    action
  ) => {
    console.log(" +++++++++++++++  markReadNotification  ++++++++++");
    console.log(
      " +++++++++++++++  readNotify, userId, NotificationId, action  ++++++++++",
      readNotify,
      userId,
      NotificationId,
      action
    );
    const response = notificationAction(userId, NotificationId, action);
    const status = Boolean(readNotify) ? 0 : 1;
    console.log("++++++++++++  update status will be ++++++++++", status);
    if (response) {
      setNotifications({
        ...notifications,
        [NotificationId]: {
          ...notifications[NotificationId],
          status: status,
        },
      });
    }
  };

  const markClearNotification = async (
    clearNotify,
    userId,
    NotificationId,
    action
  ) => {
    console.log(" +++++++++++++++  markClearNotification  ++++++++++");
    console.log(
      " +++++++++++++++  clearNotify, userId, NotificationId, action  ++++++++++",
      clearNotify,
      userId,
      NotificationId,
      action
    );
    const response = notificationAction(userId, NotificationId, action);
    if (response) {
      const { [NotificationId]: omit, ...res } = notifications;
      console.log(
        " ++++++++++++ omit NotificationId+++++++ ",
        NotificationId,
        res
      );
      setNotifications(res);
    }
  };

  const notificationAction = async (userId, NotificationId, action) => {
    const response = await processNotificationsAction(
      userId,
      NotificationId,
      action
    ); // user id
    console.log(" +++++++ fetchNotifications +++++++", response);
    if (response) {
      if (action === "clearAll") {
        setClearNotify(false);
        setNotifications({});
      } else if (action === "undoClearAll") {
        setClearNotify(true);
      } else if (action === "markReadAll") {
        setReadNotify(false);
      } else if (action === "undoMarkReadAll") {
        setReadNotify(true);
      }
      return true;
    } else {
      //NotificationManager.error(response.message || '', 'Error!!', 2000);
      return false;
    }
  };

  const handleToggle = (event) => {
    setOpen((prevOpen) => !prevOpen);
    setNotificationData({
      ...notificationData,
      openNotiCounter: 0,
    });
  };

  const handleClose = (event) => {
    //if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //  return;
    //}
    event.preventDefault();
    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    //if (prevOpen.current === true && open === false) {
    //  anchorRef.current.focus();
    //}

    prevOpen.current = open;
  }, [open]);

  const earlierHeader = (createdAt) => {
    if (Date.parse(new Date()) - Date.parse(createdAt) > 86400000) {
      earlierString();
    }
    return null;
  };

  var earlierString = (function () {
    var executed = false;
    return function () {
      if (!executed) {
        executed = true;
        return (
          <MenuItem classsName={classes.item}>
            <Typography variant="h3" className={customClasses.headTitle}>
              {t("notifications.label.earlier")}
            </Typography>
          </MenuItem>
        );
      }
    };
  })();

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSystemNotification(false);
  };

  const onClickNotification = (
    event,
    readStatus,
    notificationId,
    notificationTypeId,
    notificationGroupId
  ) => {
    console.log("++ event on onClickNotification ++++++++");
    //  const action = Boolean(readStatus) ?  'markUnread': 'markRead';
    console.log("+++++++++  router address+++++++++++ ", history);
    if (!Boolean(readStatus)) {
      markReadNotification(readStatus, userId, notificationId, "markRead");
      console.log("Notificatoin click", notificationId, notificationTypeId);
    }
    console.log("++calling gotoUrl ++++++++");
    gotoUrl(notificationTypeId, event);
  };

  const gotoUrl = (notificationTypeId, event) => {
    console.log(
      " ++++++++++++++ gotoUrl +++++++++++++++++ ",
      notificationTypeId
    );
    let url;
    switch (notificationTypeId) {
      case 8192:
      case 16384:
      case 262144:
        url = "settings";
        break;
      case 33554432:
      case 131072:
      case 32768:
      case 134217728:
        url = "settings/payments";
        break;

      case 1073741824:
      case 2147483648:
      case 268435456:
      case 536870912:
      case 67108864:
        url = "clients";
        break;
      case 65536:
        url = "paymentDetail/supplierPayment";
        break;
      default:
        return;
    }
    console.log(
      "+++++++++  router notification to originiator +++++++++++ ",
      history
    );
    handleToggle(event);
    setShowAllNotification(false);
    history.push(`${config.baseName}/${url}`);
  };

  const { openNotiCounter, title, description } = notificationData;
  const langFrCase = props.i18n.language === "fr";
  const toUpperCaseFilter = (d) => {
    return d.replace(/\b[a-z]/, match => match.toUpperCase())
  };
  return (
    <div className={classes.root}>
      <Box className={customClasses.notificationContainer}>
        <NotificationsNoneOutlinedIcon
          ref={anchorRef}
          variant="contained"
          color="primary"
          style={{ cursor: "pointer" }}
          onClick={(event) => handleToggle(event)}
          onDoubleClick={(event) => handleToggle(event)}
        />
        {Boolean(openNotiCounter) ? (
          <Box className={customClasses.notificationAlert}>
            {openNotiCounter}
          </Box>
        ) : null}

        <Popper
          classes={propoverClass}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper
                className={classes.paper}
                style={langFrCase && { width: 500 }}
              >
                <ClickAwayListener onClickAway={(event) => handleClose(event)}>
                  {Object.keys(notifications).length > 0 ? (
                    <Grid container direction="column" spacing={1}>
                      <Grid
                        container
                        item
                        justify="space-between"
                        alignItems="flex-end"
                      >
                        <Grid item xs={3}>
                          <Typography
                            variant="h2"
                            className={customClasses.headTitle}
                          >
                            {" "}
                            {t("notifications.label.new")}
                          </Typography>
                        </Grid>
                        <Grid item xs={5}>
                          {" "}
                          <Typography
                            variant="h5"
                            className={customClasses.underlIned}
                            onClick={ClearAllNotificationHandler}
                            gutterBottom
                          >
                            {clearNotify
                              ? t("notifications.label.clearAll")
                              : t("notifications.label.undoClear")}
                          </Typography>
                        </Grid>

                        <Grid item xs={4}>
                          {" "}
                          <Typography
                            variant="h5"
                            className={customClasses.underlIned}
                            onClick={readAllNotificationHandler}
                            gutterBottom
                          >
                            {readNotify
                              ? t("notifications.label.markAllRead")
                              : t("notifications.label.undoReadAll")}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item container className={classes.MenuContainer}>
                        <Box className={menuListClasses.menuList}>
                          {Object.keys(notifications)
                            .reverse()
                            .filter((value, i) => i < 5)
                            .map((key, i) => {
                              const {
                                title,
                                description,
                                createdAt,
                                notificationId,
                                status,
                                NotificationTypeMapping,
                              } = notifications[key] || {};
                              const {
                                notificationGroupId = 1,
                                notificationTypeId = 1,
                              } = NotificationTypeMapping || {};
                              console.log(
                                "++++++++++++++ notificationGroupId Id +++++++++++",
                                notificationGroupId
                              );
                              return (
                                <>
                                  {earlierHeader(createdAt)}
                                  <Box
                                    classsName={menuListClasses.menuItem}
                                    key={i}
                                    p={1}
                                  >
                                    <Grid
                                      container
                                      direction="row"
                                      className={customClasses.notificationList}
                                      alignItems="center"
                                    >
                                      <Grid
                                        item
                                        xs={3}
                                        className={
                                          customClasses.notiCatgoryIcon
                                        }
                                        alignItems="center"
                                        justify="center"
                                        onClick={(event) =>
                                          onClickNotification(
                                            event,
                                            status,
                                            notificationId,
                                            notificationTypeId,
                                            notificationGroupId
                                          )
                                        }
                                      >
                                        {Boolean(status) ? (
                                          <PaymentReadImage
                                            groupId={notificationGroupId}
                                          />
                                        ) : (
                                          <PaymentUnreadImage
                                            groupId={notificationGroupId}
                                          />
                                        )}
                                      </Grid>
                                      <Grid
                                        item
                                        xs={7}
                                        direction="column"
                                        style={{ cursor: "pointer" }}
                                        alignItems="left"
                                        onClick={(event) =>
                                          onClickNotification(
                                            event,
                                            status,
                                            notificationId,
                                            notificationTypeId,
                                            notificationGroupId
                                          )
                                        }
                                      >
                                        <Typography
                                          noWrap
                                          variant="h3"
                                          title={title || ""}
                                          className={
                                            !Boolean(status)
                                              ? customClasses.title
                                              : customClasses.content
                                          }
                                        >
                                          {title}
                                        </Typography>
                                        <Typography
                                          variant="h3"
                                          title={description || ""}
                                          className={
                                            !Boolean(status)
                                              ? customClasses.text
                                              : customClasses.content
                                          }
                                        >
                                          {description}
                                        </Typography>
                                        <Typography
                                          variant="h5"
                                          className={
                                            Boolean(!status)
                                              ? customClasses.timestamp
                                              : customClasses.timeContent
                                          }
                                        >
                                          {" "}
                                          <Moment locale={props.i18n.language} filter={toUpperCaseFilter} fromNow>{createdAt}</Moment>
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={2} alignItems="center">
                                        <NotificationAction
                                          userId={userId}
                                          read={status}
                                          markReadNotification={
                                            markReadNotification
                                          }
                                          markClearNotification={
                                            markClearNotification
                                          }
                                          NotificationId={notificationId}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Box>

                                  <Divider className={customClasses.divider} />
                                </>
                              );
                            })}
                        </Box>
                      </Grid>
                      {Object.keys(notifications).length > 4 && (
                        <Grid item container justify="center">
                          <Typography
                            variant="overline"
                            className={customClasses.underlIned}
                            onClick={() => {
                              setShowAllNotification(true);
                              setOpen((prevOpen) => !prevOpen);
                            }}
                          >
                            {t("notifications.label.showAllNotification")}{" "}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      width="100%"
                      height="100px"
                    >
                      <Typography
                        variant="h3"
                        className={customClasses.noNotifications}
                      >
                        {t("notifications.label.noNotification")}
                      </Typography>
                    </Box>
                  )}

                  {/* </MenuList> */}
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        {showAllNotification && (
          <NoitificationDialog
            showButton={false}
            alignSide={true}
            onConfirm={() => {
              setShowAllNotification(false);
            }}
            title={t("notifications.label.notifications")}
            className={classes.notifySidePanel}
          >
            <Grid container direction="column" spacing={1}>
              <Grid
                container
                item
                justify="space-between"
                alignItems="flex-end"
              >
                <Grid item xs={3}>
                  {" "}
                  <Typography variant="h2" className={customClasses.headTitle}>
                    {" "}
                    {t("notifications.label.new")}
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  {" "}
                  <Typography
                    variant="h5"
                    className={customClasses.underlIned}
                    onClick={ClearAllNotificationHandler}
                  >
                    {clearNotify
                      ? t("notifications.label.clearAll")
                      : t("notifications.label.undoClear")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  {" "}
                  <Typography
                    variant="h5"
                    className={customClasses.underlIned}
                    onClick={readAllNotificationHandler}
                  >
                    {readNotify
                      ? t("notifications.label.markAllRead")
                      : t("notifications.label.undoReadAll")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container className={classes.MenuContainer}>
                <Box className={menuListClasses.menuList}>
                  {Object.keys(notifications).length > 0 &&
                    Object.keys(notifications)
                      .reverse()
                      .map((key, i) => {
                        const {
                          title,
                          description,
                          createdAt,
                          notificationId,
                          status,
                          NotificationTypeMapping,
                        } = notifications[key] || {};
                        const {
                          notificationGroupId = 1,
                          notificationTypeId = 1,
                        } = NotificationTypeMapping || {};
                        return (
                          <>
                            {earlierHeader(createdAt)}
                            <Box
                              classsName={menuListClasses.menuItem}
                              key={i}
                              p={1}
                            >
                              <Grid
                                container
                                direction="row"
                                className={customClasses.notificationList}
                                alignItems="center"
                              >
                                <Grid
                                  item
                                  xs={3}
                                  className={customClasses.notiCatgoryIcon}
                                  alignItems="center"
                                  justify="center"
                                  onClick={(event) =>
                                    onClickNotification(
                                      event,
                                      status,
                                      notificationId,
                                      notificationTypeId,
                                      notificationGroupId
                                    )
                                  }
                                >
                                  {Boolean(status) ? (
                                    <PaymentReadImage
                                      groupId={notificationGroupId}
                                    />
                                  ) : (
                                    <PaymentUnreadImage
                                      groupId={notificationGroupId}
                                    />
                                  )}
                                </Grid>
                                <Grid
                                  item
                                  xs={7}
                                  direction="column"
                                  style={{ cursor: "pointer" }}
                                  alignItems="left"
                                  onClick={(event) =>
                                    onClickNotification(
                                      event,
                                      status,
                                      notificationId,
                                      notificationTypeId,
                                      notificationGroupId
                                    )
                                  }
                                >
                                  <Typography
                                    noWrap
                                    variant="h3"
                                    className={
                                      !Boolean(status)
                                        ? customClasses.title
                                        : customClasses.content
                                    }
                                  >
                                    {title}
                                  </Typography>
                                  <Typography
                                    variant="h3"
                                    className={
                                      !Boolean(status)
                                        ? customClasses.text
                                        : customClasses.content
                                    }
                                  >
                                    {description}
                                  </Typography>
                                  <Typography
                                    variant="h5"
                                    className={
                                      Boolean(!status)
                                        ? customClasses.timestamp
                                        : customClasses.timeContent
                                    }
                                  >
                                    {" "}
                                    <Moment locale={props.i18n.language} filter={toUpperCaseFilter} fromNow>{createdAt}</Moment>
                                  </Typography>
                                </Grid>
                                <Grid item xs={2} alignItems="center">
                                  <NotificationAction
                                    userId={userId}
                                    read={status}
                                    markReadNotification={markReadNotification}
                                    markClearNotification={
                                      markClearNotification
                                    }
                                    NotificationId={notificationId}
                                  />
                                </Grid>
                              </Grid>
                            </Box>

                            <Divider className={customClasses.divider} />
                          </>
                        );
                      })}
                </Box>
              </Grid>
            </Grid>
          </NoitificationDialog>
        )}
        <NotificationContainer />
        {openSystemNotification && (
          <BannerNotification
            title={title}
            description={description}
            handleClose={handleCloseNotification}
          />
        )}
      </Box>
    </div>
  );
}

export default connect((state) => ({ ...state.user }))(
  compose(withTranslation("common"), withRouter)(Notifications)
);

function PaymentReadImage({ groupId }) {
  const customClasses = useCustomStyles();
  useEffect(() => {
    console.log(
      "++++++++++++++ PaymentReadImage group Id +++++++++++",
      groupId
    );
  });

  return (
    <Box className={customClasses.circle}>
      {groupId == 8 ? (
        <img src={NotiSettingIcon} alt="Setting" />
      ) : groupId == 16 ? (
        <img src={NotiDollarIcon} alt="$" />
      ) : groupId == 32 ? (
        <img src={NotiProfileIcon} alt="Supplier" />
      ) : (
        <NotificationsNoneOutlinedIcon alt="Notifications" />
      )}
      {/* <img src={ProfileNotiIcon} alt="$" /> */}
      {/* <PaymentNotiIcon /> */}
    </Box>
  );
}

function PaymentUnreadImage({ groupId }) {
  useEffect(() => {
    console.log(
      "++++++++++++++PaymentUnreadImage  group Id +++++++++++",
      groupId
    );
  });
  const customClasses = useCustomStyles();

  return (
    <Box className={customClasses.circleUnread}>
      {groupId == 8 ? (
        <img src={NotiSettingUnreadIcon} alt="Setting" />
      ) : groupId == 16 ? (
        <img src={NotiDollarUnreadIcon} alt="$" />
      ) : groupId == 32 ? (
        <img src={NotiProfileUnreadIcon} alt="Supplier" />
      ) : (
        <NotificationsIcon alt="Notifications" />
      )}
    </Box>
  );
}
