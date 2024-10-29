const ethers = require("ethers");
import comedyTheaterJSON from "./ComedyTheater.json"
import { initWeb3Provider } from './web3';

export async function initComedyTheater() {
    const providerInstance = await initWeb3Provider();
    return new ethers.Contract(
        "0x907b77166997FD2f8b347301AD76A30ab11FD908",
        comedyTheaterJSON.abi,
        providerInstance
    );
}
