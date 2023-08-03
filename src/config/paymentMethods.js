export const paymentMethods = {
    "Zelle": "CXC",
    "Instant Pay": "MSC",
    "PayPal": "PPL",
    "ACH": "ACH",
    "VCA": "VCA",
    "CHK": "CHK",
    "CDM": "CDM",
    "USBankZelle":"ZEL", // Zelle Code for US Bank
    "USBankACH": "ACH",
    "USBankCHK": "CHK",
    "USBankRTP":"RTP",
    "USBankDepositToDebitcard":"DDC",
    "USBankPrepaidCard":"PPD",
    "PrepaidFocusNonPayroll":"PFB",
    "PrepaidReliaCard":"PRC",
    "PrepaidCorporateReward":"PCR",
    "PlasticCorporateCard":"CRP",
    "DigitalCorporateCard":"CRD"
}

export const paymentMethodIds = {
    "CHK": 1,
    "ACH": 2,
    "CDM": 8,
    "PPL": 16,
    "MSC": 32,
    "CXC": 64,
    "RTP": 128,
    "WIRE": 256,
    "USBankZelle": 64, // Zelle Code for US Bank
    "USBankACH": 2,
    "USBankCHK": 1,
    "USBankDepositToDebitcard": 256,
    "USBankPrepaidCard": 512,
    //"PrepaidFocusNonPayroll": 2048,
    //"PrepaidReliaCard": 4096,
    "PrepaidCorporateReward": 1024,
    "PlasticCorporateCard": 8192,
    "DigitalCorporateCard": 16384,
    "PrepaidFocusNonPayroll":2048,
    "PrepaidReliaCard":4096,

}
export const transactionIds = {
    
    "PlasticCorporateCard": 3450,

}
export const USBankPaymentMethodIds = {
    "CHK": 1,
    "ACH": 2,
    "CDM": 8,
    "PPL": 16,
    "ZEL":64,
    "RTP":128,
    "DDC":256,
    "CRP": 8192,
    "CRD": 16384,
    "PFB":2048,
    "PRC":4096,
}

export const cardTypes = {
    'V': 'VISA',
    'M': 'Mastercard'
}

export const Consumer_Status = {
    ACTIVE: 1,
    ENROLLMENT_PENDING: 2,
    REVOKED: 4,
    DELETED: 8,
    INACTIVE: 16,
    AWAITING_NETWORK_DETAILS: 32,
    AUTHORIZATION_FAILED: 64,
    PAYMENT_PREFERENCE_PENDING: 128,
    DEACTIVATED: 1024,
    PROFILE_CREATION_PENDING: 2048,
};

export const paymentMethodsTimeSpan = {
    CHK: '10-15',
    ACH: '1-3',
    CXC: 'less than an hour',
    PPL: 'less than an hour',
    MSC: 'less than an hour',
    USBankACH: '1-3',
    USBankDepositToDebitcard: 'less than an hour',
    USBankZelle: 'less than an hour',
    USBankPrepaidCard: '1-3',
    USBankCHK: '10-15'
};


export const PaymentPriority =
{
    Primary: "1",
    Alternate: "2",
    Default: "3",
};

export const PAYMENT_STATUS = {
    COMPLETED: 4,
    REJECTED: 12
};
export const CorporateCardconsts = {
    "disclouserform": "US Bank Corporate Rewards_CardHolder agreement.pdf",
    "PlasticCard": "Corporate-Plastic-Card.png",
    "DigitalCard":"Corporate-Digital-Card.png"
};
