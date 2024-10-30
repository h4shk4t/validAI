import React from 'react';
import { Layers, MessageCircle, Cpu } from 'lucide-react';

interface Category {
  title: string;
  items: string[];
  icon: React.ElementType;
}

interface SidebarProps {
  activeCategory: string;
  activeItem: string;
  onSelectCategory: (category: string, item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, activeItem, onSelectCategory }) => {
  const categories: Category[] = [
    {
      title: 'Multimodal',
      items: ['All Multimodal', 'Text to Speech', 'Auto Complete'],
      icon: Layers
    },
    {
      title: 'Chat Bots',
      items: ['All Chat Bots', 'General Purpose', 'Customer Support', 'Language Learning'],
      icon: MessageCircle
    },
    {
      title: 'AI Models',
      items: ['All AI Models', 'Image Generation', 'Video Generation', 'Audio Generation'],
      icon: Cpu
    }
  ];

  return (
    <div className="w-64 bg-background text-foreground p-4 shadow-lg">
      <img src="/lookout.png" alt="EM EL MARKETPLACE" className="mb-4 w-full max-w-[160px] mx-auto" />
      <hr className="border-t mb-7" />
      {categories.map((category) => (
        <div key={category.title} className="mb-6">
          <h3 className="font-semibold mb-3 text-white flex items-center">
            <category.icon className="mr-2 stroke-current" size={18} />
            {category.title}
          </h3>
          <ul className='space-y-1'>
            {category.items.map((item) => (
              <li
                key={item}
                className={`cursor-pointer py-2 px-3 rounded transition-colors duration-200 ${
                  activeCategory === category.title && activeItem === item
                    ? 'bg-accent text-white'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => onSelectCategory(category.title, item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
