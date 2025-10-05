import mongoose from "mongoose";

const connectdb = async () => {
    await mongoose.connect(process.env.MONGOOSE_URL)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch(err => {
            console.log(err);
    })
}

export default connectdb;