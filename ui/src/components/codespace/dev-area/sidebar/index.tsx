import { Folder, GitBranch, Settings } from "lucide-react";
import VersionControl from "./features/version-control";
import CodespaceSettings from "./features/codespace-settings";
import FileTree from "./features/file-tree";
import Header from "./header";
import { useState } from "react";

interface feature {
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const SideBar = () => {
  const iconClass = "w-5";
  const features: feature[] = [
    {
      label: "Files",
      icon: <Folder className={iconClass} />,
      component: <FileTree />,
    },
    {
      label: "Version Control",
      icon: <GitBranch className={iconClass} />,
      component: <VersionControl />,
    },
    {
      label: "Settings",
      icon: <Settings className={iconClass} />,
      component: <CodespaceSettings />,
    },
  ];

  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0);

  return (
    <div className="h-full flex flex-col" id="over">
      <Header />
      <div className="border-b flex-1 flex flex-row">
        <div className="flex flex-col h-full w-12 border-r">
          {features.map((feature, index) => (
            <div
              className={`
              flex flex-row justify-center
              py-3 text-muted-foreground
              transition-all duration-200
              hover:cursor-pointer hover:text-foreground hover:bg-muted
              ${activeFeatureIndex === index && "bg-muted !text-foreground"}
            `}
              onClick={() => {
                setActiveFeatureIndex(index);
              }}
              key={feature.label}
            >
              {feature.icon}
            </div>
          ))}
        </div>
        {features[activeFeatureIndex].component}
      </div>
    </div>
  );
};

export default SideBar;
