import React from 'react';
import { FiDownload, FiMessageSquare, FiStar, FiX } from 'react-icons/fi';

interface DescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: {
    title: string;
    description: string;
    image: string;
    price: number;
    category: string;
    downloads: number;
    comments: number;
    rating: number;
  };
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({ isOpen, onClose, model }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#040B1B] rounded-lg p-6 w-full z-50 max-w-5xl text-white flex flex-col h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Get the model</h2>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          <div className="flex mb-4">
            <img src={model.image} alt={model.title} className="w-32 h-32 object-cover rounded-lg mr-4" />
            <div>
              <h3 className="text-xl font-semibold mb-2">{model.title}</h3>
              <p className="text-gray-400 mb-2">{model.category}</p>
              <p className="text-gray-500 text-sm mb-2">Updated 5 days ago</p>
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
            <p className="text-gray-300">{model.description}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Reviews</h4>
            <div className="bg-[#0D1829] rounded-lg p-4">
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">John Doe</span>
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span>4.5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">Posted on May 15, 2023</p>
              </div>
              <p className="text-gray-300">This model is fantastic! It has greatly improved my workflow and saved me hours of time.</p>
            </div>
            <div className="bg-[#0D1829] rounded-lg p-4 mt-2">
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Jane Smith</span>
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span>5.0</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">Posted on May 10, 2023</p>
              </div>
              <p className="text-gray-300">Absolutely love this model. It's intuitive, powerful, and exactly what I needed for my project.</p>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-[#040B1B] pt-4 mt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">{model.price} ETH</span>
            <button className="bg-[#59A4E5] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;
