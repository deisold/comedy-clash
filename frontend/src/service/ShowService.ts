import { ShowRepositoryType } from "../repositories/ShowRepo";
import { ComedyTheaterRepoType } from "../repositories/ComedyTheaterRepo";
import { ComedyClashRepoType } from "../repositories/ComedyClashRepo";
import _ from "lodash";
import { toShow, Show } from "../data/Show";
import { TxStatus } from "@/data/TxStatus";
//
export interface ShowServiceType {
    getShowAmount: () => Promise<number>;
    getShowAdress: (index: number) => Promise<string>;
    getShow: (index: number) => Promise<Show | null>;
    addShow: (description: string, days: number, imageUrl: string | null) => Promise<void>;
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

                return toShow({
                    id: address,
                    userId: showRepo?.userId ?? "",
                    description: description ?? "",
                    imageUrl: showRepo?.imageUrl,
                    txHash: showRepo?.txHash ?? "",
                    txStatus: showRepo?.txStatus ?? TxStatus.PENDING,
                    createdAt: showRepo?.createdAt ?? new Date(),
                    submissionCount: submissionCount ?? 0,
                    isClosed: isClosed ?? false,
                });
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        addShow: async (description: string, days: number, imageUrl: string | null) => {
            return new Promise<void>((resolve, reject) => {
                try {
                    // const tx = await comedyTheaterRepo.addShow(description, days, imageUrl);
                    // resolve(tx);
                } catch (error) {
                    reject(error);
                }
            });
        }
    }
}
