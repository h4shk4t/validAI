import React from 'react';

interface TabProps {
    label: string;
    active: boolean;
    onClick: () => void;
  }
  
  const Tab: React.FC<TabProps> = React.memo(({ label, active, onClick }) => (
    <button
      className={`px-4 py-2 rounded-lg transition-colors duration-200 border ${
        active ? 'bg-[#1F2937] text-white border-[#2C3B57]' : 'text-gray-400 hover:bg-[#1F2937] hover:text-gray-200 border-transparent'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  ));

  Tab.displayName = 'Tab';

export default Tab;