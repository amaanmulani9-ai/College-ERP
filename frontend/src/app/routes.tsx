export type AppRoute = {
  path: string;
  label: string;
  status: "reserved";
};

export const routes: AppRoute[] = [
  { path: "/admin", label: "Admin", status: "reserved" },
  { path: "/teacher", label: "Teacher", status: "reserved" },
  { path: "/student", label: "Student", status: "reserved" },
  { path: "/parent", label: "Parent", status: "reserved" },
];
