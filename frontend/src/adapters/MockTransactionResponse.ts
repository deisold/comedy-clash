import { ContractTransactionResponse} from "ethers";

export type MockTransactionResponse = ContractTransactionResponse & {
    wait: () => Promise<any>;
};
