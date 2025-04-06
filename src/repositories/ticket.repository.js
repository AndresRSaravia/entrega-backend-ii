// DAO
import ticketDao from "../dao/ticket.dao.js";

class TicketRepository {
	async createTicket(ticketData) {
		return await ticketDao.save(ticketData);
	}
}

export default new TicketRepository();