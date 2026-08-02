# Enterprise Form Components — Documentation

**Version:** v0.21.0-design-system-part2  
**Updated:** August 1, 2026  
**Module:** `frontend/src/design-system/components/forms/`

---

## 1. Overview

The Enterprise Form Library provides accessible, React Hook Form and Zod compatible, dark/light theme aware inputs, selection controls, pickers, uploaders, and rich controls.

---

## 2. Component Inventory

### Input Components (`Inputs.tsx`)
- `TextInput` — Standard text input with prefix/suffix icons, copy button, clearable, loading spinner
- `EmailInput` — Pre-configured with mail icon and validation
- `PasswordInput` — Pre-configured with lock icon and show/hide toggle button
- `NumberInput` — Numeric step, min, max controls
- `PhoneInput` — Phone number formatting input with phone icon
- `SearchInput` — Search input with search icon and instant clear button
- `URLInput` — Web address input with globe icon
- `CurrencyInput` — Amount input with currency symbol (default ₹)
- `OTPInput` — 6-digit verification code with auto-focus movement
- `Textarea` — Multi-line text field with character count

### Selection Components (`Selects.tsx`)
- `Select` — Standard HTML dropdown with dark styling
- `SearchableSelect` / `Autocomplete` / `Combobox` — Filterable dropdown with instant search input
- `MultiSelect` — Multi-item tag selection box with removable badges

### Checkbox & Radio (`CheckboxesRadios.tsx`)
- `Checkbox` — Custom animated check icon with label
- `CheckboxGroup` — Multi-select group
- `Radio` & `RadioGroup` — Radio option set (vertical/horizontal)
- `Switch` — Smooth animated toggle switch
- `ToggleGroup` — Segmented pill control

### Date & Academic Pickers (`DatePickers.tsx`)
- `DatePicker` — Date picker
- `TimePicker` — Time picker
- `DateTimePicker` — Date + time picker
- `DateRangePicker` — Start to End date range pair
- `AcademicYearPicker` — ERP Session dropdown (e.g. AY 2026-2027)
- `SemesterPicker` — Semester selector (Semester I - VIII)

### Upload Components (`Uploads.tsx`)
- `FileUpload` / `DragDropUpload` / `DocumentUpload` — Drag and drop area with size limits and file lists
- `ImageUpload` / `AvatarUpload` — Image uploader with live thumbnail preview
- `UploadProgress` — Animated progress bar with percentage and status states

### Rich Inputs (`RichInputs.tsx`)
- `TagInput` / `ChipInput` — Enter-separated tag input
- `ColorPicker` — Native color input + hex display
- `Rating` — Interactive star rating selector
- `Slider` — Range slider with live value badge
- `RichTextEditor` — Formatted text editor wrapper with toolbar

---

## 3. Integration & Validation Guide

All form controls use `forwardRef` and work out of the box with **React Hook Form** and **Zod**:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput, EmailInput, PasswordInput, Button } from "@/design-system";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

export const RegistrationForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(console.log)} className="space-y-4">
      <TextInput label="Full Name" {...register("name")} error={errors.name?.message} />
      <EmailInput label="Email" {...register("email")} error={errors.email?.message} />
      <PasswordInput label="Password" {...register("password")} error={errors.password?.message} />
      <Button type="submit">Register</Button>
    </form>
  );
};
```
