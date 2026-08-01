# Enterprise Feedback & Overlay System — Documentation

**Version:** v0.21.0-design-system-part4  
**Updated:** August 1, 2026  
**Module:** `frontend/src/design-system/components/feedback/`

---

## 1. Overview

The Enterprise Feedback & Overlay System provides accessible, theme-aware, animated modals, drawers, toasts, banners, progress indicators, loaders, and full-screen feedback state pages.

---

## 2. Component Inventory

### Modal System & Dialogs (`Modals.tsx`)
- `Modal` — Base modal with sizes (`xs`, `sm`, `md`, `lg`, `xl`, `fullscreen`), keyboard ESC close, backdrop overlay click, and Framer Motion spring transition.
- `ConfirmationModal` — Pre-styled confirm dialog (primary / danger / warning).
- `AlertModal` — Alert message dialog with OK action.
- `FullscreenModal` — Full-screen modal wrapper.
- `WizardModal` — Multi-step modal wrapper with step header and back/next buttons.
- `ImagePreviewModal` & `PDFPreviewModal` — Media preview dialogs with zoom & print.
- **Pre-configured Dialogs:**
  - `DeleteConfirmationDialog`
  - `ArchiveConfirmationDialog`
  - `RestoreConfirmationDialog`
  - `UnsavedChangesDialog`
  - `LogoutConfirmationDialog`
  - `SessionExpiredDialog`
  - `PermissionDialog`

### Drawer System (`Drawers.tsx`)
- `Drawer` — Base drawer with position support (`right`, `left`, `bottom`) and spring animations.
- `RightDrawer`, `LeftDrawer`, `BottomDrawer` — Position shorthand wrappers.
- `FilterDrawer` — Pre-built search filter panel with Apply / Reset actions.
- `DetailsDrawer` — Quick-view slide-in panel.

### Toast Notification System (`Toast.tsx`)
- `ToastProvider` — Context provider managing global notification queue.
- `useToast()` — Custom hook returning `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`, `toast.loading()`.
- Supports auto-dismiss, action buttons, progress bars, and top-right / bottom-right positioning.

### Notifications & Banners (`Notifications.tsx`)
- `InlineAlert` — Alert container for form headers or inline warnings.
- `Banner` — Top page banner bar with action buttons.
- `NotificationCard` — Read/unread alert item card for drawer lists.
- `EmptyNotification` — Empty inbox state container.

### Progress & Loaders (`ProgressLoaders.tsx`)
- `LinearProgress`, `UploadProgressBar`, `TaskProgress` — Horizontal progress bars with percentage text.
- `CircularProgress` — Circular percentage ring SVG indicator.
- `StepperProgress` — Multi-step wizard progress indicator.
- `Spinner`, `ButtonLoader`, `SectionLoader`, `PageLoader`, `OverlayLoader`, `SkeletonLoader` — Full suite of loaders.

### Feedback Screens (`FeedbackScreens.tsx`)
- `SuccessScreen`, `ErrorScreen`, `WarningScreen` — Full container status screens.
- `MaintenanceScreen` — System offline update state.
- `ComingSoonScreen` — Feature roadmap placeholder.
- `AccessRestrictedScreen` — RBAC 403 authorization guard screen.

---

## 3. Usage Example

```tsx
import { useToast, ConfirmationModal, InlineAlert, PageLoader } from "@/design-system";

export const ExampleWorkflow = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    toast.loading("Deleting record...");
    setTimeout(() => {
      toast.success("Record deleted successfully!");
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div>
      <InlineAlert variant="info" title="System Notice">
        Scheduled maintenance tomorrow at 02:00 UTC.
      </InlineAlert>

      <button onClick={() => setIsOpen(true)}>Delete Record</button>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this record?"
        variant="danger"
      />
    </div>
  );
};
```
