# WuhaLink - Developer Setup & AI Instructions

Welcome to **WuhaLink** 🇪🇹 – a web-based water-delivery listing platform connecting residents with water truck suppliers in Addis Ababa.

This document serves as the source of truth for AI agents (Antigravity, Cursor, etc.) and human developers collaborating on the codebase. **AI agents must read, parse, and strictly adhere to the rules and roadmap outlined here.**

---

## 1. Tech Stack Overview

- **Frontend Core:** React 18 (Vite 6, SPA, JavaScript)
- **Styling:** Tailwind CSS 3 (along with `tailwindcss-animate`, `class-variance-authority`, `tailwind-merge`, and `clsx` for dynamic classes)
- **Routing:** React Router DOM v6
- **Data Fetching & Caching:** TanStack Query v5 (`@tanstack/react-query`)
- **Backend & Database:** Base44 SDK (`@base44/sdk`) mapping custom entity schemas
- **Bilingual System (i18n):** Custom translation dictionary for English (`en`) and Amharic (`am`)
- **Icons:** `lucide-react`

---

## 2. Directory Structure

Ensure any new files or modifications follow this folder taxonomy:

```text
wuhalink/
├── entities/                # Base44 Backend Schema definitions (JSON)
│   ├── CallLog              # Schema for tracking contact clicks (calls/WhatsApp)
│   ├── Driver               # Schema for driver details (name, capacity, area, etc.)
│   └── Review               # Schema for driver ratings and feedback
├── src/
│   ├── api/
│   │   └── base44Client.js  # Base44 SDK client instance setup
│   ├── components/
│   │   ├── admin/           # Admin-only dashboard widgets and components
│   │   ├── drivers/         # Driver listing components, filters, and cards
│   │   ├── landing/         # Marketing/Hero sections for the landing page
│   │   ├── layout/          # Navigation, layouts, and wrappers
│   │   ├── shared/          # Reusable shared components (i18n switcher, rating, logo)
│   │   └── ui/              # Complete set of Radix UI + Shadcn component primitives
│   ├── hooks/               # Custom hooks (e.g., use-mobile.jsx)
│   ├── lib/
│   │   ├── app-params.js    # Base44 query/localstorage parameter parsing
│   │   ├── AuthContext.jsx  # Authentication provider & useAuth hook
│   │   ├── i18n.js          # Bilingual dictionary & translation helper
│   │   ├── LanguageContext.jsx # Language state context
│   │   ├── query-client.js  # TanStack query client instance
│   │   └── utils.js         # Tailwind class merging utility
│   ├── pages/               # Top-level route pages (Landing, FindWater, DriverPanel, AdminDashboard)
│   ├── App.jsx              # Routing and Provider layout configuration
│   ├── main.jsx             # React DOM entrypoint
│   └── index.css            # Tailwind directives and custom theme variables
├── jsconfig.json            # Import path mappings (e.g., @/* -> src/*)
├── package.json             # Core dependency management
└── tailwind.config.js       # Custom animations, colors, and design tokens
```

---

## 3. Mandatory AI Development Rules

AI agents collaborating on this project **must** conform to the following strict conventions:

### A. Path Aliasing & Imports
- **DO NOT** use relative paths with multiple directories backtracking (e.g., `../../components/ui/button`).
- **DO** use the absolute alias `@/` pointing directly to the `src/` folder.
  - *Example:* `import { Button } from "@/components/ui/button";`
  - *Example:* `import { base44 } from "@/api/base44Client";`

### B. Internationalization (i18n) & Localization
- WuhaLink is bilingual (English `en` and Amharic `am`).
- **NEVER** hardcode user-visible strings inside your components.
- Always add strings to the dictionary located in [src/lib/i18n.js](file:///c:/Users/kirub/OneDrive/Desktop/Me/wuhalink/src/lib/i18n.js).
- Import and use the `t` translation function:
  ```javascript
  import { t } from "@/lib/i18n";
  import { useLanguage } from "@/lib/LanguageContext";

  // Inside your component:
  const { lang } = useLanguage();
  return <h1>{t(lang, "heroTitle")}</h1>;
  ```
- If a child component needs the language state, pass the `lang` variable down as a prop or consume `useLanguage()`.

### C. Shadcn/Radix UI Primitives
- A complete library of Radix/Shadcn primitives is pre-configured inside [src/components/ui/](file:///c:/Users/kirub/OneDrive/Desktop/Me/wuhalink/src/components/ui/).
- **DO NOT** create custom styles for standard buttons, inputs, dialogs, checkboxes, tabs, or select elements. Always leverage the pre-built items inside the `ui` directory.
- Utilize the `cn()` utility from `@/lib/utils` when merging tailwind classes or overriding defaults on UI primitives.

### D. Data Fetching & Querying
- Use **TanStack Query** (`useQuery` and `useMutation`) for interacting with the backend.
- Do not instantiate separate Axios/Fetch clients for entities; query directly using the configured `base44` SDK client:
  ```javascript
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import { base44 } from "@/api/base44Client";

  // Querying multiple entities:
  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => base44.entities.Driver.filter({ is_approved: true }),
  });

  // Mutating an entity:
  const queryClient = useQueryClient();
  const updateDriver = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Driver.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    }
  });
  ```

### E. Backend Architecture & RLS
- Backend tables and RLS (Row Level Security) rules are defined by the JSON files inside the root `entities/` folder.
- Inspect [entities/Driver](file:///c:/Users/kirub/OneDrive/Desktop/Me/wuhalink/entities/Driver), [entities/CallLog](file:///c:/Users/kirub/OneDrive/Desktop/Me/wuhalink/entities/CallLog), and [entities/Review](file:///c:/Users/kirub/OneDrive/Desktop/Me/wuhalink/entities/Review) to verify column structures and constraints.
- The `base44` client is initialized with `requiresAuth: false` in [src/api/base44Client.js](file:///c:/Users/kirub/OneDrive/Desktop/Me/wuhalink/src/api/base44Client.js). This allows public users to browse list data (e.g., driver directories) without authentication. However, secure mutations require the user token parsed in `AuthContext`.

---

## 5. Migration Roadmap: Moving from Base44 to Supabase

To scale and fully customize administrative workflows, the primary roadmap involves migrating the backend from **Base44** to **Supabase**. AI agents must support this transition process while preserving the application's clean design, high responsiveness, and simplicity.

### Step 1: Database Schema Mapping (PostgreSQL / Supabase)
We will replicate the Base44 entity definitions as Supabase PostgreSQL tables:
- **`drivers` table:**
  - `id`: uuid (Primary Key, default `gen_random_uuid()`)
  - `created_at`: timestamptz (default `now()`)
  - `name`: text (required)
  - `phone`: text (required)
  - `whatsapp`: text
  - `truck_size`: numeric (required)
  - `price`: numeric (required)
  - `status`: text (enum check: `'available'`, `'busy'`, default `'available'`)
  - `rating`: numeric (default `0`)
  - `total_reviews`: numeric (default `0`)
  - `delivery_time`: text (default `'30 min'`)
  - `photo_url`: text
  - `is_verified`: boolean (default `false`)
  - `is_featured`: boolean (default `false`)
  - `is_approved`: boolean (default `false`)
  - `subscription_status`: text (enum check: `'active'`, `'expired'`, `'unpaid'`, default `'unpaid'`)
  - `subscription_expiry`: date
  - `total_calls`: integer (default `0`)
  - `total_whatsapp`: integer (default `0`)
  - `area`: text
  - `user_email`: text
- **`call_logs` table:**
  - `id`: uuid (Primary Key)
  - `created_at`: timestamptz (default `now()`)
  - `driver_id`: uuid (Foreign Key pointing to `drivers.id`, cascade delete)
  - `type`: text (enum check: `'call'`, `'whatsapp'`)
  - `user_email`: text
- **`reviews` table:**
  - `id`: uuid (Primary Key)
  - `created_at`: timestamptz (default `now()`)
  - `driver_id`: uuid (Foreign Key pointing to `drivers.id`, cascade delete)
  - `rating`: numeric (check range 1 to 5)
  - `comment`: text
  - `reviewer_name`: text
  - `created_by`: text (user email)

### Step 2: Row Level Security (RLS) Policies on Supabase
- **`drivers` table policies:**
  - **Read:** Public access allowed if `is_approved = true` OR if the authenticated user's email matches `user_email` OR if the authenticated user has the `'admin'` metadata role.
  - **Write/Update:** Restricted to users where the authenticated email matches `user_email` OR if the authenticated user is an `'admin'`.
  - **Delete/Create:** Restricted to users with the `'admin'` role.
- **`call_logs` & `reviews` policies:**
  - **Create:** Open to public / authenticated users.
  - **Read/Update/Delete:** Restricted to users with the `'admin'` role, or the creator for their own review records.

### Step 3: Client & Auth Transition
1. Install the Supabase Javascript Client library:
   ```bash
   npm install @supabase/supabase-js
   ```
2. Setup the Supabase client file at `src/api/supabaseClient.js`:
   ```javascript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```
3. Update `AuthContext.jsx` to map user session retrieval and credentials checking from `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange()`. Set metadata roles (e.g., checking user app metadata or checking a custom `profiles` table to see if user is `'admin'`).
4. Replace queries in `TanStack Query` hooks to fetch from the Supabase client:
   - *Query before:* `base44.entities.Driver.filter({ is_approved: true })`
   - *Query after:* `supabase.from('drivers').select('*').eq('is_approved', true)`

---

## 6. Expanded Admin & Management Dashboard

As part of the roadmap, we are building a dedicated management experience for our team:
- **Private Admin Dashboard:** Expand `src/pages/AdminDashboard.jsx` to manage approval processes, update driver metrics, flag unpaid subscriptions, toggle verifications, and view global performance stats (charts tracking calls/WhatsApp interactions using `recharts`).
- **Simplicity & UI Retention:** All administrative features must keep the existing design system. Avoid adding crowded panels. Use clean status badges, quick-action action sheets (`vaul` drawer or dynamic modals), and rich micro-interactions.

---

## 7. Local Setup & Environment

To run the project locally, developers (and AI agents running terminal commands) must follow these steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Setup environment variables:**
   Create a `.env.local` file at the root of the project:
   ```env
   # Existing Base44 Params
   VITE_BASE44_APP_ID=your_actual_app_id
   VITE_BASE44_APP_BASE_URL=your_actual_app_base_url
   
   # Upcoming Supabase Params (fill when starting migration)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *(Note: These values are stored securely and must never be committed to git).*
3. **Start the local Vite dev server:**
   ```bash
   npm run dev
   ```
4. **Compile/Build verification:**
   Verify that everything compiles correctly before submitting changes:
   ```bash
   npm run build
   ```

---

## 8. Git & Collaboration Etiquette

- **Branching:** Work on small feature branches naming them descriptive of the task, e.g., `feature/translation-fixes` or `bugfix/driver-card-avatar`.
- **Committing:** Use conventional commits format, e.g., `feat: add star rating overlay`, `fix: auth context redirection issue`.
- **Review:** Run `npm run lint` before committing to ensure there are no formatting or linting errors.
