import { createContext, useContext, useEffect, useState } from 'react';

const FontContext = createContext();

export function FontProvider({ children }) {
  const [font, setFont] = useState(localStorage.getItem('vite-ui-font') || 'system');

  useEffect(() => {
    applyFont(font);
  }, [font]);

  const applyFont = (selectedFont) => {
    const root = document.documentElement;
    const fontFamily =
      selectedFont === 'system' ? 'system-ui, sans-serif' :
        selectedFont === 'cairo' ? 'Cairo, sans-serif' :
          selectedFont === 'tajawal' ? 'Tajawal, sans-serif' :
            selectedFont === 'noto-kufi' ? 'Noto Kufi Arabic, sans-serif' :
              selectedFont === 'ibm-arabic' ? 'IBM Plex Sans Arabic, sans-serif' :
                selectedFont === 'almarai' ? 'Almarai, sans-serif' :
                  selectedFont === 'readex' ? 'Readex Pro, sans-serif' :
                    'system-ui, sans-serif';

    root.style.fontFamily = fontFamily;
    localStorage.setItem('vite-ui-font', selectedFont);
  };

  return (
    <FontContext.Provider value={{ font, setFont, applyFont }}>
      {children}
    </FontContext.Provider>
  );
}

export const useFont = () => useContext(FontContext);