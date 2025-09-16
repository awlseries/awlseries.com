import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results, onClose, query }) => {
  const navigate = useNavigate();

  const scrollToElement = (element) => {
    if (element && element.scrollIntoView) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      element.classList.add('search-highlight');
      setTimeout(() => {
        element.classList.remove('search-highlight');
      }, 2000);
    }
    onClose();
  };

  const navigateToPage = (path) => {
    navigate(path);
    onClose();
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) return text;
    
    return (
      text.substring(0, index) +
      '<mark class="search-highlight-text">' +
      text.substring(index, index + query.length) +
      '</mark>' +
      text.substring(index + query.length)
    );
  };

  if (!results || results.length === 0) return null;

  return (
    <div className="search-results-container">
      <h3 className="search-results-count">
        Результаты поиска: {results.length}
      </h3>
      
      {results.map((result, index) => (
        <div 
          key={index} 
          className="search-result-item"
          onClick={() => {
            if (result.type === 'current') {
              scrollToElement(result.element);
            } else {
              navigateToPage(result.path);
            }
          }}
        >
          {result.type === 'current' ? (
            <>
              <div className="search-result-title">
                📍 Найдено на текущей странице
              </div>
              <div 
                className="search-result-text"
                dangerouslySetInnerHTML={{
                  __html: highlightText(result.text, query)
                }}
              />
            </>
          ) : (
            <>
              <div className="search-result-title">
                🔗 {result.name}
              </div>
              <div className="search-result-text">
                {result.description}
              </div>
              <div className="search-result-action">
                Перейти в раздел →
              </div>
            </>
          )}
        </div>
      ))}
      
      <button className="search-result-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

export default SearchResults;