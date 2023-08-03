const initialState = {
  updatedBusinessUserInfo: {
    title: ' ',
    firstName: '',
    lastName: '',
    workEmail: '',
    cphoneCountryCode: '+1',
    cphoneNumber: '',
    cphoneExtNumber: '',
    roleIdMask: 0,
    isCertify: false,
    userName: '',
    password: '',
    confirmPassword: '',
    securityQuestionId: 0,
    securityAnswer: '',
    otp: null,
    companyName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneCountryCode: '+1',
    phoneNumber: '',
    phoneExtNumber: '',
    fax: '',
    website: '',
    fedtaxId: '',
    ssnNumber: '',
    businessRoleIds: [],
  },
  businessUserRoles: null,
  businessUserRegistrationData: null,
};

export default function USBankConsumerRegistration(
  state = initialState,
  action = {}
) {
  switch (action.type) {
    case 'UPDATE_BUSINESS_USER_INFO': {
      return {
        ...state,
        updatedBusinessUserInfo: action.payload,
      };
    }
    case 'FETCH_BUSINESS_USER_ROLES_SUCCESS': {
      return {
        ...state,
        businessUserRoles: { data: action.payload, error: null },
      };
    }
    case 'FETCH_BUSINESS_USER_ROLES_FAILED': {
      return {
        ...state,
        businessUserRoles: {
          ...state.businessUserRoles,
          error: action.payload,
        },
      };
    }
    case 'REGISTER_BUSINESS_USER_SUCCESS': {
      return {
        ...state,
        businessUserRegistrationData: {
          data: action.payload,
          error: null,
        },
      };
    }
    case 'REGISTER_BUSINESS_USER_FAILED': {
      return {
        ...state,
        businessUserRegistrationData: {
          ...state.businessUserRegistrationData,
          error: action.payload,
        },
      };
    }
    default: {
      return { ...state };
    }
  }
}
