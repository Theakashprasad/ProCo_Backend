import mongoose ,{Schema,Document} from 'mongoose'

export interface UserProfileDocument extends Document{
    email:string
    profession:string
    gender: string
    education:string
    age:string
    hobbies:string
    Interest:string
    country:string
    Linkedin:string
    state:string
    about:string
    imageUrl: string
    bgImage: string 
}

const UserProfileSchema:Schema<UserProfileDocument>=new Schema({
    email:{type:String},
    profession:{type:String},
    gender:{type:String},
    education: { type: String},  
    age:{type:String},
    hobbies:{type:String},
    Interest:{type:String},
    country:{type:String},
    Linkedin:{type:String},
    state:{type:String},
    about:{type:String},    
    imageUrl: {type:String},
    bgImage:{type:String, default: 'hai'},
})  
 
export const UserProfileModel = mongoose.model<UserProfileDocument>('profile',UserProfileSchema) 