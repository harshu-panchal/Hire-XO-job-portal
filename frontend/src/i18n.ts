import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: false,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: {
                    "employer": {
                        "settings": {
                            "title": "Employer Settings",
                            "role_title": "Employer",
                            "page_title": "Settings",
                            "subtitle": "Manage your profile and company",
                            "sections": {
                                "account": {
                                    "title": "Account",
                                    "items": {
                                        "profile_information": "Profile Information",
                                        "company_details": "Company Details",
                                        "wallet_balance": "Wallet Balance",
                                        "subscription_plan": "Subscription Plan"
                                    }
                                },
                                "preferences": {
                                    "title": "Preferences",
                                    "items": {
                                        "notifications": "Notifications",
                                        "security_privacy": "Security & Privacy",
                                        "language": "Language"
                                    }
                                }
                            },
                            "logout": "Sign Out",
                            "footer": "Hire XO v1.0.4",
                            "modal": {
                                "title": "Select Language",
                                "subtitle": "Choose your preferred language"
                            }
                        }
                    }
                }
            },
            hi: {
                translation: {
                    "employer": {
                        "settings": {
                            "title": "एम्प्लॉयर सेटिंग्स",
                            "role_title": "एम्प्लॉयर",
                            "page_title": "सेटिंग्स",
                            "subtitle": "अपनी प्रोफ़ाइल और कंपनी प्रबंधित करें",
                            "sections": {
                                "account": {
                                    "title": "खाता",
                                    "items": {
                                        "profile_information": "प्रोफ़ाइल जानकारी",
                                        "company_details": "कंपनी विवरण",
                                        "wallet_balance": "वॉलेट बैलेंस",
                                        "subscription_plan": "सदस्यता योजना"
                                    }
                                },
                                "preferences": {
                                    "title": "पसंद",
                                    "items": {
                                        "notifications": "सूचनाएं",
                                        "security_privacy": "सुरक्षा और गोपनीयता",
                                        "language": "भाषा"
                                    }
                                }
                            },
                            "logout": "साइन आउट",
                            "footer": "हायर XO v1.0.4",
                            "modal": {
                                "title": "भाषा चुनें",
                                "subtitle": "अपनी पसंदीदा भाषा चुनें"
                            }
                        }
                    }
                }
            }
        }
    });

export default i18n;
