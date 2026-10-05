// src/data/projects.js — Central project data registry
const projects = [
  {
    id: "zion-racing",
    number: "01",
    category: "IOT / TELEMETRY",
    title: "ZION RACING",
    description: "Real-time telemetry and tracking system for go-kart racing.",
    details: "A dedicated telemetry and tracking platform engineered for go-kart drivers and race engineers, delivering live metrics, location tracking, and real-time path rendering.",
    features: [
      "Live speed & telemetry metrics",
      "GPS spatial lap mapping",
      "Sector split times & delta",
      "Real-time path rendering",
      "Low-latency race logging"
    ],
    technologies: ["ESP32", "GPS", "Flutter", "Node.js", "IoT"],
    role: "Hardware & IoT Developer",
    heroImage: "assets/projects/zion-telemetry.jpg",
    galleryImages: ["assets/projects/zion-telemetry.jpg"],
    githubUrl: "https://github.com/Naveen-2005205/Go-kart-Telemetry-Flutter-",
    liveUrl: ""
  },
  {
    id: "payroll-management",
    number: "02",
    category: "FULL STACK / WEB",
    title: "PAYROLL MANAGEMENT SYSTEM",
    description: "Automated employee payroll, allowance and deduction management system.",
    details: "A centralized organizational web platform built to automate employee payroll computations, manage salary structures, tax deductions, and streamline disbursement records.",
    features: [
      "Automated salary calculations",
      "Allowances & deduction engine",
      "Employee attendance tracking",
      "Payslip generation & export",
      "Role-based administrative control"
    ],
    technologies: ["Python", "Django", "MySQL", "Bootstrap"],
    role: "Backend & Full Stack Developer",
    heroImage: "",
    galleryImages: [],
    githubUrl: "https://github.com/Naveen-2005205",
    liveUrl: ""
  },
  {
    id: "spendwise",
    number: "03",
    category: "PERSONAL FINANCE / WEB",
    title: "SPENDWISE",
    description: "A simple personal finance web application for recording, organizing and understanding everyday expenses.",
    details: "A responsive personal budgeting web app built to help users record daily spending, organize expenditure categories, and maintain clear visibility over their monthly financial health.",
    features: [
      "Expense recording & category tagging",
      "Monthly budget tracking",
      "Remaining balance calculations",
      "Search & filter transaction records",
      "Persistent client-side browser storage"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "Browser Storage"],
    role: "Frontend Developer",
    heroImage: "assets/projects/spendwise-dashboard.png",
    galleryImages: [
      "assets/projects/spendwise-dashboard.png",
      "assets/projects/spendwise-form.png",
      "assets/projects/spendwise-records.png"
    ],
    githubUrl: "https://github.com/Naveen-2005205/Spend-Wise",
    liveUrl: ""
  },
  {
    id: "college-feedback",
    number: "04",
    category: "ACADEMIC / FEEDBACK",
    title: "COLLEGE FEEDBACK SYSTEM",
    description: "Centralized web platform for streamlined college feedback and grievance management.",
    details: "A unified academic administration platform created to collect student feedback, process grievances systematically, and provide structured communication via automated email alerts.",
    features: [
      "Course & teaching evaluations",
      "Online grievance lodging & tracking",
      "Automated email notifications via PHPMailer",
      "Stakeholder feedback management",
      "Secure admin dashboard with file uploads"
    ],
    technologies: ["PHP", "MySQL", "HTML", "CSS", "JavaScript", "PHPMailer"],
    role: "Full-Stack Developer",
    heroImage: "assets/projects/college-feedback.png",
    galleryImages: ["assets/projects/college-feedback.png"],
    githubUrl: "https://github.com/Naveen-2005205/Feedback-System",
    liveUrl: ""
  }
];

window.PortfolioData = window.PortfolioData || {};
window.PortfolioData.projects = projects;
