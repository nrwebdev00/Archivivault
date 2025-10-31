import mongoose from 'mongoose';

const mongoDBConnection = async (uri: any) =>{
    try{
        await mongoose.connect(uri, {
            dbName: 'Archivivault',
            autoIndex: true,
        });
        console.log(`✅ Connected to Mongo DB`);
    } catch(err){
        console.log(`❌ MongoDB connection error: ${err}`);
        process.exit(1);
    }
}

export { mongoDBConnection }