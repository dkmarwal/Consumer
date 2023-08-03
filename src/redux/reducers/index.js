import { combineReducers } from 'redux'
import user from './user';
import enrollment from './enrollment';
import payment from './payment';
import notification from './notification';
import csc from './csc';
import DFA from './DFA';
import paymentRegistration from './paymentRegistration';
import usbankpaymentRegistration from './USBank/paymentRegistration';
import paymentAuthentication from './paymentAuthentication';
import consumerVerification from './consumerVerification';
import accounts from './accounts'
import USBankConsumerRegistration from './USBank/consumerRegistration'
import USbankpayment from './USBank/payments'

const reducer = combineReducers({
    user,
    enrollment,
    payment,
    notification,
    csc,
    DFA,
    USbankpayment,
    paymentRegistration,
    paymentAuthentication,
    consumerVerification,
    accounts,
    USBankConsumerRegistration,
    usbankpaymentRegistration
})

export default reducer