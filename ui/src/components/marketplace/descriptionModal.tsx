import React from 'react';
import { FiDownload, FiMessageSquare, FiStar, FiX } from 'react-icons/fi';

interface DescriptionModalProps {
  model: {
    title: string;
    description: string;
    image: string;
    price: number;
    category: string;
    downloads: number;
    comments: number;
    rating: number;
    lastUpdated: Date;
  };
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({ model }) => {

  return (
    <div className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center">
      <div className="bg-card rounded-lg p-6 w-full z-50 max-w-5xl text-foreground flex flex-col h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Subscribe to the model</h2>
        </div>
        <div className="flex-grow overflow-y-auto">
          <div className="flex mb-4">
            <img src={model.image} alt={model.title} className="w-32 h-32 object-cover rounded-lg mr-4" />
            <div>
              <h3 className="text-xl font-semibold mb-2">{model.title}</h3>
              <p className="text-muted-foreground mb-2">{model.category}</p>
              <p className="text-muted-foreground text-sm mb-2">Updated 5 days ago</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FiDownload className="mr-1" />
                  <span>{model.downloads}</span>
                </div>
                <div className="flex items-center">
                  <FiMessageSquare className="mr-1" />
                  <span>{model.comments}</span>
                </div>
                <div className="flex items-center">
                  <FiStar className="mr-1" />
                  <span>{model.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground">{model.description}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Reviews</h4>
            <div className="bg-muted rounded-lg p-4">
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">John Doe</span>
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span>4.5</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Posted on May 15, 2023</p>
              </div>
              <p className="text-muted-foreground">This model is fantastic! It has greatly improved my workflow and saved me hours of time.</p>
            </div>
            <div className="bg-muted rounded-lg p-4 mt-2">
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Jane Smith</span>
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span>5.0</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Posted on May 10, 2023</p>
              </div>
              <p className="text-muted-foreground">Absolutely love this model. It's intuitive, powerful, and exactly what I needed for my project.</p>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-card pt-4 mt-4 border-t border-muted">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">{model.price} ETH</span>
            <button className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;
