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
import ProfileExists from '~/assets/images/guestUserImg.png';
import DummyLogo from '~/assets/images/dummy_logo.png';

class GuestUserAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,      
    };
  }    

  render() {
    const { classes, t} = this.props; 
    const {brandInfo} = this.props.user;      

    return (
      <Box className={classes.root}> 
      <Box className={classes.mainBoxCol}>      
        <Box className={classes.mainBox}>
            <Box className={classes.logoBox} >
              <img 
                src={brandInfo?.logo ?? DummyLogo}                 
                alt= ""                 
              />
             </Box> 

             <Typography 
              variant="body1"
              className={classes.detailTxt} 
            >
              {t('payeeVerification.existingUser.accountDetailsTxt')}
            </Typography>
            

            <img 
              src={ProfileExists} 
              alt="" 
              className={classes.midProfileImg} 
            />            

            <Typography 
              variant="body2"
              className={classes.bottomTxt} 
            >
              {Boolean(brandInfo?.clientName) 
                ? `${t('payeeVerification.existingUser.thanksTxt')} ${brandInfo.clientName} ${t('payeeVerification.existingUser.PaymentExchange')}`
                : null
              }
              
            </Typography>
            </Box>
        </Box>
      </Box>
    );
  }
}

export default connect((state) => ({  
  ...state.user,
}))(compose(withTranslation("common"), withStyles(styles))(GuestUserAlert));
