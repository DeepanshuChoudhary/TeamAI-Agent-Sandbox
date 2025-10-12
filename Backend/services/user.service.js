import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const createUser = async ({
    email, password
}) => {

    if (!email || !password) {
        throw new Error("Email and Password are required")
    }

    const user = await userModel.create({
        email,
        password: await bcrypt.hash(password, 10)
    });

    return user;

}

export const getAllUsers = async ({ userId }) => {
    const users = await userModel.find({
        _id: { $ne: userId }    // $ne stands for "Not Equal" in MongoDB queries.
    });
    return users;
}