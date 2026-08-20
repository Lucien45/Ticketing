import Axios from "../api/axios";
import type { Ticket, TicketPriority, TicketStatus } from '../types';

export interface CreateTicketPayload {
  title: string;
  description: string;
  userId: string | unknown;
  priority?: TicketPriority;
}

export interface UpdateTicketPayload {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToId?: string | null;
}

async function fetchTickets(): Promise<Ticket[]> {
    const { data } = await Axios.get<Ticket[]>('/ticket');
    return data;
}

async function fetchTicket(id: string): Promise<Ticket> {
    const { data } = await Axios.get<Ticket>(`/ticket/${id}`);
  return data;
}

async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
    const { data } = await Axios.post<Ticket>('/ticket', payload);
  return data;
}

async function updateTicket(
  id: string,
  payload: UpdateTicketPayload,
): Promise<Ticket> {
    const { data } = await Axios.patch<Ticket>(`/ticket/${id}`, payload);
  return data;
}

export const TicketSevice = {
    fetchTickets, fetchTicket, updateTicket, createTicket
}