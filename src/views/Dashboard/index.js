import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import Forms from "./Forms";
import { connect } from "react-redux";
import config from "~/config";
import { withTranslation } from "react-i18next";

class AuthRoute extends Component {
  isAllowed(claims, name) {
    return true;
  }

  render() {
    const {
      component: Component,
      name,
      claims,
      title,
      alias,
      t,
      ...rest
    } = this.props;
    const isAccessable = this.isAllowed(claims, name);
    return (
      <Route
        exact={true}
        {...rest}
        render={(props) =>
          isAccessable === true ? (
            <Fragment>
              <Component {...props} />
            </Fragment>
          ) : null
        }
      />
    );
  }
}

class Dashboard extends Component {
  render() {
    const { claims, t } = this.props;
    return (
      <>
        <Fragment>
          <Switch>
            <AuthRoute
              exact
              path={`${config.baseName}/:clientSlug/dashboard`}
              component={Forms}
              claims={claims}
              name={"dashboard_view"}
              title={t("dashboard.label.dashboard")}
              alias="user"
              t={t}
            />
          </Switch>
        </Fragment>
      </>
    );
  }
}

export default connect()(withTranslation("common")(Dashboard));
