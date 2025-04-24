import axiosClient from "../../api/axiosClient";

const TicketService = {
    createTicket: async (ticketData) => {
        const response = await axiosClient.post("/tickets", ticketData);
        return response.data;
    },

    getMyTickets: async () => {
        const response = await axiosClient.get("/tickets");
        return response.data;
    },

    getTicketById: async (id) => {
        const response = await axiosClient.get(`/tickets/${id}`);
        return response.data;
    },

    deleteTicket: async (id) => {
        await axiosClient.delete(`/tickets/${id}`);
    }
};

export default TicketService;