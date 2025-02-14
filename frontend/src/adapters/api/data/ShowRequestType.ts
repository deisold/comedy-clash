export interface ShowRequestType {
    id: string; // The id represents the show address in the Comedy Theater contract
    description: string;
    imageUrl?: string | null;
    createdAt: Date;
}