import React, { useState } from 'react';
import { Download, Heart, Clock } from 'lucide-react';
import { Model } from '@/types/model';
import DescriptionModal from './descriptionModal';
import { Dialog, DialogContent } from '../ui/dialog';

interface ModelCardProps {
  model: Model;
}

const ModelCard: React.FC<ModelCardProps> = React.memo(({ model }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatNumber = (num: number): string => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };

  const getTimeAgo = (date: Date): string => {
    const diff = (new Date().getTime() - date.getTime()) / 1000;
    const days = Math.floor(diff / 86400);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    const hours = Math.floor(diff / 3600);
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const minutes = Math.floor(diff / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="p-4 rounded-lg cursor-pointer" onClick={handleCardClick}>
        <img src="/api/placeholder/100/100" alt={model.title} className="w-full h-32 object-cover mb-2 rounded-md" />
        <h3 className="font-semibold mb-2 text-[20px]">{model.title}</h3>
        <p className="text-[#797F8C] text-sm mb-2">{model.type}</p>
        <p className="text-[#797F8C] text-sm flex items-center mb-2">
          <Clock size={14} className="mr-1" /> Updated {getTimeAgo(model.lastUpdated)}
        </p>
        <div className="flex justify-between text-[#797F8C] text-sm mb-2">
          <span className="flex items-center text-[#77BAF4]"><Download size={14} className="mr-1" color="#77BAF4" /> {formatNumber(model.downloads)}</span>
          <span className="flex items-center text-[#D38C14]"><Heart size={14} className="mr-1" fill="#D38C14" /> {formatNumber(model.likes)}</span>
        </div>
        <div>
          {model.tags.map((tag) => (
            <span key={tag} className="inline-block text-xs text-[#89919C] px-3 py-1 rounded-full mr-2 mb-2 bg-[#1F2937]">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DescriptionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            model={{
              title: model.title,
              description: model.description,
              image: '/api/placeholder/100/100', // Using placeholder image
              price: model.price,
              category: model.type, // Assuming 'type' is equivalent to 'category'
              downloads: model.downloads,
              comments: 0, // Add a default value or fetch from model if available
              rating: 0, // Add a default value or fetch from model if available
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );

});

ModelCard.displayName = 'ModelCard';

export default ModelCard;
