// client/src/components/TranslatedText.jsx
const TranslatedText = ({ children, className = '' }) => {
  // Just return the text without translation for now
  return <span className={className}>{children}</span>;
};

export default TranslatedText;
