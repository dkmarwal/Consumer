import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import { connect } from "react-redux";
import WhiteCard from "~/components/WhiteCard";
import EditProfile from "~/module/EditProfile";
import { Grid } from "@material-ui/core";

class UserProfile extends Component {
  render() {
    return (
      <>
        <Grid container justifyContent="center">
          <Grid item xs={11} sm={9} md={8} lg={7}>
            <WhiteCard margin="2rem 0" mobMar="2rem 0">
              <EditProfile {...this.props} />
            </WhiteCard>
          </Grid>
        </Grid>
      </>
    );
  }
}
export default connect((state) => ({
  ...state.user,
  ...state.clientConfig,
}))(compose(withTranslation("common"))(UserProfile));
