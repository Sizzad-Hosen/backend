import mongoose from "mongoose";

const connectdb = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbname: "E-commerce"  
        };

        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log('Database Connected Successfully');
    } catch (error) {
        console.error("Database connection error:", error);  
    }
};

export default connectdb;
