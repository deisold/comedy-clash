const ethers = require("ethers");
import comedyTheaterJSON from "../utils/ComedyTheater.json"

export const ComedyTheaterAdapter = (web3Provider, address) => {
    let contract;

    async function getContract() {
        return contract || (contract = new ethers.Contract(
            address,
            comedyTheaterJSON.abi,
            web3Provider
        ));
    }

    return {
        getShowAmount: async () => (await getContract()).getShowAmount(),
        getShowAdress: async (index) => (await getContract()).shows(index),
        addShow: async (description, durationInDays) => {
            return (await getContract()).addShow(description, durationInDays);
        },
        isManager: async () => {
            try {
                const signer = await web3Provider.getSigner();
                const currentAddress = await signer.getAddress();
                const managerAddress = await contract.manager();
                return currentAddress.toLowerCase() === managerAddress.toLowerCase();
            } catch (error) {
                console.error('Error checking manager status:', error);
                return false;
            }
        }
    }
}