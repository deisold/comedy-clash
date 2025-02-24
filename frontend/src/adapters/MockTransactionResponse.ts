import { ContractTransactionResponse } from "ethers";

export type MockTransactionResponse = ContractTransactionResponse & {
    wait: () => Promise<void>;
    hash: string;
};

export const defaultDelayMS = 2000;

function generateRandomHash(): string {
    const length = 64; // 32 bytes in hexadecimal
    const characters = 'abcdef0123456789';
    let result = '0x';
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}

export const createDelayedMockResponse = (): MockTransactionResponse => ({
    wait: () => new Promise(resolve => setTimeout(resolve, defaultDelayMS)),
    hash: generateRandomHash(),
} as MockTransactionResponse);