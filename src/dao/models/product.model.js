import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const productCollection = "Productos";

//Definirmos el esquema para el estudiante
const productSchema = new Schema({
	title: {type: String, required: true},
	description: {type: String, required: true},
	code: {type: String, required: true},
	price: {type: Number, required: true},
	status: {type: Boolean, required: true},
	stock: {type: Number, required: true},
	category: {type: String, required: true},
	thumbnail: {type: String, required: true},
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
