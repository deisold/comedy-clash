export const MockComedyClashAdapter = (web3Provider, address) => {
    let submissions = 3;

    let closed = new Proxy({}, {
        get: (target, key) => key in target ? target[key] : address != 0
    });

    const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    return ({
        getPrecision: async () => BigInt(10n ** 18n),
        getDescription: async () => "Desc-" + address,
        isClosed: async () => closed[address],
        getSubmissionCount: async () => submissions,

        getSubmission: async (index) => ({
            id: index,
            artistAddress: 900 + index,
            name: `Name${index}`,
            topic: `Topic${index}`,
            preview: `Preview${index}`,
            votes: [{}],
            averageTotal: index * 8,
            averageCount: index + 10,
            averageValue: BigInt(Math.floor(Math.random() * 401 + 100).toString() + Array(16).fill(0).map(() =>
                Math.floor(Math.random() * 10)).join('')),


        }),
        createVotingForSubmission: async (index, voterName, comment, value) => {
            submissions++
            await delay(1000);
        },
        closeSubmission: async () => {
            closed[address] = true;
            await delay(1000);
        }
    })
}