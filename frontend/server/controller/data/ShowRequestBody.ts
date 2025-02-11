export interface ShowRequestBody {
    id: string;
    description: string;
    imageUrl?: string | null;
    createdAt: Date;
}
