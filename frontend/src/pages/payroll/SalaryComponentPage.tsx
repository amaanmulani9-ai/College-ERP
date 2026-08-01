import React from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { Plus } from "lucide-react";

interface ComponentItem {
  id: string;
  component_name: string;
  component_type: "earning" | "deduction";
  taxable: boolean;
  formula: string;
  display_order: number;
}

export const SalaryComponentPage: React.FC = () => {
  const components: ComponentItem[] = [
    { id: "1", component_name: "Basic Salary", component_type: "earning", taxable: true, formula: "FIXED", display_order: 1 },
    { id: "2", component_name: "House Rent Allowance (HRA)", component_type: "earning", taxable: true, formula: "BASIC * 0.40", display_order: 2 },
    { id: "3", component_name: "Dearness Allowance (DA)", component_type: "earning", taxable: true, formula: "BASIC * 0.10", display_order: 3 },
    { id: "4", component_name: "Provident Fund (PF)", component_type: "deduction", taxable: false, formula: "BASIC * 0.12", display_order: 4 },
    { id: "5", component_name: "Professional Tax (PT)", component_type: "deduction", taxable: false, formula: "SLAB_BASED", display_order: 5 },
  ];

  const columns: ColumnDef<ComponentItem>[] = [
    { key: "display_order", header: "Order", sortable: true },
    { key: "component_name", header: "Component Name", sortable: true },
    {
      key: "component_type",
      header: "Category",
      accessor: (r) => (
        <StatusBadge
          label={r.component_type.toUpperCase()}
          variant={r.component_type === "earning" ? "success" : "danger"}
        />
      ),
    },
    {
      key: "taxable",
      header: "Tax Treatment",
      accessor: (r) => (
        <StatusBadge
          label={r.taxable ? "TAXABLE" : "EXEMPT"}
          variant={r.taxable ? "warning" : "neutral"}
        />
      ),
    },
    { key: "formula", header: "Calculation Formula" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Salary Components Library"
        subtitle="Define recurring earning components, statutory deductions & calculation formulas"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Component
          </Button>
        }
      />

      <DataTable data={components} columns={columns} keyExtractor={(r) => r.id} />
    </PageContainer>
  );
};
