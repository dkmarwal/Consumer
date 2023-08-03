import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Box } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import FooterNav from './FooterNav';
import USBankFooterNav from './FooterNav/usBankFooter';

const styles = (theme) => ({
  root: {
    padding: '10px 3%',
    color: '#333',
    fontSize: '10px',
    background: '#fff',
    width: '100%',
  },
});

class Footer extends Component {
  render() {
    const { supportInfo, user } = this.props;
    const { isPayeeChoicePortal } = user;

    return (
      <footer>
        <Box
          display={!isPayeeChoicePortal ? 'flex' : 'block'}
          justifyContent='center'
          height={{
            xs: !isPayeeChoicePortal ? 74 : 92,
            sm: !isPayeeChoicePortal ? 74 : 92,
            md: !isPayeeChoicePortal ? 56 : 74,
            lg: !isPayeeChoicePortal ? 56 : 74,
            xl: !isPayeeChoicePortal ? 56 : 74,
          }}
          alignItems='center'
          bgcolor='#EFEFEF'
          width={1}
          px={2}
          mt='auto'
        >
          {isPayeeChoicePortal ? (
            <USBankFooterNav {...this.props} supportInfo={supportInfo} />
          ) : (
            <FooterNav {...this.props} supportInfo={supportInfo} />
          )}
        </Box>
      </footer>
    );
  }
}

export default connect((state) => ({ ...state.user }))(
  withStyles(styles)(Footer)
);
