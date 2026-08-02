import axios from 'axios';

export interface Hostel {
  id: string;
  name: string;
  code: string;
  gender_type: 'boys' | 'girls' | 'coed';
  gender_type_display: string;
  address?: string;
  is_active: boolean;
}

export interface Block {
  id: string;
  hostel: string;
  hostel_name: string;
  name: string;
  code: string;
}

export interface Floor {
  id: string;
  block: string;
  block_name: string;
  floor_number: number;
}

export interface Room {
  id: string;
  floor: string;
  floor_number: number;
  block_name: string;
  hostel_name: string;
  room_number: string;
  room_type: 'single' | 'double' | 'triple' | 'dormitory';
  room_type_display: string;
  capacity: number;
  occupied_beds: number;
  status: 'available' | 'full' | 'maintenance' | 'inactive';
  status_display: string;
}

export interface Bed {
  id: string;
  room: string;
  room_number: string;
  bed_number: string;
  status: 'vacant' | 'allocated' | 'maintenance';
  status_display: string;
}

export interface HostelAllocation {
  id: string;
  student: string;
  student_id_str: string;
  student_name: string;
  bed: string;
  bed_number: string;
  room_number: string;
  academic_session: string;
  check_in_date?: string;
  check_out_date?: string;
  status: 'allocated' | 'checked_in' | 'checked_out' | 'transferred' | 'cancelled';
  status_display: string;
}

export interface Visitor {
  id: string;
  student: string;
  student_id_str: string;
  visitor_name: string;
  relation: string;
  mobile: string;
  visit_date: string;
  check_in_time: string;
  check_out_time?: string;
}

export interface MaintenanceRequest {
  id: string;
  room: string;
  room_number: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  status_display: string;
  assigned_to?: string;
  completed_date?: string;
}

const API_URL = '/api/hostel';

export const hostelService = {
  getHostels: async (): Promise<Hostel[]> => {
    const res = await axios.get(`${API_URL}/hostels/`);
    return res.data.results || res.data;
  },

  createHostel: async (payload: Partial<Hostel>): Promise<Hostel> => {
    const res = await axios.post(`${API_URL}/hostels/`, payload);
    return res.data;
  },

  getBlocks: async (): Promise<Block[]> => {
    const res = await axios.get(`${API_URL}/blocks/`);
    return res.data.results || res.data;
  },

  getRooms: async (): Promise<Room[]> => {
    const res = await axios.get(`${API_URL}/rooms/`);
    return res.data.results || res.data;
  },

  getBeds: async (): Promise<Bed[]> => {
    const res = await axios.get(`${API_URL}/beds/`);
    return res.data.results || res.data;
  },

  getAllocations: async (): Promise<HostelAllocation[]> => {
    const res = await axios.get(`${API_URL}/allocations/`);
    return res.data.results || res.data;
  },

  allocateBed: async (payload: {
    student_id: string;
    bed_id: string;
    academic_session_id: string;
    fee_amount?: number;
  }): Promise<HostelAllocation> => {
    const res = await axios.post(`${API_URL}/allocate/`, payload);
    return res.data;
  },

  transferRoom: async (payload: { allocation_id: string; new_bed_id: string }): Promise<HostelAllocation> => {
    const res = await axios.post(`${API_URL}/transfer/`, payload);
    return res.data;
  },

  checkIn: async (payload: { allocation_id: string; check_in_date?: string }): Promise<HostelAllocation> => {
    const res = await axios.post(`${API_URL}/check-in/`, payload);
    return res.data;
  },

  checkOut: async (payload: { allocation_id: string; check_out_date?: string }): Promise<HostelAllocation> => {
    const res = await axios.post(`${API_URL}/check-out/`, payload);
    return res.data;
  },

  getVisitors: async (): Promise<Visitor[]> => {
    const res = await axios.get(`${API_URL}/visitors/`);
    return res.data.results || res.data;
  },

  createVisitor: async (payload: Partial<Visitor>): Promise<Visitor> => {
    const res = await axios.post(`${API_URL}/visitors/`, payload);
    return res.data;
  },

  getMaintenanceRequests: async (): Promise<MaintenanceRequest[]> => {
    const res = await axios.get(`${API_URL}/maintenance/`);
    return res.data.results || res.data;
  },

  createMaintenanceRequest: async (payload: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> => {
    const res = await axios.post(`${API_URL}/maintenance/`, payload);
    return res.data;
  },

  getVacantRooms: async (): Promise<any[]> => {
    const res = await axios.get(`${API_URL}/vacant/`);
    return res.data;
  },

  getOccupiedRooms: async (): Promise<any[]> => {
    const res = await axios.get(`${API_URL}/occupied/`);
    return res.data;
  },
};

export default hostelService;
