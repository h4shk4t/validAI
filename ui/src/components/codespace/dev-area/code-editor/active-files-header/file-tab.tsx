import { TreeViewElement } from "@/components/ui/tree-view-api";
import { useCodespaceStore } from "@/lib/stores/codespace-store";
import { getMaterialFileIcon } from "file-extension-icon-js";
import { X } from "lucide-react";

const FileTab = ({
  file,
  isActive,
  setActiveFileContent,
}: {
  file: TreeViewElement;
  isActive: boolean;
  setActiveFileContent: (content: string) => void,

}) => {
  const { setSelectedFile, removeOpenFile } = useCodespaceStore();
  return (
    <button
      className={`text-sm h-full w-32 border-r inline-flex items-center px-2 justify-between ${
        isActive && "bg-[#282A36]"
      }`}
      onClick={() => setSelectedFile(file)}
    >
      <div className="inline-flex gap-1">
        <img
          src={getMaterialFileIcon(`${file.name}`)}
          width={16}
          height={16}
          alt={file.name}
        />
        {file.name}
      </div>
      {isActive ? (
        <X
          onClick={() => {
            removeOpenFile(file);
            setActiveFileContent("");
          }}
          className="w-4 h-4 ml-2 hover:text-white"
        />
      ) : null}
    </button>
  );
};

export default FileTab;
