import mongoose ,{Schema,Document} from 'mongoose'

export interface UserDocument extends Document{
    fullname:string
    email:string
    password:string
    otp: number
    isVerified:boolean
    report:number
    isBlocked:boolean
    role: string
    payment: boolean
    paymentDate: string
}

const UserSchema:Schema<UserDocument>=new Schema({
    fullname:{type:String},
    email:{type:String},
    password:{type:String},
    otp:{type:Number},
    isVerified: { type: Boolean},  
    report:{type:Number, default:0},
    isBlocked:{type:Boolean, default: false},
    role:{type:String},
    payment: {type:Boolean, default: false},
    paymentDate: {type:String, default: ""},
})
 
export const UserModel = mongoose.model<UserDocument>('user',UserSchema)