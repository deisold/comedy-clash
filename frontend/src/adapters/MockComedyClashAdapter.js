
export const MockComedyClashAdapter = (web3Provider, address) => ({
    getPrecision: async () => BigInt(10n ** 18n),
    getDescription: async () => "Desc-" + address,
    isClosed: async () => (address == 0) ? false : true,
    getSubmissionCount: async () => 3,

    getSubmission: async (index) => ({
        id: index,
        artistAddress: 900 + index,
        name: `Name${index}`,
        topic: `Topic${index}`,
        preview: `Preview${index}`,
        votes: [{}],
        averageTotal: index * 8,
        averageCount: index + 10,
        averageValue: BigInt("4560000000000000000"),
    })
})