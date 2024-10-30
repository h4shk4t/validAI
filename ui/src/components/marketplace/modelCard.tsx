import React, { useState } from "react";
import { Download, Heart, Clock } from "lucide-react";
import { Model } from "@/types/model";
import DescriptionModal from "./descriptionModal";
import { Dialog, DialogContent } from "../ui/dialog";
import { ethers } from "ethers";
import { marketplaceService } from "@/lib/services/marketplace";
import { Button } from "../ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface ModelCardProps {
  model: Model;
  onPurchase: () => Promise<void>;
}

const ModelCard: React.FC<ModelCardProps> = React.memo(({ model }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatNumber = (num: number): string => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };

  const getTimeAgo = (date: Date): string => {
    const diff = (new Date().getTime() - date.getTime()) / 1000;
    const days = Math.floor(diff / 86400);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    const hours = Math.floor(diff / 3600);
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const minutes = Math.floor(diff / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleBuyClick = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        await provider.send("eth_requestAccounts", []);
        const modelId = model.title; // Use a unique ID for the model
        const amount = ethers.utils.parseUnits(model.price.toString(), 18); // Adjust decimals as needed
        await marketplaceService.buyToken(provider, modelId, amount.toString());
        alert(
          `Successfully purchased ${model.title} for ${model.price} ValidCoin.`
        );
      } catch (error) {
        console.error(error);
        alert("Purchase failed. Please try again.");
      }
    } else {
      alert("Please install MetaMask or another Web3 provider.");
    }
  };

  return (
    <>
      <div
        className="p-4 rounded-lg cursor-pointer bg-card border"
        onClick={handleCardClick}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/2048px-ChatGPT_logo.svg.png"
          alt={model.title}
          className="w-full h-32 object-cover mb-2 rounded-md"
        />
        <h3 className="font-semibold mb-2 text-lg text-title">{model.title}</h3>
        <p className="text-muted-foreground text-sm mb-2">{model.type}</p>
        <p className="text-muted-foreground text-sm flex items-center mb-2">
          <Clock size={14} className="mr-1" /> Updated{" "}
          {getTimeAgo(model.lastUpdated)}
        </p>
        <div className="flex justify-between text-muted-foreground text-sm mb-2">
          <span className="flex items-center text-white">
            <Download size={14} className="mr-1" color="currentColor" />{" "}
            {formatNumber(model.downloads)}
          </span>
          <span className="flex items-center text-red-400">
            <Heart size={14} className="mr-1" fill="currentColor" />{" "}
            {formatNumber(model.likes)}
          </span>
        </div>
        <div>
          {model.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block text-xs text-accent-foreground bg-accent px-3 py-1 rounded-full mr-2 mb-2 "
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-row justify-between items-center">
          <span className="text-2xl font-bold text-accent-foreground">
            ${model.price}
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"lg"} onClick={handleBuyClick}>
                Buy
              </Button>
            </DialogTrigger>
            <DialogContent className="[&>button]:hidden">
              <DescriptionModal
                // onClose={() => setIsModalOpen(false)}
                model={{
                  title: model.title,
                  description: model.description,
                  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/2048px-ChatGPT_logo.svg.png", // Using placeholder image
                  price: model.price,
                  category: model.type, // Assuming 'type' is equivalent to 'category'
                  downloads: model.downloads,
                  comments: 0, // Add a default value or fetch from model if available
                  rating: 0, // Add a default value or fetch from model if available
                  lastUpdated: model.lastUpdated, // Ensure lastUpdated is included
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
});

ModelCard.displayName = "ModelCard";

export default ModelCard;
