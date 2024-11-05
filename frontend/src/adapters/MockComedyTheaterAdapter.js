
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const MockComedyTheaterAdapter = () => {
    let amount = 5;
    return {
        getShowAmount: async () => amount,
        getShowAdress: async (index) => index,
        addShow: async (description, durationInDays) => {
            await delay(1000);
            amount++;
        }
    }
}