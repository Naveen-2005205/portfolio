// Skills data for "My Toolbox"
const skillCategories = [
  {
    id: "programming",
    title: "Programming",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>`,
    skills: [
      { name: "Python", desc: "For scripting, logic, and data tools" },
      { name: "JavaScript", desc: "For interactive features and web client logic" },
      { name: "C / C++", desc: "For low-level microcontrollers and performance" },
      { name: "HTML5", desc: "Semantic page structure" },
      { name: "CSS3", desc: "Responsive layouts and modern animation styling" }
    ]
  },
  {
    id: "development",
    title: "Development",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>`,
    skills: [
      { name: "Flutter", desc: "Cross-platform mobile and web design" },
      { name: "Dart", desc: "Language backing Flutter development" },
      { name: "Node.js", desc: "Server runtime environments" },
      { name: "Express", desc: "Fast REST API routing frameworks" },
      { name: "REST APIs", desc: "Reliable client-server communication" }
    ]
  },
  {
    id: "database",
    title: "Database",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
    </svg>`,
    skills: [
      { name: "SQL", desc: "Declarative querying language" },
      { name: "MySQL", desc: "Open-source relational database" },
      { name: "Microsoft SQL Server", desc: "Enterprise database management" }
    ]
  },
  {
    id: "hardware-iot",
    title: "Hardware / IoT",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/>
      <line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/>
      <line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/>
      <line x1="20" y1="15" x2="23" y2="15"/>
      <line x1="1" y1="9" x2="4" y2="9"/>
      <line x1="1" y1="15" x2="4" y2="15"/>
    </svg>`,
    skills: [
      { name: "ESP32", desc: "Wi-Fi & Bluetooth microcontroller chip" },
      { name: "GPS Modules", desc: "Location tracking sensors (e.g. NEO-6M)" },
      { name: "Arduino", desc: "Prototyping boards and electronics ecosystem" },
      { name: "Sensors", desc: "Accelerometers, temperature, and gyro hardware" },
      { name: "MQTT / WebSockets", desc: "Low-overhead real-time telemetry streaming" }
    ]
  },
  {
    id: "tools",
    title: "Tools",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>`,
    skills: [
      { name: "Git", desc: "Distributed version control system" },
      { name: "GitHub", desc: "Source code hosting and project collaboration" },
      { name: "VS Code", desc: "Primary code editor environment" },
      { name: "Figma", desc: "Vector graphics editor and UI prototyping tool" }
    ]
  }
];

window.PortfolioData = window.PortfolioData || {};
window.PortfolioData.skillCategories = skillCategories;

