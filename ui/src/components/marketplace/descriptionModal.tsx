import React from 'react';

interface DescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: {
    title: string;
    description: string;
  };
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({ isOpen, onClose, model }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-semibold mb-2">{model.title}</h2>
        <p className="text-gray-700 mb-4">{model.description}</p>
        <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default DescriptionModal;
