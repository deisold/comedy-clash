import { ShowRepositoryType } from "../repositories/ShowRepo";
import { ComedyTheaterRepoType } from "../repositories/ComedyTheaterRepo";
import { ComedyClashRepoType } from "../repositories/ComedyClashRepo";
import _ from "lodash";
import { createShow, Show } from "../data/Show";
//
export interface ShowServiceType {
    getShowAmount: () => Promise<number>;
    getShowAdress: (index: number) => Promise<string>;
    getShow: (index: number) => Promise<Show | null>;
}

export const ShowService = (
    comedyTheaterRepo: ComedyTheaterRepoType,
    comedyClashRepo: ComedyClashRepoType,
    showRepository: ShowRepositoryType
): ShowServiceType => {
    return {
        getShowAmount: async () => {
            const amount = await comedyTheaterRepo.getShowAmount();
            return amount;
        },
        getShowAdress: async (index: number) => {
            const address = await comedyTheaterRepo.getShowAdress(index);
            return address;
        },
        getShow: async (index: number) => {
            try {
                const address = await comedyTheaterRepo.getShowAdress(index);
                console.log(`address=${address}`);
                if (_.isEmpty(address) || _.isNil(address)) {
                    return null;
                }

                const showRepo = await showRepository.getShow(address);
                const description = showRepo?.description ?? await comedyClashRepo.getDescription(address);
                const isClosed = await comedyClashRepo.isClosed(address);
                const submissionCount = await comedyClashRepo.getSubmissionCount(address);

                return createShow({
                    id: index,
                    address: address,
                    submissionCount: submissionCount,
                    isClosed: isClosed,
                    description: description ?? "",
                    imageUrl: showRepo?.imageUrl,
                });
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    }
}
