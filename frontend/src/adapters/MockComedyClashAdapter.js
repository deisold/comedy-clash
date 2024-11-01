
export const MockComedyClashAdapter = (web3Provider, address) => ({
    getDescription: async () => {
        return "Descr" + address.substr(0, 10);;
    },

}
)