import React from 'react';

interface TabProps {
    label: string;
    active: boolean;
    onClick: () => void;
  }
  
  const Tab: React.FC<TabProps> = React.memo(({ label, active, onClick }) => (
    <button
      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
        active ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  ));

  Tab.displayName = 'Tab';

export default Tab;