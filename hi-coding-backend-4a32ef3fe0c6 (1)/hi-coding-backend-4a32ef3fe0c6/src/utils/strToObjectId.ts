import mongoose from "mongoose"

export const strToObjectId = (id: string) => new mongoose.Types.ObjectId(id)