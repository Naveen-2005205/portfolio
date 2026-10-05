// Central configuration for the portfolio website
const config = {
  name: "NAVEEN RAJAN",
  firstName: "NAVEEN",
  lastName: "RAJAN",
  title: "Computer Science Engineering Student • Builder • Learner",
  tagline: "A calm mind. A curious builder.",
  description: "I enjoy turning ideas into practical technology, learning through every project, and improving through every experience.",
  email: "naveengrajan@gmail.com",
  github: "https://github.com/Naveen-2005205",
  linkedin: "https://www.linkedin.com/in/naveen-rajan-4b14943a3/",
  instagram: "https://instagram.com",
  location: "Pudukkottai, Tamil Nadu, India",
  resumePath: "assets/Naveen resume.pdf",
  sections: {
    about: { number: "01", label: "01 / ABOUT ME", title: "THE BUILDER" },
    journey: { number: "02", label: "02 / MY JOURNEY", title: "MY JOURNEY" },
    skills: { number: "03", label: "03 / TECH STACK", title: "MY TOOLBOX" },
    projects: { number: "04", label: "04 / PROJECTS", title: "PROJECTS" },
    contact: { number: "05", label: "05 / CONTACT", title: "LET'S BUILD SOMETHING" }
  }
};

window.PortfolioData = window.PortfolioData || {};
window.PortfolioData.config = config;

