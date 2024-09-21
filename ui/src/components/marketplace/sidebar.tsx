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
    <div className="w-64 bg-gray-800 text-white p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-blue-400">EM EL MARKETPLACE</h2>
      {categories.map((category) => (
        <div key={category.title} className="mb-6">
          <h3 className="font-semibold mb-3 text-gray-400 flex items-center">
            <category.icon className="mr-2 stroke-current" size={18} />
            {category.title}
          </h3>
          <ul>
            {category.items.map((item) => (
              <li
                key={item}
                className={`cursor-pointer py-2 px-3 rounded transition-colors duration-200 ${
                  activeCategory === category.title && activeItem === item
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
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
