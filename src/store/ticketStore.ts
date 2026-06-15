import { create } from 'zustand';
import type { Ticket, TicketFilters, PaginatedResponse } from '@/types';

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  filters: TicketFilters;

  // Actions
  setTickets: (tickets: Ticket[]) => void;
  setCurrentTicket: (ticket: Ticket | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: TicketFilters) => void;
  setPagination: (pagination: any) => void;
  
  fetchTickets: (filters?: TicketFilters, page?: number) => Promise<void>;
  fetchTicket: (id: string) => Promise<void>;
  createTicket: (data: any) => Promise<Ticket>;
  updateTicket: (id: string, data: any) => Promise<Ticket>;
  deleteTicket: (id: string) => Promise<void>;
  searchTickets: (query: string) => Promise<void>;
  addMessage: (ticketId: string, message: string) => Promise<void>;
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  currentTicket: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
  },
  filters: {},

  setTickets: (tickets) => set({ tickets }),
  setCurrentTicket: (ticket) => set({ currentTicket: ticket }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  setPagination: (pagination) => set({ pagination }),

  fetchTickets: async (filters?, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tickets', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch tickets');

      const data: PaginatedResponse<Ticket> = await response.json();
      set({
        tickets: data.items,
        pagination: {
          page: data.page,
          pageSize: data.page_size,
          total: data.total,
        },
        isLoading: false,
      });

      if (filters) {
        set({ filters });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tickets';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchTicket: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tickets/${id}`);

      if (!response.ok) throw new Error('Failed to fetch ticket');

      const ticket: Ticket = await response.json();
      set({ currentTicket: ticket, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch ticket';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createTicket: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create ticket');

      const ticket: Ticket = await response.json();
      const { tickets } = get();
      set({
        tickets: [ticket, ...tickets],
        isLoading: false,
      });
      return ticket;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create ticket';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateTicket: async (id: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update ticket');

      const ticket: Ticket = await response.json();
      const { tickets, currentTicket } = get();

      set({
        tickets: tickets.map((t) => (t.id === id ? ticket : t)),
        currentTicket: currentTicket?.id === id ? ticket : currentTicket,
        isLoading: false,
      });
      return ticket;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update ticket';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteTicket: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete ticket');

      const { tickets } = get();
      set({
        tickets: tickets.filter((t) => t.id !== id),
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete ticket';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  searchTickets: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tickets/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) throw new Error('Failed to search tickets');

      const data = await response.json();
      set({ tickets: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      set({ error: errorMessage, isLoading: false });
    }
  },

  addMessage: async (ticketId: string, message: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) throw new Error('Failed to add message');

      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add message';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
}));
