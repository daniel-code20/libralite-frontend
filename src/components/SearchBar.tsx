import React, { useState } from 'react';
import { Input } from '@nextui-org/react';
import { SearchIcon } from '../components/SearchIcon';
import { SearchResult } from './SearchResult';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.trim() !== '');
  };

  return (
    <div className="relative flex items-center p-4 animate__animated animate__fadeIn">
      <Input
        isClearable
        radius="sm"
        classNames={{
          label: 'text-black/50 dark:text-white/90',
          input: [
            'bg-transparent',
            'text-black/90 dark:text-white/90',
            'placeholder:text-default-700/50 dark:placeholder:text-white/60',
          ],
          innerWrapper: 'bg-transparent',
          inputWrapper: [
            'drop-shadow-md',
            'bg-[rgb(240,240,240)]',
            'dark:bg-default/60',
            'backdrop-blur-xl',
            'backdrop-saturate-200',
            'hover:bg-default-200/70',
            'dark:hover:bg-default/70',
            'group-data-[focused=true]:bg-default-200/50',
            'dark:group-data-[focused=true]:bg-default/60',
            '!cursor-text',
          ],
        }}
        placeholder="Buscar libro..."
        startContent={
          <SearchIcon className="text-black/30 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0 mr-2" />
        }
        className="search-input"
        value={searchTerm}
        onChange={handleInputChange}
      />
      {showResults && (
        <div className="absolute top-full left-0 w-full z-50 mt-2 bg-white shadow-lg rounded-lg max-h-60 overflow-auto">
          <SearchResult searchTerm={searchTerm} />
        </div>
      )}
    </div>
  );
};
