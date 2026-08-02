# Enterprise User Profile & Identity Management Documentation

## 1. System Architecture & Base Identity Layer

The **User Profile & Identity System** (`apps/profiles`) provides the centralized common identity model for all users across the College ERP platform.

It is decoupled from student-, faculty-, or staff-specific business logic, acting as the foundational user profile that future specialized domain modules (e.g. Student Profiles, Staff Profiles, Alumni) extend via foreign keys or OneToOne relationships.

---

## 2. Data Models (`apps/profiles/models.py`)

### `UserProfile`
Primary identity record created automatically via post-save signals upon user registration:
- `id`: UUID Primary Key (`uuid.uuid4`)
- `user`: One-to-One link with `authentication.User`
- `code`: Employee/Student identification code placeholder
- `first_name`, `middle_name`, `last_name`, `display_name`
- `profile_photo`, `cover_photo`, `signature_image`: Avatar & identity media files
- `gender`, `date_of_birth`, `blood_group`, `nationality`
- `preferred_language` (default `"en"`), `time_zone` (default `"UTC"`)
- `biography`: Extended text overview
- `is_active`, `created_at`, `updated_at`

### `UserContact`
Contact channel information:
- `primary_email`, `secondary_email`
- `mobile_number`, `alternate_mobile`
- `emergency_contact_name`, `emergency_contact_number`

### `UserAddress`
Physical location address records:
- `address_type`: `current` or `permanent`
- `address_line1`, `address_line2`, `city`, `state`, `country`, `postal_code`, `latitude`, `longitude`

### `UserPreferences`
Custom UI/UX settings per user:
- `theme` (`dark`, `light`, `glassmorphic`)
- `dark_mode` (Boolean)
- `time_format` (`12h` vs `24h`), `date_format` (`YYYY-MM-DD`, `DD/MM/YYYY`)
- `notification_preferences`, `dashboard_layout` (JSON)

### `ProfileActivity`
Audit log tracking user identity activities:
- Activity Types: `profile_updated`, `photo_changed`, `password_changed`, `email_changed`, `login`, `logout`, `role_changed`

---

## 3. Profile Completion Formula (`services.py`)

Profile strength completion percentage (0-100%) evaluates presence of 9 core attributes:
1. First Name
2. Last Name
3. Profile Photo
4. Gender
5. Date of Birth
6. Blood Group
7. Nationality
8. Biography
9. Mobile Number

Returns a structured response indicating completion percentage and missing fields list.

---

## 4. Avatar Upload Strategy & File Validation

- Max File Size: **5 MB**
- Allowed MIME Types: `image/jpeg`, `image/png`, `image/webp`, `image/jpg`
- Storage: Stored under `/media/avatars/`, `/media/covers/`, `/media/signatures/` with S3/MinIO cloud compatibility.

---

## 5. REST API Reference

| Endpoint Path | Method | Description |
| :--- | :--- | :--- |
| `/api/profiles/me/` | `GET / PUT / PATCH` | View or update active user's profile |
| `/api/profiles/me/avatar/` | `POST / DELETE` | Upload/replace or remove profile photo |
| `/api/profiles/me/preferences/` | `GET / PUT / PATCH` | View or update theme & display preferences |
| `/api/profiles/me/timeline/` | `GET` | Activity audit trail for current profile |
| `/api/profiles/me/completion/` | `GET` | Profile completion percentage & missing fields |
| `/api/profiles/search/` | `GET` | Search profiles by name, email, phone, code |
