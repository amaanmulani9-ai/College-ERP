import React, { useState, useEffect } from "react";
import {
  PageContainer,
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
  ColumnDef,
} from "../../design-system";
import { FolderTree, Plus, Edit } from "lucide-react";

interface CategoryItem {
  id: string;
  category_code: string;
  category_name: string;
  useful_life_years: number;
  depreciation_method: string;
  description: string;
  status: string;
}

export const AssetCategoryPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: "1", category_code: "CAT-IT", category_name: "Computers & IT Hardware", useful_life_years: 3, depreciation_method: "Straight Line", description: "Laptops, Desktops, Servers, Workstations", status: "active" },
    { id: "2", category_code: "CAT-LAB", category_name: "Laboratory Equipment", useful_life_years: 7, depreciation_method: "Written Down Value", description: "Precision instruments, microscopes, CNC machines", status: "active" },
    { id: "3", category_code: "CAT-FURN", category_name: "Furniture & Fixtures", useful_life_years: 10, depreciation_method: "Straight Line", description: "Desks, chairs, whiteboards, podiums", status: "active" },
    { id: "4", category_code: "CAT-PROJ", category_name: "Projectors & Audio Visual", useful_life_years: 5, depreciation_method: "Straight Line", description: "Laser projectors, speakers, smartboards", status: "active" },
    { id: "5", category_code: "CAT-VEH", category_name: "Vehicles & Transport", useful_life_years: 8, depreciation_method: "Written Down Value", description: "College buses, utility vans, ambulances", status: "active" },
  ]);

  useEffect(() => {
    fetch("/api/assets/categories/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.results || data)) setCategories(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<CategoryItem>[] = [
    { key: "category_code", header: "Code", sortable: true },
    { key: "category_name", header: "Category Name", sortable: true },
    { key: "useful_life_years", header: "Useful Life (Years)" },
    { key: "depreciation_method", header: "Depreciation Method" },
    { key: "description", header: "Description" },
    {
      key: "status",
      header: "Status",
      accessor: (r) => (
        <StatusBadge
          label={r.status.toUpperCase()}
          variant={r.status === "active" ? "success" : "neutral"}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Asset Categories & Useful Life Defaults"
        subtitle="Manage category hierarchy, useful life terms, and depreciation defaults"
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            New Category
          </Button>
        }
      />

      <DataTable
        title="Asset Category Definitions"
        data={categories}
        columns={columns}
        keyExtractor={(r) => r.id}
        isLoading={loading}
      />
    </PageContainer>
  );
};
