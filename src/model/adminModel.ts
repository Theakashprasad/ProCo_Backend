import mongoose ,{Schema,Document} from 'mongoose'

export interface AdminDocument extends Document{
    email:string
    password:string
}

const AdminSchema:Schema<AdminDocument>=new Schema({
    email:{type:String},
    password:{type:String},
})
 
export const AdminModel=mongoose.model<AdminDocument>('admin',AdminSchema)