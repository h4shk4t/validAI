import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '@/components/marketplace/sidebar';
import Tab from '@/components/marketplace/tabs';
import ModelCard from '@/components/marketplace/modelCard';
import { Model } from '@/types/model';

const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Most popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeItem, setActiveItem] = useState('');

  const tabs = ['Most popular', 'Most downloaded', 'Most liked', 'Recently updated'];

  const models: Model[] = [
    { 
      title: 'ChatGPT',     
      type: 'Chat Bots', 
      subtype: 'General Purpose',
      price: 0, 
      reviews: [], 
      description: 'OpenAI chatbot',
      tags: ['AI', 'NLP', 'Conversational'],
      downloads: 782000,
      likes: 4200,
      lastUpdated: new Date(Date.now()),
    },
    { 
      title: 'DALL-E 2',     
      type: 'AI Models', 
      subtype: 'Image Generation',
      price: 15, 
      reviews: [], 
      description: 'AI image generation model',
      tags: ['AI', 'Image', 'Generation'],
      downloads: 500000,
      likes: 3800,
      lastUpdated: new Date(Date.now() - 86400000),
    },
    { 
      title: 'GPT-4',     
      type: 'Multimodal', 
      subtype: 'Auto Complete',
      price: 20, 
      reviews: [], 
      description: 'Advanced language model',
      tags: ['AI', 'NLP', 'Multimodal'],
      downloads: 650000,
      likes: 4500,
      lastUpdated: new Date(Date.now() - 172800000),
    },
    { 
      title: 'GPT-4',     
      type: 'Multimodal', 
      subtype: 'Auto Complete',
      price: 20, 
      reviews: [], 
      description: 'Advanced language model',
      tags: ['AI', 'NLP', 'Multimodal'],
      downloads: 650000,
      likes: 4500,
      lastUpdated: new Date(Date.now() - 172800000),
    },
  ];



  const filteredModels = useMemo(() => 
    models.filter(model => 
      (model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       model.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeCategory === '' || model.type === activeCategory) &&
      (activeItem === '' || activeItem.includes('All') || model.subtype === activeItem)
    ),
    [models, searchQuery, activeCategory, activeItem]
  );

  const sortedModels = useMemo(() => {
    switch (activeTab) {
      case 'Most downloaded':
        return [...filteredModels].sort((a, b) => b.downloads - a.downloads);
      case 'Most liked':
        return [...filteredModels].sort((a, b) => b.likes - a.likes);
      case 'Recently updated':
        return [...filteredModels].sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
      default:
        return filteredModels;
    }
  }, [filteredModels, activeTab]);

  const handleCategorySelect = (category: string, item: string) => {
    setActiveCategory(category);
    setActiveItem(item);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        activeCategory={activeCategory}
        activeItem={activeItem}
        onSelectCategory={handleCategorySelect}
      />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {tabs.map(tab => (
              <Tab
                key={tab}
                label={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700 text-white px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedModels.map((model, index) => (
            <ModelCard key={model.title + index} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;