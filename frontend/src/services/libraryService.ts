import axios from 'axios';

export interface BookCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
}

export interface Author {
  id: string;
  name: string;
  biography?: string;
}

export interface Publisher {
  id: string;
  name: string;
  address?: string;
}

export interface Book {
  id: string;
  isbn: string;
  barcode: string;
  title: string;
  author: string;
  author_name: string;
  publisher?: string;
  publisher_name?: string;
  category: string;
  category_name: string;
  edition: string;
  language: string;
  copies: number;
  available_copies: number;
  shelf_number?: string;
  status: 'available' | 'borrowed' | 'reserved' | 'lost' | 'damaged' | 'maintenance';
  status_display: string;
}

export interface BookIssue {
  id: string;
  book: string;
  book_title: string;
  book_isbn: string;
  student?: string;
  student_id_str?: string;
  staff?: string;
  staff_employee_id?: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  fine_amount: number;
  status: 'issued' | 'returned' | 'overdue' | 'lost' | 'damaged';
  status_display: string;
  remarks?: string;
}

export interface Reservation {
  id: string;
  book: string;
  book_title: string;
  student?: string;
  staff?: string;
  reserved_date: string;
  status: 'pending' | 'fulfilled' | 'cancelled' | 'expired';
  status_display: string;
}

const API_URL = '/api/library';

export const libraryService = {
  getCategories: async (): Promise<BookCategory[]> => {
    const res = await axios.get(`${API_URL}/categories/`);
    return res.data.results || res.data;
  },

  createCategory: async (payload: Partial<BookCategory>): Promise<BookCategory> => {
    const res = await axios.post(`${API_URL}/categories/`, payload);
    return res.data;
  },

  getAuthors: async (): Promise<Author[]> => {
    const res = await axios.get(`${API_URL}/authors/`);
    return res.data.results || res.data;
  },

  createAuthor: async (payload: Partial<Author>): Promise<Author> => {
    const res = await axios.post(`${API_URL}/authors/`, payload);
    return res.data;
  },

  getPublishers: async (): Promise<Publisher[]> => {
    const res = await axios.get(`${API_URL}/publishers/`);
    return res.data.results || res.data;
  },

  createPublisher: async (payload: Partial<Publisher>): Promise<Publisher> => {
    const res = await axios.post(`${API_URL}/publishers/`, payload);
    return res.data;
  },

  getBooks: async (): Promise<Book[]> => {
    const res = await axios.get(`${API_URL}/books/`);
    return res.data.results || res.data;
  },

  createBook: async (payload: Partial<Book>): Promise<Book> => {
    const res = await axios.post(`${API_URL}/books/`, payload);
    return res.data;
  },

  issueBook: async (payload: {
    book_id: string;
    student_id?: string;
    staff_id?: string;
    issue_days?: number;
    remarks?: string;
  }): Promise<BookIssue> => {
    const res = await axios.post(`${API_URL}/issue/`, payload);
    return res.data;
  },

  returnBook: async (payload: { issue_id: string; remarks?: string }): Promise<BookIssue> => {
    const res = await axios.post(`${API_URL}/return/`, payload);
    return res.data;
  },

  getIssues: async (): Promise<BookIssue[]> => {
    const res = await axios.get(`${API_URL}/issues/`);
    return res.data.results || res.data;
  },

  getFinesReport: async (): Promise<BookIssue[]> => {
    const res = await axios.get(`${API_URL}/fines/`);
    return res.data;
  },

  reserveBook: async (payload: { book_id: string; student_id?: string; staff_id?: string }): Promise<Reservation> => {
    const res = await axios.post(`${API_URL}/reserve/`, payload);
    return res.data;
  },

  getReservations: async (): Promise<Reservation[]> => {
    const res = await axios.get(`${API_URL}/reservations/`);
    return res.data.results || res.data;
  },
};

export default libraryService;
