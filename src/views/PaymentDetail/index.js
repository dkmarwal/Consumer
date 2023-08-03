import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import SupplierSubHeader from "~/components/SupplierSubHeader";
import config from "~/config";
import { Box } from "@material-ui/core";
import SupplierPayment from "./SupplierPayment";
import { accessRights } from "~/config/accessRights";
import {withTranslation} from 'react-i18next';
import { compose } from "redux";

function SubHeaderHOC(props) {
  const { component: Component, name, title, claims, alias, ...rest } = props;
  const listMenu = [
    {
      url: `${config.baseName}/payments/supplierPayment`,
      name: "Payments",
      items: [],
      alias: "PAYMENTS_REMITTANCE_VIEW",
      isProtected: true,
    },
  ];

  const isAccessable = (claims && claims.includes(accessRights[name])) || false;
  return isAccessable === true ? (
    <Fragment>
      <SupplierSubHeader
        {...props}
        title={title}
        alias={alias}
        listMenu={listMenu}
        claims={claims}
      />
      <Component {...props} />
    </Fragment>
  ) : null;
}
class PaymentDetail extends Component {
  render() {
    const { user, t } = this.props;
    const claims = user.userRoles;
    return (
      <Box>
        <Fragment>
          <Switch>
            <Route
              path={`${config.baseName}/paymentDetail/supplierPayment`}
              render={(props) => (
                <SubHeaderHOC
                  {...props}
                  component={SupplierPayment}
                  claims={claims}
                  title={t('paymentDetail.title')}
                  name="PAYMENTS_REMITTANCE_VIEW"
                  alias="PAYMENTS_REMITTANCE_VIEW"
                />
              )}
            />
          </Switch>
        </Fragment>
      </Box>
    );
  }
}

export default connect((state) => ({ ...state.user }))(compose(withTranslation('common'))(PaymentDetail));
