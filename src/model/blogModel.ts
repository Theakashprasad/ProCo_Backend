import mongoose ,{Schema,Document, ObjectId} from 'mongoose'

export interface BlogDocument extends Document{
    about: string
    image: string[]
    email: string
    block: boolean
    like: string[]
}

const BlogSchema:Schema<BlogDocument>=new Schema({
    about:{type:String},    
    image: { type: [String],},  // Change 'image' to 'images' and set type to array of strings
    email: {type:String},
    block:{type:Boolean, default:  false}, 
    like: { type: [String], default: [] } 
},{timestamps: true})
 
export const BlogModel=mongoose.model<BlogDocument>('blog',BlogSchema)

