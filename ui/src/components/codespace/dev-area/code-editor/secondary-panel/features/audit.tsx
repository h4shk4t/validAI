import { useState, useEffect } from "react";
import ContractAnalysis from "@/components/agents/contractAnalysis";
import { useCodespaceStore } from "@/lib/stores/codespace-store";

const Audit = () => {
  const { currentFileContent } = useCodespaceStore();
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileContent = async () => {
      setFileContent(currentFileContent);
    };

    if (currentFileContent) {
      fetchFileContent();
    }
  }, [currentFileContent]);

  return (
    <div>
      {fileContent && (
        <ContractAnalysis code={fileContent} onClose={() => {}} />
      )}
    </div>
  );
};

export default Audit;
