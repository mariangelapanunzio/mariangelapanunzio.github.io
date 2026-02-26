import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  fallbackLng: "it",
  lng: "it", // Lingua di default
  interpolation: {
    escapeValue: false, // React fa già l'escaping di default
  },

  resources: {
    it: {
      translation: {
        // HEADER
        name: "Mariangela Panunzio",
        
        // HERO SECTION
        available: "Computer Scientist",
        hero_title_1: "AI",
        hero_title_2: "Engineer.",
        hero_subtitle: "Sono una sviluppatrice e mi occupo di implementare soluzioni AI-driven.",
        cta_talk: "Parliamo",
        cta_resume: "Scarica CV",
        based_in: "Base a",
        city: "Bari, Italia",

        // EXPERIENCE
        experiences_title: "Esperienze",
        exp_role_1: "AI Analyst",
        exp_desc_1: "Sviluppo soluzioni AI-driven per clienti enterprise, con focus su NLP e Computer Vision. Collaboro con team cross-funzionali per integrare modelli ML in applicazioni scalabili.",
        present: "Marzo 2025 - Presente",

        // EDUCATION (TIMELINE)
        education_title: "Percorso",
        education_highlight: "Accademico",
        master_degree: "Laurea Magistrale in Computer Science",
        master_spec: "110L • Specializzazione in AI",
        bachelor_degree: "Laurea Triennale in Informatica e Tecnologie per la Produzione del Software",
        bachelor_spec: "Focus su Software Engineering",
        diploma: "Diploma Tecnico Indutricale in Informatica e Telecomunicazioni",
        
        // SKILLS
        skills_arsenal: "Skills&",
        skills_title: "Knowledge",

        // CONTACT
        contact_title_1: "Hai un progetto in mente?",
        contact_title_2: "Costruiamolo insieme.",
        contact_text: "Se vuoi discutere di una potenziale collaborazione o semplicemente salutare.",
        
        // FOOTER
        footer_crafted: "Creato con React & Motion",
        
        // ACCESSIBILITY
        skip_to_content: "Vai al contenuto principale",
        toggle_theme: "Cambia tema",
        close_menu: "Chiudi menu",
        open_menu: "Apri menu"
      }
    },
    en: {
      translation: {  // ⚠️ ANCHE QUI!
        // HEADER
        name: "Mariangela Panunzio",
        
        // HERO SECTION
        available: "Computer Scientist",
        hero_title_1: "AI",
        hero_title_2: "Engineer.",
        hero_subtitle: "I'm a software developer implementing AI-driven solutions.",
        cta_talk: "Let's Talk",
        cta_resume: "Resume",
        based_in: "Based in",
        city: "Bari, Italy",

        // EXPERIENCE
        experiences_title: "Experiences",
        exp_role_1: "AI Analyst @ Deloitte",
        exp_desc_1: "Develop AI-driven solutions for enterprise clients, focusing on NLP and Computer Vision. Collaborate with cross-functional teams to integrate ML models into scalable applications.",
        present: "March 2025 - Present",

        // EDUCATION (TIMELINE)
        education_title: "Academic",
        education_highlight: "Journey",
        master_degree: "Master in Computer Science",
        master_spec: "110L • AI Specialization",
        bachelor_degree: "Bachelor in Computer Science and Software Production Technologies",
        bachelor_spec: "Focus on Software Engineering",
        diploma: "High School Diploma in Computer Science and Telecommunications",

        // SKILLS
        skills_arsenal: "Arsenal &",
        skills_title: "Skills",

        // CONTACT
        contact_title_1: "Have a project in mind?",
        contact_title_2: "Let's build it together.",
        contact_text: "Whether you want to discuss a potential collaboration or just say hi.",
        
        // FOOTER
        footer_crafted: "Crafted with React & Motion",
        
        // ACCESSIBILITY
        skip_to_content: "Skip to main content",
        toggle_theme: "Toggle theme",
        close_menu: "Close menu",
        open_menu: "Open menu"
      }
    },
  },
});

export default i18n;