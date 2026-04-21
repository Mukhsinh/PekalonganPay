/**
 * SNAP API Types (Bank Indonesia Standard)
 */

// ─── Access Token ───────────────────────────────────────────────
export interface SNAPAccessTokenResponse {
    responseCode: string;
    responseMessage: string;
    accessToken?: string;
    tokenType?: string;
    expiresIn?: string;
}

// ─── Transfer ───────────────────────────────────────────────────
export interface SNAPTransferRequest {
    referenceNo: string;
    amount: number;
    beneficiaryName: string;
    beneficiaryAccount: string;
    beneficiaryBankCode: string;
    sourceAccount: string;
    deviceId: string;
}

export interface SNAPTransferResponse {
    responseCode: string;
    responseMessage: string;
    referenceNo?: string;
    partnerReferenceNo?: string;
    amount?: {
        value: string;
        currency: string;
    };
    beneficiaryAccountNo?: string;
    beneficiaryBankCode?: string;
    beneficiaryBankName?: string;
    sourceAccountNo?: string;
    transactionDate?: string;
}

// ─── Balance ────────────────────────────────────────────────────
export interface SNAPBalanceResponse {
    responseCode: string;
    responseMessage: string;
    accountInfos?: Array<{
        accountNo: string;
        accountName: string;
        balanceType: string;
        amount: {
            value: string;
            currency: string;
        };
        status: string;
    }>;
}

// ─── Transaction Status ─────────────────────────────────────────
export interface SNAPTransactionStatusResponse {
    responseCode: string;
    responseMessage: string;
    originalReferenceNo?: string;
    originalPartnerReferenceNo?: string;
    serviceCode?: string;
    transactionDate?: string;
    amount?: {
        value: string;
        currency: string;
    };
    latestTransactionStatus?: string;
    transactionStatusDesc?: string;
}
