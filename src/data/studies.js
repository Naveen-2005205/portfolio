// Academic Curriculum and Roadmap for B.E. Computer Science & Engineering
const studies = [
  {
    id: "programming",
    num: "01",
    title: "PROGRAMMING METHODOLOGY",
    description: "Core logic design using high-level programming languages.",
    additionalInfo: "Foundational programming concepts in C, C++, and Python. Focused on procedural syntax, control flows, memory pointers, dynamic allocation, and object-oriented paradigms.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>`
  },
  {
    id: "dsa",
    num: "02",
    title: "DATA STRUCTURES & ALGORITHMS",
    description: "Analyzing computational complexity, sorting efficiency, and algorithms.",
    additionalInfo: "Study of arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Covering binary search, sorting algorithms, traversal mechanisms, recursion, and Big-O asymptotic analysis.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="5" r="3"/>
      <circle cx="5" cy="19" r="3"/>
      <circle cx="19" cy="19" r="3"/>
      <line x1="8.5" y1="7.5" x2="5.5" y2="16.5"/>
      <line x1="15.5" y1="7.5" x2="18.5" y2="16.5"/>
      <line x1="8" y1="19" x2="16" y2="19"/>
    </svg>`
  },
  {
    id: "dbms",
    num: "03",
    title: "DATABASE MANAGEMENT SYSTEMS",
    description: "Designing schema relationships and structured querying language.",
    additionalInfo: "Relational database design, Entity-Relationship modeling, normalization forms, transactions control, and SQL indexing. Hands-on experience with MySQL and Microsoft SQL Server.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
    </svg>`
  },
  {
    id: "web-app",
    num: "04",
    title: "WEB & MOBILE APPLICATIONS",
    description: "Developing responsive clients and REST APIs.",
    additionalInfo: "Study of client-server application architectures, semantic HTML/CSS, DOM manipulation, asynchronous JavaScript, cross-platform mobile engineering with Flutter and Dart, and Node.js REST API systems.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>`
  },
  {
    id: "iot",
    num: "05",
    title: "IOT & EMBEDDED SYSTEMS",
    description: "Interfacing microcontrollers, sensors, and network protocols.",
    additionalInfo: "Embedded C programming, hardware signal reading, working with ESP32/Arduino microcontrollers, GPS modules, and implementing lightweight real-time communication protocols like MQTT and WebSockets.",
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
    </svg>`
  }
];

window.PortfolioData = window.PortfolioData || {};
window.PortfolioData.studies = studies;

