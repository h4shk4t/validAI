import { useCodespaceStore } from "@/lib/stores/codespace-store";
import FileTab from "./file-tab";
import { useEffect } from "react";

interface ActiveFilesHeaderProps {
  setFileContent: (content: string) => void;
}

const ActiveFilesHeader = (props: ActiveFilesHeaderProps) => {
  const { openedFiles, selectedFile } = useCodespaceStore();
  useEffect(() => {
    console.log(openedFiles);
  }, [openedFiles]);

  return (
    <div className="w-[75%] h-10 border-b flex flex-row flex-wrap items-center overflow-x-scroll">
      {openedFiles.map((file) => (
        <FileTab
          setActiveFileContent={props.setFileContent}
          key={file.path}
          file={file}
          isActive={selectedFile?.id === file.id}
        />
      ))}
    </div>
  );
};

export default ActiveFilesHeader;
