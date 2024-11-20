
const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const MockComedyTheaterAdapter = () => {
    let amount = 5;
    return {
        getShowAmount: async () => amount,
        getShowAdress: async (index: number) => index,
        addShow: async (description: string, durationInDays: number) => {
            await delay(1000);
            amount++;
        },
        isManager: async () => true,
    }
}