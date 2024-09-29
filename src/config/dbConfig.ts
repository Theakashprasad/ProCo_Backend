    import mongoose from "mongoose";

    const connectDb = async()=>{
        try{
            const connect = await mongoose.connect(`${process.env.CONNECTION_STRING}`)
            console.log('mongodb has connected ...');
            
        }catch(err){
            console.log(err);
            process.exit(1)
            
        } 
    }
    export default connectDb