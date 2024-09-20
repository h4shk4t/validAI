import { deleteFile } from "@/lib/api";
import { useCodespaceStore } from "@/lib/stores/codespace-store";
import { Trash } from "lucide-react";

const DeleteFile = () => {
  const { selectedFile, setFilesChanged, openedFiles, removeOpenFile, setCurrentFileContent } =
    useCodespaceStore();
  return (
    <button
      onClick={async () => {
        if (selectedFile) {
          if (openedFiles.find((file) => file.id === selectedFile.id)) {
            removeOpenFile(selectedFile);
            setCurrentFileContent("");
          }
          deleteFile(selectedFile.path);
          setFilesChanged(true);
        }
      }}
    >
      <Trash className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground" />
    </button>
  );
};

export default DeleteFile;
