
export const MockComedyClashAdapter = (web3Provider, address) => ({
    getDescription: async () => "Desc-" + address,
    isClosed: async () => (address == 0) ? false : true,
    getSubmissionCount: async () => 3,
}
)