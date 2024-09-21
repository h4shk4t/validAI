import React from 'react';
import { Download, Heart, Clock } from 'lucide-react';
import { Model } from '@/types/model';

interface ModelCardProps {

  model: Model;
}

const ModelCard: React.FC<ModelCardProps> = React.memo(({ model }) => {
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

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <img src="/api/placeholder/100/100" alt={model.title} className="w-full h-32 object-cover mb-2 rounded-md" />
      <h3 className="text-white font-semibold">{model.title}</h3>
      <p className="text-gray-400 text-sm">{model.type}</p>
      <p className="text-gray-400 text-sm flex items-center">
        <Clock size={14} className="mr-1" /> Updated {getTimeAgo(model.lastUpdated)}
      </p>
      <div className="flex justify-between text-gray-400 text-sm mt-2">
        <span className="flex items-center"><Download size={14} className="mr-1" /> {formatNumber(model.downloads)}</span>
        <span className="flex items-center"><Heart size={14} className="mr-1" /> {formatNumber(model.likes)}</span>
      </div>
      <div className="mt-2">
        {model.tags.map((tag) => (
          <span key={tag} className="inline-block bg-gray-600 text-xs text-gray-300 px-2 py-1 rounded-full mr-1 mb-1">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
});

ModelCard.displayName = 'ModelCard';

export default ModelCard;
