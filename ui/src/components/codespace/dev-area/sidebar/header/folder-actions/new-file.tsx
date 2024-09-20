import { useCodespaceStore } from "@/lib/stores/codespace-store";
import { FilePlus2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createFile } from "@/lib/api";

const NewFile = () => {
  const { homeFolderPath, selectedFolderPath, setFilesChanged } =
    useCodespaceStore();
  const [newFileName, setNewFileName] = useState<string>("");

  const currentFolderPath = selectedFolderPath
    ? selectedFolderPath
    : homeFolderPath;
  const currentFolderName = currentFolderPath.split("/").at(-1);

  const handleNewFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`${currentFolderPath}/${newFileName}`)
    await createFile(`${currentFolderPath}/${newFileName}`);
    setFilesChanged(true);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <FilePlus2 className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground" />
      </PopoverTrigger>
      <PopoverContent className="text-xs p-0">
        <form onSubmit={handleNewFile}>
          <Input
            type="text"
            className="h-auto text-xs"
            placeholder={`New file in "${currentFolderName}" folder`}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default NewFile;
