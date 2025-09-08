import { useState } from 'react';
import '/src/styles.css';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className={`search-modal ${isOpen ? 'active' : ''}`}>
      <div className="search-modal-content">
        <div className="search-input-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Поиск по сайту..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-submit">
            <img src="/images/icons/icon-search-submit.png" alt="Поиск"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;