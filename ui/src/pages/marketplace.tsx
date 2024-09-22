import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '@/components/marketplace/sidebar';
import Tab from '@/components/marketplace/tabs';
import ModelCard from '@/components/marketplace/modelCard';
import { Model } from '@/types/model';
import { marketplaceService } from '@/lib/services/marketplace';
import { ethers } from 'ethers';

const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Most popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeItem, setActiveItem] = useState('');
  const [walletBalance, setWalletBalance] = useState<number>(10);

  const tabs = ['Most popular', 'Most downloaded', 'Most liked', 'Recently updated'];

  const models: Model[] = [
    { 
      title: 'ChatGPT',     
      type: 'Chat Bots', 
      subtype: 'General Purpose',
      price: 0.0025, 
      reviews: [], 
      description: 'OpenAI chatbot',
      tags: ['AI', 'NLP', 'Conversational'],
      downloads: 782000,
      likes: 4200,
      lastUpdated: new Date(Date.now() - 2 * 86400000),
    },
    { 
      title: 'DALL-E 2',     
      type: 'AI Models', 
      subtype: 'Image Generation',
      price: 0.0028, 
      reviews: [], 
      description: 'AI image generation model',
      tags: ['AI', 'Image', 'Generation'],
      downloads: 500000,
      likes: 3800,
      lastUpdated: new Date(Date.now() - 7 * 86400000),
    },
    { 
      title: 'GPT-4',     
      type: 'Multimodal', 
      subtype: 'Auto Complete',
      price: 0.003, 
      reviews: [], 
      description: 'Advanced language model',
      tags: ['AI', 'NLP', 'Multimodal'],
      downloads: 650000,
      likes: 4500,
      lastUpdated: new Date(Date.now() - 9 * 86400000),
    },
    {
      title: 'Auto Completion',
      type: 'Text Completion',
      subtype: 'General Purpose',
      price: 0.0015,
      reviews: [],
      description: 'Auto-completion AI model for text-based tasks.',
      tags: ['AI', 'Text', 'Completion', 'NLP'],
      downloads: 500000,
      likes: 3200,
      lastUpdated: new Date(Date.now() - 5 * 86400000),
    },
    {
      title: 'Gemma 9B',
      type: 'Language Model',
      subtype: 'Medium-Sized Model',
      price: 0.0022,
      reviews: [],
      description: 'Gemma 9B is a medium-sized AI model optimized for performance and efficiency.',
      tags: ['AI', 'Gemma', 'NLP', 'Medium Model'],
      downloads: 450000,
      likes: 2900,
      lastUpdated: new Date(Date.now() - 6 * 86400000),
    },
    {
      title: 'Code Analysis',
      type: 'Code Analysis',
      subtype: 'Developer Tool',
      price: 0.0018,
      reviews: [],
      description: 'AI-powered code analysis tool for developers.',
      tags: ['AI', 'Code', 'Developer', 'Analysis'],
      downloads: 600000,
      likes: 3400,
      lastUpdated: new Date(Date.now() - 7 * 86400000),
    },
    {
      title: 'Llama Guard 3 8B',
      type: 'Language Model',
      subtype: 'Small-Scale Model',
      price: 0.0012,
      reviews: [],
      description: 'A smaller variant of Llama Guard designed for lightweight applications.',
      tags: ['AI', 'Guard', 'NLP', 'Small Model'],
      downloads: 380000,
      likes: 2200,
      lastUpdated: new Date(Date.now() - 8 * 86400000),
    },
    {
      title: 'Gemma 7B',
      type: 'Language Model',
      subtype: 'Small-Scale Model',
      price: 0.001,
      reviews: [],
      description: 'Gemma 7B is a compact model ideal for specific applications requiring lower latency.',
      tags: ['AI', 'Gemma', 'NLP', 'Small Model'],
      downloads: 300000,
      likes: 1800,
      lastUpdated: new Date(Date.now() - 9 * 86400000),
    },
    {
      title: 'Llama 3.1 70B',
      type: 'Language Model',
      subtype: 'Large Language Model',
      price: 0.0029,
      reviews: [],
      description: 'Meta AI\'s Llama 3.1 model with 70 billion parameters.',
      tags: ['AI', 'Large Model', 'NLP', 'Meta'],
      downloads: 920000,
      likes: 6500,
      lastUpdated: new Date(Date.now() - 10 * 86400000),
    },
    {
      title: 'Llama 3 70B',
      type: 'Language Model',
      subtype: 'Large Language Model',
      price: 0.0027,
      reviews: [],
      description: 'Meta AI\'s Llama 3 model with 70 billion parameters.',
      tags: ['AI', 'Large Model', 'NLP', 'Meta'],
      downloads: 900000,
      likes: 6300,
      lastUpdated: new Date(Date.now() - 1 * 86400000),
    }
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

  const handlePurchase = async (modelId: string, price: number) => {
    if (walletBalance < price) {
      alert('Insufficient balance!');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      await marketplaceService.buyToken(provider, modelId, price.toString());
      setWalletBalance(walletBalance - price);
      alert('Purchase successful!');
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed!');
    }
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
        
        {/* Wallet Button */}
        <div className="mb-4">
          <button className="bg-blue-600 px-4 py-2 rounded" disabled>
            Wallet: {walletBalance} ValidCoins
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedModels.map((model, index) => (
            <ModelCard 
              key={model.title + index} 
              model={model} 
              onPurchase={() => handlePurchase(index.toString(), model.price)} // Pass model price for purchase
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;