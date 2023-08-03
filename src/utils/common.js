import moment from 'moment';
/**
 * returns the masked string
 * leaving only last 4 numbers/chars unmasked
 * @param {*} ssn
 * @returns
 */
export const starredMask = (ssn) => {
  ssn = ssn && ssn.toString();
  let maskedCharsLength = ssn && ssn.length > 4 ? ssn.length - 4 : 0;
  let str = '';
  str = ssn && '*'.repeat(maskedCharsLength) + ssn.slice(maskedCharsLength);
  return str;
};

// returns masked string with space every 4 stars
export const starredMaskCard = (str) => {
  str = str && str.toString() && str.replace(/\s/g, '');
  if (str?.length === 16) {
    let str1 = `**** **** **** ${str.slice(-4)}`;
    return str1;
  } else {
    return starredMask(str);
  }
};

// returns masked string with - every 3 Xs
export const starredMaskPhoneNumber = (str) => {
  if (str) {
    let str1 = `XXX-XXX-${str.slice(-4)}`;
    return str1;
  }
  return str;
};

/**
 * returns the masked string with all asterisks
 * @param {*} ssn
 * @returns
 */
export const starredCompleteMask = (ssn) => {
  // ssn = ssn && ssn.toString();
  // let maskedCharsLength = ssn && ssn.length > 4 ? ssn.length - 4 : 0;
  let str = '';
  str = '*'.repeat(ssn.length);
  return str;
};

export const getAddress = (data) => {
  let addressString = '';
  if (data?.addressLine1) {
    addressString += data.addressLine1;
  }
  if (data?.addressLine2) {
    addressString += (addressString.length ? ', ' : '') + data.addressLine2;
  }
  if (data?.city) {
    addressString += (addressString.length ? ', ' : '') + data.city;
  }
  if (data?.state) {
    addressString += (addressString.length ? ', ' : '') + data.state;
  }
  if (data?.country) {
    addressString += (addressString.length ? ', ' : '') + data.country;
  }
  if (data?.postalCode) {
    addressString += (addressString.length ? ', ' : '') + data.postalCode;
  }
  return addressString;
};

/**
 *
 * @param {*} dateVal
 * @returns date in format 'MM/DD/YYYY'
 */
export const getFormattedDate = (dateVal) => {
  if (dateVal) {
    return moment(dateVal).format('MM/DD/YYYY');
  }
  return null;
};

export const getFormattedCurrency = (currencyVal) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(currencyVal);
};

/**
 *
 * @param string phoneNumber
 * @returns phoneNumber in format 'XXX-XXX-XXXX'
 */
export const getFormattedPhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
      const match = phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
          return  match[1] + '-' + match[2] + '-' + match[3];
      }
    }
    return "";
};