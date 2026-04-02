# Project Constitution: LegalPath

## Data Schemas

### Profiles (`profiles`)
- `id`: uuid
- `full_name`: string
- `email`: string (unique)
- `role`: enum ('user', 'lawyer')
- `rut`: string (optional, verified)
- `specialties`: array of strings (lawyers only)
- `academic_background`: jsonb (lawyers only)
- `status`: enum ('pending', 'active', 'suspended')

### Cases (`cases`)
- `id`: uuid
- `user_id`: uuid (references profiles)
- `description`: text
- `status`: enum ('published', 'draft', 'resolved', 'closed')
- `area`: string (auto-detected/manual)
- `created_at`: timestamp

### Proposals (`proposals`)
- `id`: uuid
- `lawyer_id`: uuid (references profiles)
- `case_id`: uuid (references cases)
- `message`: text
- `budget_range`: string
- `status`: enum ('sent', 'accepted', 'rejected')

## Behavioral Rules
- **Privacy First:** User identity is ALWAYS anonymous until they choose a lawyer.
- **Verification Loop:** All lawyers must be verified against CJUD/Supreme Court data within 24 hours.
- **Branding Sync:**
  - User Flow: Mint (#1ECCA7)
  - Lawyer Flow: Orange (#EE6C4D)
- **Deterministic Logic:** Use Supabase for data integrity and RLS for security.

## Architectural Invariants
- **React 19:** Functional components only.
- **Vite:** Build tool for fast dev experience.
- **Tailwind v4:** Standard for styling.
- **A.N.T. Protocol:** Separate Architecture, Navigation, and Tools.
