# Design System Migration Guide

**Version:** v0.21.0-design-system-final  
**Updated:** August 1, 2026

---

## 1. Migration Rules & Safety Directives

- **Do NOT break existing pages.**
- **Do NOT alter backend API contracts.**
- **Do NOT remove or alter business logic.**
- Replace custom button markup, custom inputs, inline status badges, inline spinners, custom modals, and inline table controls with Design System components incrementally.

---

## 2. Component Mapping Reference

| Legacy Pattern | Design System Replacement | Import Source |
|----------------|---------------------------|---------------|
| `<button className="bg-indigo-600...">` | `<PrimaryButton>` or `<Button variant="primary">` | `@/design-system` |
| `<button className="bg-red-600...">` | `<DangerButton>` or `<Button variant="danger">` | `@/design-system` |
| `<input type="text" className="...">` | `<TextInput>` | `@/design-system` |
| `<input type="password" className="...">` | `<PasswordInput>` | `@/design-system` |
| `<select className="...">` | `<Select>` or `<SearchableSelect>` | `@/design-system` |
| Custom status badges | `<StatusBadge variant="..." label="..." />` | `@/design-system` |
| Custom loading spinners | `<Spinner />` or `<SectionLoader />` | `@/design-system` |
| Custom modal overlay divs | `<Modal isOpen={...} onClose={...}>` | `@/design-system` |
| Custom delete confirmation | `<DeleteConfirmationDialog isOpen={...} onDelete={...} />` | `@/design-system` |
| Custom Toast state | `const { toast } = useToast(); toast.success(...)` | `@/design-system` |
| Custom HTML `<table>` | `<DataTable data={...} columns={...} keyExtractor={...} />` | `@/design-system` |

---

## 3. Quick Migration Example

### Before:
```tsx
const [showDelete, setShowDelete] = useState(false);

return (
  <div className="bg-slate-950 p-6">
    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold">
      Save Record
    </button>
    {showDelete && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-slate-900 p-6 rounded-2xl">
          <p>Delete item?</p>
          <button className="bg-red-600 text-white p-2 rounded">Delete</button>
        </div>
      </div>
    )}
  </div>
);
```

### After:
```tsx
import { PrimaryButton, DeleteConfirmationDialog, PageContainer } from "@/design-system";

const [showDelete, setShowDelete] = useState(false);

return (
  <PageContainer>
    <PrimaryButton onClick={() => handleSave()}>Save Record</PrimaryButton>
    <DeleteConfirmationDialog
      isOpen={showDelete}
      onClose={() => setShowDelete(false)}
      onDelete={handleDelete}
      itemName="Record"
    />
  </PageContainer>
);
```
