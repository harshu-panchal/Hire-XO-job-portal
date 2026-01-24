import { create } from "zustand";
import type { Job, Certificate, UserProfile } from "../types";

interface JobSeekerState {
  jobs: Job[];
  certificates: Certificate[];
  userProfile: UserProfile | null;
  filters: {
    search: string;
    type: string;
  };
  setSearch: (search: string) => void;
  setType: (type: string) => void;
  addCertificate: (cert: Certificate) => void;
  setUserProfile: (profile: UserProfile) => void;
  purchaseSubscription: (planId: string) => void;
  fetchJobs: () => void;
}

export const useJobSeekerStore = create<JobSeekerState>((set) => ({
  // ... existing state
  jobs: [],
  certificates: [
    {
      id: "CERT-12345",
      name: "Certified Frontend Developer",
      issueDate: "2025-10-15",
      expiryDate: "2026-04-15",
      successRate: 75,
      status: "Active",
    },
  ],
  userProfile: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "job-seeker",
    interviewSuccessRate: 65,
  },
  filters: {
    search: "",
    type: "all",
  },
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setType: (type) => set((state) => ({ filters: { ...state.filters, type } })),
  addCertificate: (cert) => set((state) => ({ certificates: [...state.certificates, cert] })),
  setUserProfile: (profile) => set({ userProfile: profile }),
  purchaseSubscription: (planId) =>
    set((state) => ({
      userProfile: state.userProfile
        ? { ...state.userProfile, activeSubscriptionId: planId }
        : null,
    })),
  fetchJobs: () => {
    // Mocking API call with enhanced job details
    const mockJobs: Job[] = [
      {
        id: "1",
        title: "Senior React Developer",
        company: "Tech Solutions Inc.",
        companyLogo:
          "https://api.dicebear.com/7.x/initials/svg?seed=TS&backgroundColor=7c3aed&fontFamily=Arial&fontWeight=700",
        location: "Remote",
        salary: "₹15L - ₹25L",
        type: "Full-time",
        postedAt: "2 days ago",
        category: "Development",
        description:
          "We are seeking a Senior React Developer to lead our frontend team in building next-generation web applications.",
        requirements: [
          "5+ years of experience with React and TypeScript",
          "Strong understanding of State Management (Zustand, Redux)",
          "Experience with Tailwind CSS and modern UI libraries",
          "Knowledge of Next.js and Server-side Rendering",
        ],
        responsibilities: [
          "Architect and implement scalable frontend solutions",
          "Mentor junior developers and conduct code reviews",
          "Collaborate with UX/UI designers to ensure design fidelity",
          "Optimize applications for maximum speed and scalability",
        ],
        benefits: [
          "Competitive salary and performance bonuses",
          "Flexible working hours and remote options",
          "Health insurance and wellness programs",
          "Annual learning budget and certifications",
        ],
      },
      {
        id: "2",
        title: "Frontend Engineer",
        company: "Zeto Apps",
        companyLogo:
          "https://api.dicebear.com/7.x/initials/svg?seed=ZA&backgroundColor=0ea5e9&fontFamily=Arial&fontWeight=700",
        location: "Bangalore",
        salary: "₹12L - ₹20L",
        type: "Full-time",
        postedAt: "1 day ago",
        category: "Development",
        description:
          "Join our growing team as a Frontend Engineer and help us build beautiful, high-performance mobile-first web apps.",
        requirements: [
          "3+ years of experience in Frontend Development",
          "Proficiency in React and modern JavaScript (ES6+)",
          "Experience with responsive design and Tailwind CSS",
          "Familiarity with Git and Agile methodologies",
        ],
        responsibilities: [
          "Develop new user-facing features using React.js",
          "Build reusable components and front-end libraries",
          "Translate designs and wireframes into high-quality code",
          "Ensure the technical feasibility of UI/UX designs",
        ],
        benefits: [
          "Modern office space in the heart of Bangalore",
          "Daily catered lunches and snacks",
          "Comprehensive health and life insurance",
          "Quarterly team outings and workshops",
        ],
      },
      {
        id: "3",
        title: "UI/UX Designer",
        company: "Creative Studio",
        companyLogo:
          "https://api.dicebear.com/7.x/initials/svg?seed=CS&backgroundColor=f43f5e&fontFamily=Arial&fontWeight=700",
        location: "Mumbai",
        salary: "₹8L - ₹15L",
        type: "Contract",
        postedAt: "5 hours ago",
        category: "Design",
        description:
          "We're looking for a creative UI/UX Designer to craft engaging experiences for our diverse client base.",
        requirements: [
          "Proven work experience as a UI/UX Designer or similar role",
          "Portfolio of design projects for web and mobile",
          "Knowledge of wireframe tools (e.g. Figma, Adobe XD)",
          "Team spirit and strong communication skills",
        ],
        responsibilities: [
          "Gather and evaluate user requirements in collaboration with product managers and engineers",
          "Illustrate design ideas using storyboards, process flows and sitemaps",
          "Design graphic user interface elements, like menus, tabs and widgets",
          "Build page navigation buttons and search fields",
        ],
        benefits: [
          "Project-based bonuses",
          "Creative freedom and ownership",
          "Networking opportunities with top industry leaders",
          "Access to premium design tools and resources",
        ],
      },
      {
        id: "4",
        title: "Backend Developer (Node.js)",
        company: "Cloud Systems",
        companyLogo:
          "https://api.dicebear.com/7.x/initials/svg?seed=CL&backgroundColor=10b981&fontFamily=Arial&fontWeight=700",
        location: "Remote",
        salary: "₹18L - ₹30L",
        type: "Full-time",
        postedAt: "3 days ago",
        category: "Development",
        description:
          "Join our core platform team to build scalable microservices and high-performance APIs.",
        requirements: [
          "4+ years of experience with Node.js and Express",
          "Strong knowledge of PostgreSQL and Redis",
          "Experience with AWS or GCP services",
          "Understanding of microservices architecture",
        ],
        responsibilities: [
          "Design and implement robust server-side logic",
          "Integrate user-facing elements developed by front-end developers",
          "Build reusable code and libraries for future use",
          "Optimize applications for maximum speed and scalability",
        ],
        benefits: [
          "High-end equipment allowance",
          "Stock options (ESOPs)",
          "Unlimited PTO policy",
          "Global team retreats",
        ],
      },
      {
        id: "5",
        title: "Product Manager",
        company: "Growth Labs",
        companyLogo:
          "https://api.dicebear.com/7.x/initials/svg?seed=GL&backgroundColor=f59e0b&fontFamily=Arial&fontWeight=700",
        location: "Delhi",
        salary: "₹20L - ₹35L",
        type: "Full-time",
        postedAt: "1 week ago",
        category: "Management",
        description:
          "We're looking for a data-driven Product Manager to lead our growth initiatives and user retention strategies.",
        requirements: [
          "3+ years of experience in Product Management",
          "Strong analytical skills and experience with SQL",
          "Experience with A/B testing and growth frameworks",
          "Excellent communication and stakeholder management",
        ],
        responsibilities: [
          "Define product vision and roadmap",
          "Conduct market research and user interviews",
          "Write detailed PRDs and user stories",
          "Work closely with engineering and design teams",
        ],
        benefits: [
          "Performance-linked bonuses",
          "Comprehensive health insurance",
          "Relocation assistance",
          "Monthly wellness stipend",
        ],
      },
      {
        id: "6",
        title: "Mobile App Developer",
        company: "Appify Tech",
        companyLogo:
          "https://api.dicebear.com/7.x/initials/svg?seed=AT&backgroundColor=6366f1&fontFamily=Arial&fontWeight=700",
        location: "Hyderabad",
        salary: "₹14L - ₹22L",
        type: "Full-time",
        postedAt: "12 hours ago",
        category: "Development",
        description:
          "Build high-quality cross-platform mobile applications using React Native for our global users.",
        requirements: [
          "3+ years of experience in React Native",
          "Strong understanding of iOS and Android platforms",
          "Experience with Redux or MobX for state management",
          "Knowledge of native modules and bridging",
        ],
        responsibilities: [
          "Develop and maintain mobile applications",
          "Implement pixel-perfect UIs that match designs",
          "Optimize app performance for low-end devices",
          "Publish apps to App Store and Google Play",
        ],
        benefits: [
          "Flexible work from home options",
          "Annual bonus scheme",
          "Latest MacBook Pro",
          "Skill development budget",
        ],
      },
      {
        id: "7",
        title: "Marketing Specialist",
        company: "Digital Pulse",
        companyLogo:
          "https://api.dicebear.com/7.x/initials/svg?seed=DP&backgroundColor=ec4899&fontFamily=Arial&fontWeight=700",
        location: "Remote",
        salary: "₹6L - ₹12L",
        type: "Freelance",
        postedAt: "4 days ago",
        category: "Marketing",
        description:
          "Help us grow our digital presence and manage social media campaigns for leading brands.",
        requirements: [
          "2+ years of experience in Digital Marketing",
          "Experience with Meta Ads and Google Ads",
          "Strong copywriting and content creation skills",
          "Knowledge of SEO and content strategy",
        ],
        responsibilities: [
          "Manage social media accounts and engagement",
          "Create and optimize ad campaigns",
          "Analyze campaign performance and ROI",
          "Collaborate with design team for creative assets",
        ],
        benefits: [
          "Flexible working hours",
          "Performance incentives",
          "Remote-first culture",
          "Opportunity to work with top brands",
        ],
      },
      {
        id: "8",
        title: "QA Automation Engineer",
        company: "Secure Fintech",
        companyLogo:
          "https://api.dicebear.com/7.x/initials/svg?seed=SF&backgroundColor=0ea5e9&fontFamily=Arial&fontWeight=700",
        location: "Bangalore",
        salary: "₹10L - ₹18L",
        type: "Full-time",
        postedAt: "2 days ago",
        category: "Testing",
        description:
          "Ensure the reliability and security of our fintech platform through automated testing.",
        requirements: [
          "3+ years of experience in Automation Testing",
          "Proficiency in Selenium, Cypress or Playwright",
          "Strong understanding of CI/CD pipelines",
          "Experience with API testing tools like Postman",
        ],
        responsibilities: [
          "Develop and maintain automated test suites",
          "Perform manual testing when necessary",
          "Identify, document, and track bugs",
          "Collaborate with developers to resolve issues",
        ],
        benefits: [
          "Fintech domain training",
          "Health and life insurance",
          "Subsidized gym membership",
          "Free lunch at the office",
        ],
      },
    ];
    set({ jobs: mockJobs });
  },
}));
