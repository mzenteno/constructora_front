import { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

export const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const { t, i18n, ready } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <I18nContext.Provider value={{ t, i18n, ready, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);