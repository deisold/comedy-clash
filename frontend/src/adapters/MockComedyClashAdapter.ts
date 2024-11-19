import { Provider } from "ethers";

export const MockComedyClashAdapter = (web3Provider: Provider, address: string) => {
    let submissions = 3;

    let closed = new Proxy({}, {
        get: (target, key) => key in target ? target[key] : address != '0'
    });

    const delay = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    return ({
        getPrecision: async () => BigInt(10 ** 18),
        getDescription: async () => "Desc-" + address,
        isClosed: async () => closed[address],
        getSubmissionCount: async () => submissions,

        getSubmission: async (index: number) => ({
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
        createVotingForSubmission: async (index: number, voterName: string, comment: string, value: BigInt): Promise<void> => {
            submissions++
            await delay(1000);
        },
        closeSubmission: async () => {
            closed[address] = true;
            await delay(1000);
        }
    })
}