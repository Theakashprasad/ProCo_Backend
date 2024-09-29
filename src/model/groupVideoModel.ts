import mongoose ,{Schema,Document} from 'mongoose'

export interface groupVideoDocument extends Document{
    creator:string
    name: string  
}

const GroupVideoSchema:Schema<groupVideoDocument>=new Schema({
    creator:String,
    name : String,  
},{timestamps: true})
 
export const GroupVideoModel=mongoose.model<groupVideoDocument>('groupVideo',GroupVideoSchema)

