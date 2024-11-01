
export const MockComedyClashAdapter = (web3Provider, address) => ({
    getDescription: async () => "Desc-" + address,
}
)