import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const ticketCollection = "Tickets";

const ticketSchema = new Schema({
	code: {type: String, required: true},
	purchasedate: {type: String, required: true},
	purchaser: {type: String, required: true},
	total: {type: Number, required: true},
});

ticketSchema.plugin(mongoosePaginate);

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;