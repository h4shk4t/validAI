import { Feature } from "@/lib/types";
import { Bot, Bug, TerminalIcon } from "lucide-react";
import { useState } from "react";
import Terminal from "./features/terminal";
import Audit from "./features/audit";
import Chat from "./features/chat";
import { Button } from "@/components/ui/button";

const SecondaryPanel = () => {
  const iconClass = "w-4";
  const features: Feature[] = [
    {
      label: "Terminal",
      icon: <TerminalIcon className={iconClass} />,
      component: <Terminal />,
    },
    {
      label: "Chat",
      icon: <Bot className={iconClass} />,
      component: <Chat />,
    },
    {
      label: "Audit",
      icon: <Bug className={iconClass} />,
      component: <Audit />,
    },
  ];

  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-10">
        <div className="flex flex-row gap-2">
          {features.map((feature, index) => (
            <Button
              size={"sm"}
              key={index}
              variant={activeFeatureIndex === index ? "active" : "linkHover2"}
              className="text-xs flex flex-row items-center gap-1"
              onClick={() => setActiveFeatureIndex(index)}
            >
              {feature.icon} {feature.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="w-full px-2 flex-1">
        {features[activeFeatureIndex].component}
      </div>
    </div>
  );
};

export default SecondaryPanel;
