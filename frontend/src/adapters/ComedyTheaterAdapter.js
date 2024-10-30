const ethers = require("ethers");
import comedyTheaterJSON from "../utils/ComedyTheater.json"
import { initWeb3Provider } from '../utils/web3';

let contract;

async function initComedyTheaterAdapter(address) {
    const providerInstance = await initWeb3Provider();
    return new ethers.Contract(
        address,
        comedyTheaterJSON.abi,
        providerInstance
    );
}

async function getContract(address) {
    contract = contract || await initComedyTheaterAdapter(address);
    return contract;
}

export const ComedyTheaterAdapter = (address) => ({
    getShowAmount: async () => {
        return await (await getContract(address)).getShowAmount();
    }
}
)