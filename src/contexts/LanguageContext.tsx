import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'te' | 'hi';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Common
  'dashboard': { en: 'Dashboard', te: 'డాష్‌బోర్డ్', hi: 'डैशबोर्ड' },
  'register_patient': { en: 'Register Patient', te: 'రోగిని నమోదు చేయండి', hi: 'रोगी पंजीकरण' },
  'book_appointment': { en: 'Book Appointment', te: 'అపాయింట్‌మెంట్ బుక్ చేయండి', hi: 'अपॉइंटमेंट बुक करें' },
  'live_queue': { en: 'Live Queue', te: 'లైవ్ క్యూ', hi: 'लाइव क्यू' },
  'return_queue': { en: 'Return Queue', te: 'రిటర్న్ క్యూ', hi: 'रिटर्न क्यू' },
  'patient_search': { en: 'Patient Search', te: 'రోగి శోధన', hi: 'रोगी खोज' },
  'schedule_view': { en: 'Schedule View', te: 'షెడ్యూల్ వ్యూ', hi: 'शेड्यूल व्यू' },
  'settings': { en: 'Settings', te: 'సెట్టింగ్స్', hi: 'सेटिंग्स' },
  'sign_out': { en: 'Sign Out', te: 'సైన్ అవుట్', hi: 'साइन आउट' },
  
  // Appointment Schedule
  'appointment_schedule': { en: 'Appointment Schedule', te: 'అపాయింట్‌మెంట్ షెడ్యూల్', hi: 'अपॉइंटमेंट शेड्यूल' },
  'quick_date_selection': { en: 'Quick Date Selection', te: 'త్వరిత తేదీ ఎంపిక', hi: 'त्वरित दिनांक चयन' },
  'tomorrow': { en: 'Tomorrow', te: 'రేపు', hi: 'कल' },
  'day_after_tomorrow': { en: 'Day After Tomorrow', te: 'ఎల్లుండి', hi: 'परसों' },
  'next_week': { en: 'Next Week', te: 'వచ్చే వారం', hi: 'अगला सप्ताह' },
  'custom_date': { en: 'Custom Date', te: 'కస్టమ్ తేదీ', hi: 'कस्टम दिनांक' },
  'filter_by_doctor': { en: 'Filter by Doctor', te: 'డాక్టర్ ద్వారా ఫిల్టర్ చేయండి', hi: 'डॉक्टर द्वारा फिल्टर करें' },
  'all_doctors': { en: 'All Doctors', te: 'అన్ని డాక్టర్లు', hi: 'सभी डॉक्टर' },
  'search_patient': { en: 'Search Patient', te: 'రోగిని వెతకండి', hi: 'रोगी खोजें' },
  'search_by_name_mr': { en: 'Search by name or MR number', te: 'పేరు లేదా MR నంబర్ ద్వారా వెతకండి', hi: 'नाम या MR नंबर से खोजें' },
  'appointments_for': { en: 'Appointments for', te: 'దీని కోసం అపాయింట్‌మెంట్‌లు', hi: 'के लिए अपॉइंटमेंट' },
  'appointments': { en: 'appointments', te: 'అపాయింట్‌మెంట్‌లు', hi: 'अपॉइंटमेंट' },
  'print_schedule': { en: 'Print Schedule', te: 'షెడ్యూల్ ప్రింట్ చేయండి', hi: 'शेड्यूल प्रिंट करें' },
  'no_appointments_found': { en: 'No appointments found for the selected criteria', te: 'ఎంచుకున్న ప్రమాణాలకు అపాయింట్‌మెంట్‌లు కనుగొనబడలేదు', hi: 'चयनित मानदंडों के लिए कोई अपॉइंटमेंट नहीं मिला' },
  'reschedule': { en: 'Reschedule', te: 'రీషెడ్యూల్', hi: 'पुनर्निर्धारण' },
  'cancel': { en: 'Cancel', te: 'రద్దు చేయండి', hi: 'रद्द करें' },
  'print': { en: 'Print', te: 'ప్రింట్', hi: 'प्रिंट' },
  'back_to_dashboard': { en: 'Back to Dashboard', te: 'డాష్‌బోర్డ్‌కు తిరిగి', hi: 'डैशबोर्ड पर वापस' },
  
  // Live Queue
  'next_token_is': { en: 'Next Token is', te: 'తదుపరి టోకెన్', hi: 'अगला टोकन है' },
  'please_be_ready': { en: 'please be ready', te: 'దయచేసి సిద్ధంగా ఉండండి', hi: 'कृपया तैयार रहें' },
  
  // Languages
  'english': { en: 'English', te: 'ఇంగ్లీష్', hi: 'अंग्रेजी' },
  'telugu': { en: 'Telugu', te: 'తెలుగు', hi: 'तेलुगु' },
  'hindi': { en: 'Hindi', te: 'హిందీ', hi: 'हिंदी' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};