import mongoose from "mongoose";

// Add type definition for ShowDB
export interface ShowDBType {
    address: string;
    description: string;
    imageUrl?: string | null;
    createdAt: Date;
}
// The id represents the show address in the Comedy Theater contract
const showSchema = new mongoose.Schema<ShowDBType>({
    address: {
        type: String, // Store it as a plain string
        required: true,
        unique: true // create a unique index
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const ShowDB = mongoose.model<ShowDBType>('Show', showSchema);

export default ShowDB;