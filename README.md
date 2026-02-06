# HireXO Job Portal

A modern, mobile-first job portal application built with React, TypeScript, and Tailwind CSS. Features separate interfaces for job seekers and recruiters with a comprehensive resources section.

## 🚀 Features

### Job Seeker Features
- **Job Browsing**: Search and filter jobs by category
- **Resources Section**: Access 6 specialized categories (Tenders, Logistics, Equipments, Vehicles, PMC, CSM)
- **Subscriptions**: Three-tier subscription plans
- **Certificates**: Automated certificate generation
- **Profile Management**: Complete profile with experience and skills
- **Applications Tracking**: View and manage job applications

### Recruiter Features
- **Dashboard**: Overview of posted jobs and applications
- **Post Jobs**: Create and manage job listings
- **Applications Management**: Review and manage candidate applications
- **Settings**: Configure recruiter profile and preferences

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: Zustand
- **Routing**: React Router v7
- **Testing**: Vitest + React Testing Library

## 📦 Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
cd frontend
npm run build
npm run preview
```

## 🚀 Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy**:
```bash
npm install -g vercel
vercel
```

## 📁 Project Structure

```
HireXO Job portal/
├── frontend/
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── layouts/         # Layout components
│   │   ├── modules/         # Feature modules
│   │   │   ├── job-seeker/  # Job seeker features
│   │   │   ├── recruiter/   # Recruiter features
│   │   │   └── resources/   # Resources module
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main app component
│   ├── package.json
│   └── vite.config.ts
├── vercel.json              # Vercel configuration
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # This file
```

## 🎨 Design Features

- **Mobile-First**: Optimized for 430px viewport
- **Dark Mode**: Full dark mode support
- **Responsive**: Works on all screen sizes
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG 2.1 AA compliant

## 🧪 Testing

```bash
cd frontend

# Run tests
npm test

# Run tests with UI
npm run test:ui
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## 🌐 Resources Categories

1. **Tenders** - Tender-based opportunities
2. **Logistics** - Transportation and warehousing
3. **Equipments** - Equipment rental and operations
4. **Vehicles** - Vehicle-related opportunities
5. **PMC** - Project Management Consultancy
6. **CSM** - Construction Supervision Management

## 📄 License

Private project - All rights reserved

## 👥 Contributing

This is a private project. For questions or issues, contact the development team.

## 🔗 Links

- **Production**: [Deploy to Vercel](./DEPLOYMENT.md)
- **Documentation**: See inline code comments
- **Style Guide**: Available at `/style-guide` route

---

Built with ❤️ using React + TypeScript + Tailwind CSS
