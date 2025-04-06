import ticketModel from './models/ticket.model.js'

class TicketDao {
	async save(ticketData) {
		const ticket = new ticketModel(ticketData);
		return await ticket.save();
	}
}

export default new TicketDao();