import {
  InstitutionProfile,
  CampusItem,
  AcademicSession,
  DepartmentItem,
  ProgramItem,
  CourseItem,
  SemesterConfig,
  SectionItem,
  ClassroomItem,
  AcademicCalendarEvent,
  HolidayItem,
} from "./types";

export const MOCK_INSTITUTION_PROFILE: InstitutionProfile = {
  name: "National Institute of Technology & Science",
  shortName: "NITS",
  code: "INST-NITS-2026",
  accreditation: "NAAC A++ Grade (CGPA 3.82) | NIRF Rank #12",
  universityCode: "UNIV-CENTRAL-8890",
  email: "admin@nits.edu",
  phone: "+1 (800) 555-NITS",
  website: "https://nits.edu",
  address: "100 University Boulevard, Tech Park",
  city: "Innovation City",
  state: "California",
  country: "United States",
  postalCode: "94025",
  taxId: "TAX-99881122-US",
  timezone: "UTC-08:00 (PST)",
  currency: "USD ($)",
  language: "English (US)",
};

export const MOCK_CAMPUSES: CampusItem[] = [
  { id: "cmp-01", code: "CAMP-MAIN", name: "Main Central Campus", city: "Innovation City", buildingsCount: 14, capacity: 12000, status: "active" },
  { id: "cmp-02", code: "CAMP-TECH", name: "City Tech Research Park", city: "Downtown Metro", buildingsCount: 6, capacity: 4500, status: "active" },
  { id: "cmp-03", code: "CAMP-MED", name: "Medical & Allied Health Wing", city: "Health City", buildingsCount: 8, capacity: 3000, status: "active" },
];

export const MOCK_ACADEMIC_SESSIONS: AcademicSession[] = [
  { id: "sess-2026", name: "Academic Year 2026-2027", startDate: "2026-08-01", endDate: "2027-06-30", status: "current" },
  { id: "sess-2025", name: "Academic Year 2025-2026", startDate: "2025-08-01", endDate: "2026-06-30", status: "past" },
  { id: "sess-2027", name: "Academic Year 2027-2028", startDate: "2027-08-01", endDate: "2028-06-30", status: "upcoming" },
];

export const MOCK_DEPARTMENTS: DepartmentItem[] = [
  { id: "dept-cs", code: "CS", name: "Computer Science & AI", hodName: "Dr. Robert Vance", facultyCount: 42, studentCount: 1240, status: "active" },
  { id: "dept-ee", code: "EE", name: "Electrical & Electronics", hodName: "Dr. Elena Rostova", facultyCount: 36, studentCount: 980, status: "active" },
  { id: "dept-me", code: "ME", name: "Mechanical & Automation", hodName: "Dr. James Miller", facultyCount: 30, studentCount: 850, status: "active" },
  { id: "dept-ce", code: "CE", name: "Civil & Infrastructure", hodName: "Dr. Sarah Jenkins", facultyCount: 24, studentCount: 620, status: "active" },
  { id: "dept-mba", code: "MBA", name: "Management & Business Administration", hodName: "Dr. Michael Chang", facultyCount: 28, studentCount: 750, status: "active" },
];

export const MOCK_PROGRAMS: ProgramItem[] = [
  { id: "prog-btech", code: "BTECH-CS", name: "B.Tech Computer Science & AI", level: "UG", durationYears: 4, totalCredits: 160, eligibility: "High School (Math & Physics) min 75%" },
  { id: "prog-mtech", code: "MTECH-AI", name: "M.Tech Artificial Intelligence", level: "PG", durationYears: 2, totalCredits: 80, eligibility: "B.Tech CS / IT min 65%" },
  { id: "prog-mba", code: "MBA-FIN", name: "MBA Finance & Analytics", level: "PG", durationYears: 2, totalCredits: 90, eligibility: "Bachelor Degree min 60%" },
  { id: "prog-phd", code: "PHD-CS", name: "Ph.D. Computer Science Research", level: "PhD", durationYears: 3, totalCredits: 48, eligibility: "Master Degree with Research Proposal" },
];

export const MOCK_COURSES: CourseItem[] = [
  { id: "crs-cs101", code: "CS-101", name: "Data Structures & Algorithms", credits: 4, theoryLabSplit: "3 Hours Theory + 2 Hours Lab", type: "Core", department: "Computer Science & AI" },
  { id: "crs-ai201", code: "AI-201", name: "Machine Learning & Neural Nets", credits: 4, theoryLabSplit: "3 Hours Theory + 2 Hours Lab", type: "Core", department: "Computer Science & AI" },
  { id: "crs-ee301", code: "EE-301", name: "Embedded Systems & IoT", credits: 3, theoryLabSplit: "2 Hours Theory + 2 Hours Lab", type: "Elective", department: "Electrical & Electronics" },
];

export const MOCK_SEMESTER_CONFIGS: SemesterConfig[] = [
  { id: "sem-1", type: "Odd", number: 1, registrationWindow: "Aug 01 - Aug 10", examWindow: "Nov 15 - Nov 30", resultWindow: "Dec 15" },
  { id: "sem-2", type: "Even", number: 2, registrationWindow: "Jan 05 - Jan 15", examWindow: "Apr 20 - May 10", resultWindow: "May 25" },
];

export const MOCK_SECTIONS: SectionItem[] = [
  { id: "sec-a", name: "Section A", program: "B.Tech Computer Science", semester: 3, capacity: 60, classTeacher: "Prof. Alan Turing", roomNo: "L-101" },
  { id: "sec-b", name: "Section B", program: "B.Tech Computer Science", semester: 3, capacity: 60, classTeacher: "Prof. Grace Hopper", roomNo: "L-102" },
];

export const MOCK_CLASSROOMS: ClassroomItem[] = [
  { id: "rm-101", roomNo: "L-101", building: "Main Academic Block A", type: "Lecture Hall", capacity: 80, hasAVEquipment: true },
  { id: "rm-lab1", roomNo: "Lab-302", building: "Tech Innovation Hub", type: "Smart Lab", capacity: 40, hasAVEquipment: true },
  { id: "rm-aud", roomNo: "Aud-Main", building: "Central Auditorium", type: "Auditorium", capacity: 1200, hasAVEquipment: true },
];

export const MOCK_CALENDAR_EVENTS: AcademicCalendarEvent[] = [
  { id: "evt-01", title: "Autumn Admissions Counseling Phase 1", category: "Admissions", startDate: "2026-08-05", endDate: "2026-08-15" },
  { id: "evt-02", title: "Mid-Term Examinations Odd Semester", category: "Exams", startDate: "2026-10-12", endDate: "2026-10-22" },
  { id: "evt-03", title: "Annual Convocation 2026", category: "Convocation", startDate: "2026-11-20", endDate: "2026-11-20" },
];

export const MOCK_HOLIDAYS: HolidayItem[] = [
  { id: "hol-01", title: "Independence Day", type: "National", date: "2026-08-15", isRecurring: true },
  { id: "hol-02", title: "Labor Day", type: "National", date: "2026-09-07", isRecurring: true },
  { id: "hol-03", title: "Autumn Recess", type: "Academic", date: "2026-10-24", isRecurring: false },
];
