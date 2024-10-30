
export const ComedyTheaterRepo = (comedyTheaterAdapter) => ({
    getShowAmount: async () => {
        return await comedyTheaterAdapter.getShowAmount();
    }
}
)