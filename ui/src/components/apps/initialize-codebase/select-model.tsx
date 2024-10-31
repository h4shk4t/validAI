import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStepper } from "@/components/ui/stepper";
import { useCodespaceStore } from "@/lib/stores/codespace-store";
import { cn } from "@/lib/utils";
import { Model } from "@/types/model";
import { ChevronsRight, Heart, History } from "lucide-react";
import React, { useState } from "react";

interface SelectModelProps {
  step: number;
  setStep: (step: number) => void;
}

const SelectModel = (props: SelectModelProps) => {
  const { nextStep } = useStepper();

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

  const [search, setSearch] = useState("");
  const [modelsLoading, setModelsLoading] = useState(false);
  const { selectedModel, setSelectedModel } = useCodespaceStore();

  // fetch actual ones here
  const sampleSubsribedModels: Model[] = [
    {
      title: "EfficientNet B7",
      type: "Image Classification",
      subtype: "Convolutional Neural Network",
      price: 15.99,
      reviews: [
        { review: "Great accuracy and fast training times!", rating: 5 },
        {
          review:
            "Good for most image datasets, but struggles with ultra-high resolution images.",
          rating: 4,
        },
      ],
      description:
        "A state-of-the-art image classification model optimized for performance and accuracy on standard datasets.",
      tags: ["image", "classification", "CNN", "EfficientNet"],
      downloads: 2350,
      likes: 1800,
      lastUpdated: new Date("2024-08-15"),
    },
    {
      title: "GPT-3.5 Text Generator",
      type: "Natural Language Processing",
      subtype: "Transformer",
      price: 29.99,
      reviews: [
        {
          review: "Amazing generation capabilities, but a bit pricey.",
          rating: 4,
        },
        {
          review:
            "Handles context really well; perfect for chatbot applications.",
          rating: 5,
        },
      ],
      description:
        "A powerful language model capable of generating human-like text, ideal for chatbots, content creation, and more.",
      tags: ["text", "NLP", "transformer", "generation"],
      downloads: 4520,
      likes: 3950,
      lastUpdated: new Date("2024-09-10"),
    },
    {
      title: "YOLOv8 Object Detector",
      type: "Object Detection",
      subtype: "Real-Time Detection",
      price: 20.0,
      reviews: [
        {
          review:
            "Fast and reliable for detecting multiple objects in real time.",
          rating: 5,
        },
        {
          review: "Works well but sometimes misses smaller objects.",
          rating: 4,
        },
      ],
      description:
        "An advanced object detection model designed for high-speed, real-time applications, especially in video analysis.",
      tags: ["object detection", "real-time", "YOLO"],
      downloads: 3890,
      likes: 3200,
      lastUpdated: new Date("2024-10-20"),
    },
  ];

  const filteredModels = sampleSubsribedModels.filter((model) =>
    model.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tighter my-2 text-white">
        Select your Subscribed Model
      </h1>
      <Input
        placeholder="Search Models..."
        onChange={(e) => setSearch(e.target.value)}
      />
      {modelsLoading ? (
        <div className="h-[20rem] border-b border-secondary mt-4">
          Getting your Models...
        </div>
      ) : (
        <div className="space-y-2 mt-4 h-[20rem] overflow-scroll border-b-2 py-2 border-accent">
          {filteredModels.map((model) => (
            <div
              className={cn(
                "border p-3 rounded-md space-y-1 transition-all duration-150  hover:cursor-pointer hover:border-b-primary hover:-translate-y-[2px]",
                { "border-primary": model.title === selectedModel?.title }
              )}
              key={model.title}
              onClick={() => setSelectedModel(model)}
            >
              <p className="font-semibold text-white">{model.title}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {model.description}
              </p>
              <div className="flex flex-row items-center justify-between m">
                <p className="text-xs inline-flex items-center gap-1 text-amber-400">
                  <History size={12} /> Updated {getTimeAgo(model.lastUpdated)}
                </p>
                <p className="text-xs inline-flex items-center gap-1 text-red-400">
                  <Heart size={12} /> {formatNumber(model.likes)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex flex-row justify-end">
        <Button
          disabled={!selectedModel}
          onClick={() => {
            props.setStep(props.step + 1);
            nextStep();
          }}
        >
          Next <ChevronsRight className="ml-1" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default SelectModel;
