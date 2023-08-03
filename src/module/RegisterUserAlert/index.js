import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  Box,  
  Typography,  
  withStyles,  
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import styles from './style';
import ProfileExists from '~/assets/images/Profile_exists.png';
import DummyLogo from '~/assets/images/dummy_logo.png';
import config from "~/config";

class RegisterUserAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,      
    };
  }  

  jumpInLoginPage = () => {
    const routeParam = (this.props.match.params && this.props.match.params.clientSlug) || "";    
    this.props.history.push(`${config.baseName}/${routeParam}`)
  };

  render() {
    const { classes, t,} = this.props; 
    const {brandInfo} = this.props.user;   

    return (
      <Box square className={classes.root}>  
      <Box className={classes.mainBoxCol}>      
        <Box className={classes.mainBox}>
            <Box className={classes.logoBox} >
              <img 
                src={brandInfo?.logo ?? DummyLogo}                 
                alt= ""                 
              />
             </Box>            

            <Typography 
              variant="h1"
              className={classes.topHeading} 
            >
              {t('payeeVerification.existingUser.ProfileExists')}
            </Typography>

            <img 
              src={ProfileExists} 
              alt="" 
              className={classes.midProfileImg} 
            />

            <Typography 
              variant="body1"
              className={classes.exchangeTxt} 
            >
              {t('payeeVerification.existingUser.PaymentExchangeTxt')}
            </Typography>

            <Typography 
              variant="body2"
              className={classes.clickHereTxt} 
            >
              <span onClick={()=>this.jumpInLoginPage()}>
                {t('payeeVerification.existingUser.clickHere')}
              </span> {" "}
              {t('payeeVerification.existingUser.loginTxt')}
            </Typography>
            </Box>
        </Box>
      </Box>
    );
  }
}

export default connect((state) => ({  
  ...state.user,
}))(compose(withTranslation("common"), withStyles(styles))(RegisterUserAlert));
