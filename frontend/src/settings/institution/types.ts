export interface InstitutionProfile {
  name: string;
  shortName: string;
  code: string;
  accreditation: string;
  universityCode: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  taxId: string;
  timezone: string;
  currency: string;
  language: string;
}

export interface CampusItem {
  id: string;
  code: string;
  name: string;
  city: string;
  buildingsCount: number;
  capacity: number;
  status: "active" | "inactive";
}

export interface AcademicSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "current" | "upcoming" | "past" | "archived";
}

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  hodName: string;
  facultyCount: number;
  studentCount: number;
  status: "active" | "inactive";
}

export interface ProgramItem {
  id: string;
  code: string;
  name: string;
  level: "UG" | "PG" | "Diploma" | "Certificate" | "PhD";
  durationYears: number;
  totalCredits: number;
  eligibility: string;
}

export interface CourseItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  theoryLabSplit: string;
  type: "Core" | "Elective" | "Lab" | "Seminar";
  department: string;
}

export interface SemesterConfig {
  id: string;
  type: "Odd" | "Even";
  number: number;
  registrationWindow: string;
  examWindow: string;
  resultWindow: string;
}

export interface SectionItem {
  id: string;
  name: string; // A, B, C
  program: string;
  semester: number;
  capacity: number;
  classTeacher: string;
  roomNo: string;
}

export interface ClassroomItem {
  id: string;
  roomNo: string;
  building: string;
  type: "Lecture Hall" | "Smart Lab" | "Seminar Room" | "Auditorium";
  capacity: number;
  hasAVEquipment: boolean;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  category: "Admissions" | "Exams" | "Holidays" | "Convocation" | "Orientation";
  startDate: string;
  endDate: string;
}

export interface HolidayItem {
  id: string;
  title: string;
  type: "National" | "State" | "Institution" | "Academic" | "Emergency";
  date: string;
  isRecurring: boolean;
}
