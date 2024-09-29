import mongoose ,{Schema,Document, ObjectId} from 'mongoose'

export interface ProDocument extends Document{
    fullname:string
    Profession: string  
    subProfession: string  
    working:string
    achievements: string
    country:string
    about: string
    imageUrl: string
    email: string
    request: boolean
    Linkedin : string
}

const ProSchema:Schema<ProDocument>=new Schema({
  fullname:{type:String},
    Profession:{type:String},
    subProfession:{type:String},
    working:{type:String}, 
    achievements:{type:String},
    country:{type:String},
    about:{type:String},
    imageUrl:{type:String},
    email: {type:String},
    request:{type:Boolean, default: false},
    Linkedin:{type:String},
})
 
export const ProModel=mongoose.model<ProDocument>('pro',ProSchema) 

