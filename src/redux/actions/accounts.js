import axios from "axios";
import config from "~/config";
import i18n from "~/i18n";
import { getAccessToken } from "~/redux/helpers/user";
import moment from "moment";

const path = window?.location?.pathname ?? "";
const clientURL = path.split("/")[1];
//const language = cookies.get(`@consumerLocaleLang_${clientURL}`) || 'en';
const language =
  sessionStorage.getItem(`@consumerLocaleLang_${clientURL}`) || "en";
const translatedData =
  i18n.logger.options.resources[language].common.app.reduxData;

axios.interceptors.request.use(
  (request) => {
    request.headers["accept-language"] = i18n.language;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      const path = window?.location?.pathname ?? "";
      const clientURL = path.split("/")[1];
      /*cookies.remove(`@consumerRefreshToken_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerAccessToken_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerUserId_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@isOtpRequired_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@consumerOfferFlag_${clientURL}`, { path: `${config.baseName}/` });
      cookies.remove(`@showLoginDFA_${clientURL}`, { path: `${config.baseName}/` });*/
      sessionStorage.removeItem(`@consumerRefreshToken_${clientURL}`);
      sessionStorage.removeItem(`@consumerAccessToken_${clientURL}`);
      sessionStorage.removeItem(`@consumerUserId_${clientURL}`);
      sessionStorage.removeItem(`@isOtpRequired_${clientURL}`);
      sessionStorage.removeItem(`@consumerOfferFlag_${clientURL}`);
      sessionStorage.removeItem(`@showLoginDFA_${clientURL}`);
      window.location.href = `${config.baseName}/${clientURL}`;
    }
    return error.response;
  }
);

export const fetchConsumerPaymentDetails = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/consumer/payment-details`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_CONSUMER_PAYMENT_DETAILS_SUCCESS",
        payload: responseBody.data || null,
      });
      return true;
    }
    dispatch({
      type: "FETCH_CONSUMER_PAYMENT_DETAILS_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CONSUMER_PAYMENT_DETAILS_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const fetchStatusId = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.paymentService}/GetPaymentStatusForPortal?BusinessType=2&portalFlag=2`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_STATUS_ID_SUCCESS",
        payload: responseBody.data || null,
      });
      return true;
    }
    dispatch({
      type: "FETCH_STATUS_ID_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_STATUS_ID_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

/** Check Info API */
export const updateConsumerCheckInfo = (checkDetail) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/updateConsumerCheckInfo`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        addressLine1: (checkDetail && checkDetail.addressLine1) || null,
        addressLine2: (checkDetail && checkDetail.addressLine2) || null,
        country: (checkDetail && checkDetail.country) || null,
        state: (checkDetail && checkDetail.state) || null,
        city: (checkDetail && checkDetail.city) || null,
        postalCode: (checkDetail && checkDetail.postalCode) || null,
        remittanceDetails: checkDetail.remittanceDetails,
        preferenceType: checkDetail.preferenceType,
        checkId: checkDetail.checkDetailId,
        otp: (checkDetail && checkDetail.otp) || null,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "UPDATE_CONSUMER_CHECK_INFO_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "UPDATE_CONSUMER_CHECK_INFO_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_CONSUMER_CHECK_INFO_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};
export const updateDepositInfo = (deposittoDebitCardDetail,clientId,preferenceType,DDCDetailId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/updateConsumerDebitCardInfo`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        clientId: clientId || null,
        nameOnCard: deposittoDebitCardDetail
          ? deposittoDebitCardDetail.name
          : null,
        cardNumber: deposittoDebitCardDetail
          ? deposittoDebitCardDetail.cardNo
          : null,
        expiryDate: deposittoDebitCardDetail
          ? moment(deposittoDebitCardDetail.expiryDate).format('YYYY-MM')
          : null,
        preferenceType: preferenceType,
        remittanceDetails: deposittoDebitCardDetail.remittanceDetails
          || null,
        otp: deposittoDebitCardDetail.otp || null,
        debitCardId: DDCDetailId,
      }),
    });
    const responseBody = await response.data;
  //  
    if (!responseBody.error) {
      dispatch({
        type: "UPDATE_CONSUMER_DEPOSIT_INFO_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "UPDATE_CONSUMER_DEPOSIT_INFO_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_CONSUMER_DEPOSIT_INFO_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};
export const updateFocusreliaZelle = (focusDetails) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/consumer/prepaid-card-accounts`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        paymentTypeId: (focusDetails && focusDetails.paymentTypeId) || null,
          transId: (focusDetails && (focusDetails.transactionId).toString())|| null,
          firstName: (focusDetails && focusDetails.firstName) || null,
          lastName: (focusDetails && focusDetails.lastName) || null,
          emailId: (focusDetails && focusDetails.email) || null,
          address1: (focusDetails && focusDetails.address1) || null,
          address2: (focusDetails && focusDetails.address2) || null,
          city:(focusDetails && focusDetails.city) || null,
          state: (focusDetails && focusDetails.state) || null,
          country: (focusDetails && focusDetails.country) || null,
          postalCode: (focusDetails && focusDetails.postalCode) || null,
          dateOfBirth: (focusDetails && focusDetails.startDate&& moment(focusDetails.startDate).format('MM/DD/YYYY')) || null,
          // dateOfBirth: (focusDetails && focusDetails.startDate) || null,
          uniqueId: (focusDetails && focusDetails.uniqueId) || null,
  ssn: (focusDetails && focusDetails.SSN) || null,
  homePhone: (focusDetails && focusDetails.phone) || null,
  mobilePhone: (focusDetails && focusDetails.mobilePhone) || null,
employerState: (focusDetails && focusDetails.employerState) || null,
govLocation: (focusDetails && focusDetails.govLocation) || null,
govExpiredDate: (focusDetails &&focusDetails.govExpiredDate&&  moment(focusDetails.govExpiredDate).format('MM/DD/YYYY')) || null,
// govExpiredDate: (focusDetails && focusDetails.govExpiredDate) || null,
govIdValue:(focusDetails && focusDetails.govIdValue) || null,
  govIdType:(focusDetails && focusDetails.govIdType) || null,
  preferenceType: (focusDetails && focusDetails.preferenceType) || null,
id: (focusDetails && focusDetails.PPDDetailId) || null,

      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'UPDATE_CONSUMER_FOCUS_INFO_SUCCESS',
        payload: responseBody.data,
        message: responseBody.message,
      });
      return true;
    }
    dispatch({
      type: 'UPDATE_CONSUMER_FOCUS_INFO_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FOCUS_INFO_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};
export const updatecorporateZelle = (focusDetails) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/consumer/prepaid-card-accounts`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        paymentTypeId: (focusDetails && focusDetails.paymentTypeId) || null,
          transId: (focusDetails && (focusDetails.transactionId).toString())|| null,
          firstName: (focusDetails && focusDetails.firstName) || null,
          lastName: (focusDetails && focusDetails.lastName) || null,
          emailId: (focusDetails && focusDetails.email) || null,
          address1: (focusDetails && focusDetails.address1) || null,
          address2: (focusDetails && focusDetails.address2) || null,
          city:(focusDetails && focusDetails.city) || null,
          state: (focusDetails && focusDetails.state) || null,
          country: (focusDetails && focusDetails.country) || null,
          postalCode: (focusDetails && focusDetails.postalCode) || null,
        
  preferenceType: (focusDetails && focusDetails.preferenceType) || null,
id: (focusDetails && focusDetails.PPDDetailId) || null,

      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: 'UPDATE_CONSUMER_FOCUS_INFO_SUCCESS',
        payload: responseBody.data,
        message: responseBody.message,
      });
      return true;
    }
    dispatch({
      type: 'UPDATE_CONSUMER_FOCUS_INFO_FAILED',
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FOCUS_INFO_FAILED',
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};
export const updateConsumerBankAchInfo = (achDetails) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/updateConsumerBankAchInfo`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        accountNumber: (achDetails && achDetails.accountNumber) || null,
        routingNumber: (achDetails && achDetails.routingNumber) || null,
        accountType: (achDetails && achDetails.accountType) || null,
        bankName: (achDetails && achDetails.bankName) || null,
        remittanceDetails: achDetails.remittanceDetails,
        preferenceType: achDetails.preferenceType,
        bankAccountId: achDetails.bankAccountId,
        otp: achDetails.otp || null,
      }),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "UPDATE_CONSUMER_ACH_INFO_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "UPDATE_CONSUMER_ACH_INFO_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_CONSUMER_ACH_INFO_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const updateConsumerPayPalInfo = (paypalDetail) => async (dispatch) => {
  const data = {
    tokenType: paypalDetail ? paypalDetail.infoType : null,
    tokenValue:
      paypalDetail && paypalDetail.infoType === "email"
        ? paypalDetail.email
          ? paypalDetail.email
          : null
        : paypalDetail.phone
        ? paypalDetail.phone
        : null,
    addressLine1: paypalDetail ? paypalDetail.address1 : null,
    addressLine2:
      paypalDetail?.address2?.toString()?.length !== 0
        ? paypalDetail.address2
        : null,
    country: paypalDetail ? paypalDetail.country : null,
    state: paypalDetail ? paypalDetail.state : null,
    city: paypalDetail ? paypalDetail.city : null,
    postalCode: paypalDetail ? paypalDetail.postalCode : null,
    preferenceType: paypalDetail.preferenceType,
    paypalId: paypalDetail.paypalId,
    remittanceDetails: paypalDetail.remittanceDetails,
    otp: paypalDetail ? paypalDetail.otp : null,
    countryCode:
      paypalDetail && paypalDetail.infoType === "phone" ? "+1" : null,
  };
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/updateConsumerPaypalInfo`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "UPDATE_CONSUMER_PAYPAL_INFO_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "UPDATE_CONSUMER_PAYPAL_INFO_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_CONSUMER_PAYPAL_INFO_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const updateConsumerPushToCardInfo =
  (pushtoCardDetail) => async (dispatch) => {
    const data = {
      nameOnCard: pushtoCardDetail.name || null,
      cardNumber: pushtoCardDetail.cardNo || null,
      expiryDate: moment(pushtoCardDetail.expiryDate).format("YYYY-MM") || null,
      cvv: pushtoCardDetail.cvv || null,
      addressLine1: pushtoCardDetail.address1 || null,
      addressLine2:
        pushtoCardDetail?.address2?.toString()?.length !== 0
          ? pushtoCardDetail.address2
          : null,
      country: pushtoCardDetail.country || null,
      state: pushtoCardDetail.state || null,
      city: pushtoCardDetail.city || null,
      postalCode: pushtoCardDetail.postalCode || null,
      preferenceType: pushtoCardDetail.preferenceType,
      remittanceDetails: pushtoCardDetail.remittanceDetails,
      cardId: pushtoCardDetail.cardId,
      otp: pushtoCardDetail.otp || null,
    };
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.consumerService}/updateConsumerCardInfo`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
        },
        data: JSON.stringify(data),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: "UPDATE_CONSUMER_PUSHTOCARD_INFO_SUCCESS",
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: "UPDATE_CONSUMER_PUSHTOCARD_INFO_FAILED",
        payload: responseBody.message || translatedData.somethingWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: "UPDATE_CONSUMER_PUSHTOCARD_INFO_FAILED",
        payload:
          (error.response && error.response.data.message) ||
          translatedData.errorOccured,
      });
      return false;
    }
  };

export const updateConsumerZelleInfo =
  (type, value, code, preferenceTypeVal, remittance, zelleId, otp) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.consumerService}/updateConsumerZelleInfo`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
        },
        data: JSON.stringify({
          tokenType: type || undefined,
          tokenValue: value || null,
          countryCode: code || null,
          preferenceType: preferenceTypeVal || null,
          remittanceDetails: (Boolean(remittance) && remittance) || [],
          zelleId: zelleId,
          otp: otp,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: "UPDATE_CONSUMER_ZELLE_INFO_SUCCESS",
          payload: responseBody.data,
          message: responseBody.message,
        });
        return true;
      }
      dispatch({
        type: "UPDATE_CONSUMER_ZELLE_INFO_FAILED",
        payload: responseBody.message || translatedData.somethingWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: "UPDATE_CONSUMER_ZELLE_INFO_FAILED",
        payload:
          (error.response && error.response.data.message) ||
          translatedData.errorOccured,
      });
      return false;
    }
  };

export const getPayeePaymentFilters = (filterParams) => async (dispatch) => {
  dispatch({
    type: "UPDATE_PAYEE_PAYMENT_FILTERS",
    payload: filterParams,
  });
  return filterParams;
};

export const fetchSecondaryPaymentMethodsList = () => async (dispatch) => {
  // const data = {
  //   alternatePaymentMethods :[
  //   {
  //     createdAt: "2021-07-26T06:04:43.000Z",
  //     createdBy: null,
  //     customPaymentCode: null,
  //     deletedAt: null,
  //     deletedBy: null,
  //     description: "Bank Deposit",
  //     displayOrder: 4,
  //     flag: 64,
  //     isDeleted: 0,
  //     locale: "en",
  //     localeId: 1,
  //     maxAmount: null,
  //     paymentCode: "ACH",
  //     paymentInfoKey: [
  //       "1-3 Business Days",
  //       "Utilizing your bank account and routing number.",
  //     ],
  //     paymentTypeId: 2,
  //     updatedAt: null,
  //     updatedBy: null,
  //   },
  //   {
  //     createdAt: "2021-07-26T06:04:43.000Z",
  //     createdBy: null,
  //     customPaymentCode: null,
  //     deletedAt: null,
  //     deletedBy: null,
  //     description: "Check",
  //     displayOrder: 5,
  //     flag: 64,
  //     isDeleted: 0,
  //     locale: "en",
  //     localeId: 1,
  //     maxAmount: null,
  //     paymentCode: "CHK",
  //     paymentInfoKey: [
  //       "10-15 Business Days",
  //       "Utilizing your mailing address.",
  //     ],
  //     paymentTypeId: 1,
  //     updatedAt: null,
  //     updatedBy: null,
  //   },
  // ]};
  // dispatch({
  //   type: "FETCH_SECONDARY_PAYMENT_METHODS_LIST_SUCCESS",
  //   payload: data,
  // });
  // return true;
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/alternate-payment-list`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_SECONDARY_PAYMENT_METHODS_LIST_SUCCESS",
        payload: responseBody.data || null,
      });
      return true;
    }
    dispatch({
      type: "FETCH_SECONDARY_PAYMENT_METHODS_LIST_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_SECONDARY_PAYMENT_METHODS_LIST_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const fetchRemittanceStatus = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.consumerService}/remittance-status`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_REMITTANCE_STATUS_SUCCESS",
        payload: responseBody.data || null,
      });
      return true;
    }
    dispatch({
      type: "FETCH_REMITTANCE_STATUS_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_REMITTANCE_STATUS_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};
