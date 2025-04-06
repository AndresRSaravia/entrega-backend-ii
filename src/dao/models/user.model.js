import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const userCollection = "Usuarios";

const userSchema = new Schema({
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
	age: {type: Number, required: true},
	email: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	cart: {type: String, required: true},
	role: {
		type: String,
		enum: ['admin','user'],
		default: 'user',
		required: true
	},
});

userSchema.plugin(mongoosePaginate);

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;