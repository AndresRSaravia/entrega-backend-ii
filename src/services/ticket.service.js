// Repositorio de ticket
import ticketRepository from '../repositories/ticket.repository.js'

class TicketService {
	async createTicket(ticketData) {
		const {code, purchasedate, purchaser, total} = ticketData;
		const incompleteValues = !code||!purchasedate||!purchaser||!total
		if(incompleteValues) throw new Error('Valores incompletos', code)
		return await ticketRepository.createTicket(ticketData)
	}
}

export default new TicketService();