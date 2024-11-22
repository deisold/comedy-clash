import { Provider, JsonRpcProvider, BrowserProvider } from "ethers";
import { ComedyTheater, ComedyTheater__factory } from "../utils/types";
import { ComedyTheaterAdapterType } from "./ComedyTheaterAdapterType";

export const ComedyTheaterAdapter = (web3Provider: Provider, address: string): ComedyTheaterAdapterType => {
    let contract: ComedyTheater | null = null;

    async function getContract() {
        return contract || ComedyTheater__factory.connect(address, web3Provider);
    }

    return {
        getShowAmount: async () => (await getContract()).getShowAmount(),
        getShowAdress: async (index: number) => (await getContract()).shows(index),
        addShow: async (description: string, durationInDays: number) => {
            (await getContract()).addShow(description, durationInDays);
        },
        isManager: async () => {
            try {
                if (web3Provider instanceof JsonRpcProvider) {
                    return false;
                }
                const signer = await (web3Provider as BrowserProvider).getSigner();
                const currentAddress = await signer.getAddress();
                const managerAddress = await (await getContract()).manager();
                return currentAddress.toLowerCase() === managerAddress.toLowerCase();
            } catch (error) {
                console.error('Error checking manager status:', error);
                return false;
            }
        }
    }
}