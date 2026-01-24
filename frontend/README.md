# Hire XO Job Portal - Frontend

A professional mobile-first frontend for the Hire XO job portal, built with Vite React, Tailwind CSS, and shadcn UI.

## 🚀 Tech Stack

- **Framework:** Vite React (TypeScript)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn UI
- **Icons:** Lucide React
- **State Management:** Zustand
- **Routing:** React Router v7
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint + Prettier

## 📂 Project Structure

The project follows a modular architecture under `src/modules/`:

```
src/
├── components/          # Shared atomic components (UI)
├── layouts/             # Shared layouts (JobSeekerLayout, etc.)
├── lib/                 # Shared utilities
├── store/               # Zustand stores
├── types/               # TypeScript interfaces
├── modules/             # Role-specific modules
│   ├── job-seeker/      # Job Seeker module
│   │   ├── components/  # Module-specific components
│   │   ├── pages/       # Module pages
│   │   ├── hooks/       # Module-specific hooks
│   │   └── services/    # Module-specific API services
│   ├── recruiter/       # Recruiter module (placeholder)
│   ├── admin/           # Admin module (placeholder)
│   └── resources/       # Resources module (placeholder)
└── test/                # Test configuration and unit tests
```

## ✨ Key Features (Job Seeker)

- **Job Browsing:** Search and filter jobs by type (Full-time, Contract, etc.).
- **Subscription Plans:** Three-tier plan system (15-day, 1-week, Same-day) with active state tracking.
- **Certificate System:**
  - Automated certificate generation upon 50% interview success rate.
  - Exactly 6 months validity period.
  - Active/Expired status tracking.

## 🛠️ Development

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm test

# Build for production
npm run build
```

### Architecture Decisions

- **Modular Design:** Role-specific logic is encapsulated in `src/modules/` to ensure scalability and maintainability.
- **Atomic UI:** Shared UI components are stored in `src/components/ui` following atomic design principles.
- **State Management:** Zustand is used for its simplicity and performance in handling global state.
- **Tailwind v4:** Leveraging the latest Tailwind CSS features for styling.

### API Integration Guidelines

- All API calls should be placed in the `services/` folder within each module.
- Use the `useJobSeekerStore` to manage data fetched from APIs.
- Implement loading and error states for all asynchronous operations.
