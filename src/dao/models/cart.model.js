import mongoose from "mongoose";

const { Schema } = mongoose;

const cartCollection = "Carritos";

//Definirmos el esquema para el estudiante
const cartSchema = new Schema({
	products: [{
		_id : {type: Schema.Types.ObjectId, ref: 'Productos', required: true},
		quantity : {type: Number, required: true},
	}], //
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;