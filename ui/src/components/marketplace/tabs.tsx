import React from 'react';

interface TabProps {
    label: string;
    active: boolean;
    onClick: () => void;
  }
  
  const Tab: React.FC<TabProps> = React.memo(({ label, active, onClick }) => (
    <button
      className={`px-4 py-2 rounded-lg transition-colors duration-200 border ${
        active ? 'bg-accent text-white border-accent/50 border' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground border-transparent'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  ));

  Tab.displayName = 'Tab';

export default Tab;