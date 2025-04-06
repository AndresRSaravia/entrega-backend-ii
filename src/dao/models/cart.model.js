import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const cartCollection = "Carritos";

const cartSchema = new Schema({
	products: [{
		_id : {type: Schema.Types.ObjectId, ref: 'Productos', required: true},
		quantity : {type: Number, required: true},
	}],
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;