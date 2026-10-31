
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';

export type Language = 'en' | 'ar';

const translations = {
  en: {
    work: 'Work',
    categories: 'Categories',
    about: 'About',
    contact: 'Contact',
    admin: 'Admin',
    adminDashboard: 'Admin Dashboard',

    heroExplore: 'Explore My Work',
    heroContact: "Let's Work Together",

    worksLabel: 'Selected Works',
    worksHeading: 'A collection of ideas turned into experiences.',
    viewAllProjects: 'View All Projects',

    categoriesLabel: 'Disciplines',
    categoriesHeading: 'What I Create',

    aboutLabel: 'About Me',
    aboutHeading: "Behind Every Pixel, There's an Idea.",
    experience: 'Years Experience',
    creativePhilosophy: 'Creative Philosophy',
    softwareSkills: 'Software & Skills',

    contactLabel: 'Contact',
    contactHeading: 'Have a Project in Mind?',
    contactDescription: "Let's create something meaningful together.",
    name: 'Name',
    yourName: 'Your name',
    email: 'Email',
    projectType: 'Project Type',
    selectProjectType: 'Select a project type',
    message: 'Message',
    messagePlaceholder: 'Tell me about your project...',
    sendMessage: 'Send Message',
    sending: 'Sending...',
    messageSuccess: 'Your message has been sent successfully!',
    messageError: 'Failed to send your message. Please try again.',

    allProjects: 'All Projects',
    all: 'All',
    backHome: 'Back to Home',
    fullCollection: 'The Full Collection',
    noProjects: 'No projects in this category yet.',
    crafted: 'Crafted with passion.',

    projectNotFound: 'Project not found',
    backToProjects: 'Back to all projects',
    backToAllProjects: 'Back to All Projects',
    designProcess: 'Design Process',
    gallery: 'Gallery',
    projectInformation: 'Project Information',
    projectDate: 'Project Date',
    toolsUsed: 'Tools Used',
    category: 'Category',
    aboutProject: 'About the Project',
    projectGoals: 'Project Goals',
    previous: 'Previous',
    next: 'Next',
    heroLabel: 'GRAPHIC DESIGNER & VISUAL CREATIVE',
    heroHeading: 'I Turn Ideas Into Powerful Visual Stories.',
    heroDescription: 'I craft unique visual identities, creative designs, and digital experiences that help brands stand out and leave a lasting impression.',
    project: 'project',
    projects: 'projects',
  },

  ar: {
    work: 'الأعمال',
    categories: 'التخصصات',
    about: 'من أنا',
    contact: 'تواصل معي',
    admin: 'الإدارة',
    adminDashboard: 'لوحة التحكم',

    heroExplore: 'استكشف أعمالي',
    heroContact: 'لنعمل معًا',

    worksLabel: 'أعمال مختارة',
    worksHeading: 'مجموعة من الأفكار تحولت إلى تجارب إبداعية.',
    viewAllProjects: 'عرض كل المشاريع',

    categoriesLabel: 'التخصصات',
    categoriesHeading: 'ماذا أقدم؟',

    aboutLabel: 'من أنا',
    aboutHeading: 'وراء كل تفصيلة إبداعية توجد فكرة.',
    experience: 'سنوات من الخبرة',
    creativePhilosophy: 'فلسفتي الإبداعية',
    softwareSkills: 'البرامج والمهارات',

    contactLabel: 'تواصل معي',
    contactHeading: 'هل لديك مشروع في ذهنك؟',
    contactDescription: 'دعنا نصنع شيئًا مميزًا معًا.',
    name: 'الاسم',
    yourName: 'اكتب اسمك',
    email: 'البريد الإلكتروني',
    projectType: 'نوع المشروع',
    selectProjectType: 'اختر نوع المشروع',
    message: 'رسالتك',
    messagePlaceholder: 'أخبرني عن مشروعك...',
    sendMessage: 'إرسال الرسالة',
    sending: 'جارٍ الإرسال...',
    messageSuccess: 'تم إرسال رسالتك بنجاح!',
    messageError: 'فشل إرسال الرسالة. حاول مرة أخرى.',

    allProjects: 'كل الأعمال',
    all: 'الكل',
    backHome: 'العودة للرئيسية',
    fullCollection: 'معرض أعمالي الكامل',
    noProjects: 'لا توجد مشاريع في هذا التخصص حاليًا.',
    crafted: 'صُنع بكل شغف.',

    projectNotFound: 'المشروع غير موجود',
    backToProjects: 'العودة إلى كل المشاريع',
    backToAllProjects: 'العودة إلى كل الأعمال',
    designProcess: 'مراحل التصميم',
    gallery: 'معرض الصور',
    projectInformation: 'معلومات المشروع',
    projectDate: 'تاريخ المشروع',
    toolsUsed: 'البرامج المستخدمة',
    category: 'التخصص',
    aboutProject: 'عن المشروع',
    projectGoals: 'أهداف المشروع',
    previous: 'السابق',
    next: 'التالي',
    heroLabel: 'مصمم جرافيك ومبدع بصري',
    heroHeading: 'أحوّل الأفكار إلى قصص بصرية مؤثرة.',
    heroDescription: 'أصمم هويات بصرية مميزة وأعمالًا إبداعية وتجارب رقمية تساعد العلامات التجارية على التميز وترك انطباع لا يُنسى.',
    project: 'مشروع',
    projects: 'مشاريع',
  },
};

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  const [language, setLanguageState] = useState<Language>(() => {
    return localStorage.getItem('portfolio-language') === 'ar' ? 'ar' : 'en';
  });

  const isAdmin = location.pathname.startsWith('/admin');

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    localStorage.setItem('portfolio-language', next);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = isAdmin ? 'en' : language;
    document.documentElement.dir = isAdmin
      ? 'ltr'
      : language === 'ar'
        ? 'rtl'
        : 'ltr';

    document.body.classList.toggle(
      'arabic-font',
      !isAdmin && language === 'ar'
    );
  }, [language, isAdmin]);

  const t = (key: TranslationKey) => translations[language][key];

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }

  return context;
}
