
export const ComedyTheaterRepo = (comedyTheaterAdapter) => ({
    getShowAmount: async () => comedyTheaterAdapter.getShowAmount(),
    getShowAdress: async (index) => comedyTheaterAdapter.getShowAdress(index),
    addShow: async (description, durationInDays) =>
        comedyTheaterAdapter.addShow(description, durationInDays),
}
)