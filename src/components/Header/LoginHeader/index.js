import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Grow,
  Popper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Paper,
  Box,
  Divider,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import CitiLogo from "~/assets/images/citi-color-logo.svg";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import config from "~/config";
import { logout, updateLanguage } from "~/redux/actions/user";
import styles from "./styles";
import { withTranslation } from "react-i18next";
import { compose } from "redux";

class LoginHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      langMenuOpen: false,
      anchorEl: null,
      langAnchorEl: null,
      dialogActive: false,
      title: "",
      message: "",
    };
  }

    componentDidMount() {

    }

  handleToggle = (event) => {
    this.setState({
      menuOpen: !this.state.menuOpen,
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      menuOpen: false,
      anchorEl: null,
    });
  };

  handleLangToggle = (event) => {
    this.setState({
      langMenuOpen: !this.state.langMenuOpen,
      langAnchorEl: event.currentTarget,
    });
  };

  handleLangClose = () => {
    this.setState({
      langMenuOpen: false,
      langAnchorEl: null,
    });
  };

  handleLanguageChange = (event, langCode) => {
    const routeParam = (this.props.match.params && this.props.match.params.clientSlug) || "";
    const { isLoggedIn } = this.props.user;
    if (isLoggedIn) {
      this.setState(
        {
          langMenuOpen: false,
        },
        () => {
          //API call to change user selected language
          this.props
            .dispatch(updateLanguage({ locale: langCode }))
            .then((response) => {
              if (!response) {
                return false;
              }
              this.props.i18n.changeLanguage(langCode);
              //cookies.set(`@consumerLocaleLang_${routeParam}`, this.props.i18n.language, { path: `${config.baseName}/` });
              sessionStorage.setItem(`@consumerLocaleLang_${routeParam}`, this.props.i18n.language);
              this.setState({
                langMenuOpen: false,
              });
              window.location.reload();
            });
        }
      );
    } else {
      this.props.i18n.changeLanguage(langCode);
      //cookies.set(`@consumerLocaleLang_${routeParam}`, this.props.i18n.language, { path: `${config.baseName}/` });
      sessionStorage.setItem(`@consumerLocaleLang_${routeParam}`, this.props.i18n.language);
      this.setState({
        langMenuOpen: false,
      });
      window.location.reload();
    }
  };

  handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      this.setState({
        langMenuOpen: false,
      });
    }
  };

  logout() {
    this.props.dispatch(logout());
    //this.props.history.push(`${config.baseName}/logout`);
    //this.setState({ title: "Thank you!", message: "You have successfully logged out.", dialogActive: true });
  }

  render() {
    const {  langAnchorEl, langMenuOpen, } = this.state;
    const { classes, user, t } = this.props;

    return (
        <Paper square className={classes.headerContainer}>
          <Box className={classes.logoContainer}>
            <Box className={classes.citiLogo}>
              <Box display="flex" justifyContent="center">
                {" "}
                <img
                  src={CitiLogo}
                  alt="CITI Bank"
                  width="45"
                  height="45"
                />{" "}
              </Box>
            </Box>
            <Box m={1}>
                <Divider orientation="vertical" className={classes.headerDivider} />
            </Box>
            <Box className={classes.headerSmText} pt="5px">
              {t("header.label.paymentExchange")}
            </Box>
          </Box>

          <Box className={classes.rightNavContainer}>
            { config.willTranslate && <Box p={1} className={classes.rightNavIconContainer}>
              <Button
                ref={langAnchorEl}
                aria-controls={langMenuOpen ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                variant="text"
                onClick={this.handleLangToggle}
              >
                {this.props.i18n.language &&
                  this.props.i18n.language.toUpperCase()}

                <ArrowDropDownIcon />
              </Button>
              <Popper
                open={langMenuOpen}
                anchorEl={langAnchorEl}
                role={undefined}
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
                    <Paper>
                      <ClickAwayListener onClickAway={this.handleLangClose}>
                        <MenuList
                          autoFocusItem={langMenuOpen}
                          id="menu-list-grow"
                          onKeyDown={this.handleListKeyDown}
                        >
                          {user.slList &&
                            user.slList.map((lang, index) => (
                              <MenuItem
                                value={lang.code}
                                onClick={(event) =>
                                  this.handleLanguageChange(event, lang.code)
                                }
                              >
                                {`${
                                  lang.description
                                } (${lang.code.toUpperCase()})`}
                              </MenuItem>
                            ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>}
          </Box>
        </Paper>
    );
  }
}

export default connect((state) => ({ ...state.user }))(
  compose(withTranslation("common"), withStyles(styles))(LoginHeader)
);
