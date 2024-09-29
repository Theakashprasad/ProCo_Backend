import mongoose ,{Schema,Document} from 'mongoose'

export interface connectionDocument extends Document{
    senterId:string
    follow: string  
    receiverId: string  
}

const ConnectionSchema:Schema<connectionDocument>=new Schema({
    senterId:String,
    follow : String,  
    receiverId : String,  
},{timestamps: true})
 
export const ConnectionModel=mongoose.model<connectionDocument>('connection',ConnectionSchema)

