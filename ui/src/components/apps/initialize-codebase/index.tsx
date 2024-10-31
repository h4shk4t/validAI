import React, { useState } from "react";
import { Step, Stepper, type StepItem } from "@/components/ui/stepper";
import { useCodespaceStore } from "@/lib/stores/codespace-store";
import ChooseModelImg from "@/assets/choose-model.svg";
import ChooseRepoImg from "@/assets/choose-repo.svg";
import SelectModel from "./select-model";
import SelectRepo from "./select-repo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const InitializeCodebase = () => {
  const steps = [
    { label: "Select Model" },
    { label: "Select Repository" },
  ] satisfies StepItem[];

  const stepMetadata = [
    { label: "Select model to use", img: ChooseModelImg },
    { label: "Select Your Repo", img: ChooseRepoImg },
  ];

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

  const [step, setStep] = useState(0);
  const { hasOnboarded } = useCodespaceStore();

  return (
    <div className="flex w-full h-full gap-4">
      <div className="w-[40%] flex items-center flex-col justify-center">
        <img src={stepMetadata[step].img} className="h-[300px]" alt="Sign Up" />
        <p className="text-lg tracking-tight mt-8">{stepMetadata[step].label}</p>
      </div>
      <div className="flex flex-col gap-4 w-[56%] my-0 ms-auto justify-center">
        <Stepper
          initialStep={0}
          steps={steps}
          className="w-[60%] justify-start"
        >
          {steps.map(({ label }, index) => {
            return (
              <Step key={label} label={label}>
                <div className="w-[64%]">
                  {index == 0 && (
                    <SelectModel
                      step={step}
                      setStep={setStep}
                      subscribedModels={sampleSubsribedModels}
                    />
                  )}
                  {index == 1 && <SelectRepo step={step} setStep={setStep} />}
                </div>
              </Step>
            );
          })}
          {hasOnboarded && (
            <Card className="bg-background w-[64%] h-[20rem] border-none">
              <CardHeader>
                <CardTitle>You are now ready to use AkashPay!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You have completed all the steps required to use AkashPay. Now
                  login into the dashboard.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Link to="/login">
                  <Button size={"lg"}>Login</Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </Stepper>
      </div>
    </div>
  );
};

export default InitializeCodebase;
