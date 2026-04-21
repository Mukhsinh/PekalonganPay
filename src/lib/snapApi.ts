/**
 * PekalonganPay SNAP API Client
 * 
 * Implements Bank Indonesia's SNAP (Standar Nasional Open API Pembayaran)
 * for interbank transfers and payment gateway integration.
 */

import type {
    SNAPAccessTokenResponse,
    SNAPBalanceResponse,
    SNAPTransactionStatusResponse,
    SNAPTransferRequest,
    SNAPTransferResponse
} from '@/types/snap';
import { SNAP_BASE_URL, SNAP_CLIENT_ID, SNAP_PARTNER_ID } from './constants';
import { generateHmacSignature, hashDigest } from './encryption';

class SNAPApiClient {
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;

    /**
     * Generate SNAP API Timestamp in ISO 8601 format
     */
    private getTimestamp(): string {
        return new Date().toISOString().replace('Z', '+07:00');
    }

    /**
     * Generate X-SIGNATURE header for SNAP API requests
     * Format: HMAC-SHA512(clientSecret, stringToSign)
     * stringToSign = HTTPMethod + ":" + RelativeUrl + ":" + AccessToken + ":" + 
     *                SHA256(minifiedRequestBody) + ":" + Timestamp
     */
    private async generateSignature(
        method: string,
        path: string,
        body: object,
        timestamp: string
    ): Promise<string> {
        const bodyHash = await hashDigest(JSON.stringify(body));
        const stringToSign = `${method}:${path}:${this.accessToken}:${bodyHash}:${timestamp}`;
        return generateHmacSignature(stringToSign, SNAP_CLIENT_ID);
    }

    /**
     * Generate X-SIGNATURE for token request (asymmetric)
     * Format: SHA256(clientId + "|" + timestamp)
     */
    private async generateTokenSignature(timestamp: string): Promise<string> {
        return hashDigest(`${SNAP_CLIENT_ID}|${timestamp}`);
    }

    /**
     * Get or refresh access token
     */
    async getAccessToken(): Promise<string> {
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        const timestamp = this.getTimestamp();
        const signature = await this.generateTokenSignature(timestamp);

        try {
            const response = await fetch(`${SNAP_BASE_URL}/v1.0/access-token/b2b`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CLIENT-KEY': SNAP_CLIENT_ID,
                    'X-TIMESTAMP': timestamp,
                    'X-SIGNATURE': signature,
                },
                body: JSON.stringify({
                    grantType: 'client_credentials',
                }),
            });

            const data: SNAPAccessTokenResponse = await response.json();

            if (data.accessToken) {
                this.accessToken = data.accessToken;
                this.tokenExpiry = Date.now() + (parseInt(data.expiresIn || '900') * 1000);
                return data.accessToken;
            }

            throw new Error(data.responseMessage || 'Failed to get access token');
        } catch (error) {
            throw new Error(`SNAP Auth Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Make authenticated SNAP API request
     */
    private async request<T>(
        method: string,
        path: string,
        body: object
    ): Promise<T> {
        await this.getAccessToken();
        const timestamp = this.getTimestamp();
        const signature = await this.generateSignature(method, path, body, timestamp);
        const externalId = `PKP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const response = await fetch(`${SNAP_BASE_URL}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
                'X-TIMESTAMP': timestamp,
                'X-SIGNATURE': signature,
                'X-PARTNER-ID': SNAP_PARTNER_ID,
                'X-EXTERNAL-ID': externalId,
                'CHANNEL-ID': '95051',
            },
            body: JSON.stringify(body),
        });

        return response.json();
    }

    /**
     * Transfer to another bank account (BI-FAST / RTGS / SKN)
     */
    async transferInterbank(params: SNAPTransferRequest): Promise<SNAPTransferResponse> {
        return this.request<SNAPTransferResponse>('POST', '/v1.0/transfer-interbank', {
            partnerReferenceNo: params.referenceNo,
            amount: {
                value: params.amount.toFixed(2),
                currency: 'IDR',
            },
            beneficiaryAccountName: params.beneficiaryName,
            beneficiaryAccountNo: params.beneficiaryAccount,
            beneficiaryBankCode: params.beneficiaryBankCode,
            sourceAccountNo: params.sourceAccount,
            transactionDate: this.getTimestamp(),
            additionalInfo: {
                deviceId: params.deviceId,
                channel: 'MOBILE_APP',
            },
        });
    }

    /**
     * Check account balance
     */
    async getBalance(accountNo: string): Promise<SNAPBalanceResponse> {
        return this.request<SNAPBalanceResponse>('POST', '/v1.0/balance-inquiry', {
            partnerReferenceNo: `BAL-${Date.now()}`,
            accountNo,
        });
    }

    /**
     * Check transaction status
     */
    async getTransactionStatus(
        referenceNo: string,
        serviceCode: string = '17' // 17 = Transfer Interbank
    ): Promise<SNAPTransactionStatusResponse> {
        return this.request<SNAPTransactionStatusResponse>('POST', '/v1.0/transfer/status', {
            originalPartnerReferenceNo: referenceNo,
            originalReferenceNo: referenceNo,
            serviceCode,
        });
    }
}

export const snapApi = new SNAPApiClient();
export default snapApi;
