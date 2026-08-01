import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus } from "lucide-react";

interface HRDesignationItem {
  id: string;
  title: string;
  department_name: string;
  grade: string;
  hierarchy_level: number;
}

export const DesignationPage: React.FC = () => {
  const designations: HRDesignationItem[] = [
    { id: "1", title: "Dean / Senior Director", department_name: "Central Administration", grade: "Grade A+", hierarchy_level: 1 },
    { id: "2", title: "Professor", department_name: "Computer Science", grade: "Grade A", hierarchy_level: 2 },
    { id: "3", title: "Associate Professor", department_name: "Computer Science", grade: "Grade B+", hierarchy_level: 3 },
    { id: "4", title: "Assistant Professor", department_name: "Electrical Eng", grade: "Grade B", hierarchy_level: 4 },
  ];

  const columns: ColumnDef<HRDesignationItem>[] = [
    { key: "hierarchy_level", header: "Level", sortable: true },
    { key: "title", header: "Designation Title", sortable: true },
    { key: "department_name", header: "Department" },
    { key: "grade", header: "Grade Band" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Designation Hierarchy"
        subtitle="Manage academic & administrative job titles, grade bands & institutional seniority levels"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Designation
          </Button>
        }
      />

      <DataTable data={designations} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
