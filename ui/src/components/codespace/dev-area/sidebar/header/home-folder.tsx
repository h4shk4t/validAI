import { useCodespaceStore } from "@/lib/stores/codespace-store";
import DeleteFile from "./folder-actions/delete-file";
import NewFile from "./folder-actions/new-file";

const HomeFolder = () => {
  const { homeFolderPath } = useCodespaceStore();
  const homeFolderName = homeFolderPath.split("/").at(-1);
  return (
    <div className="mx-2 flex flex-row justify-between items-center flex-1">
      <p className="text-sm font-semibold">{homeFolderName?.toUpperCase()}</p>
      <div className="flex flex-row gap-2">
        <NewFile />
        <DeleteFile />
      </div>
    </div>
  );
};

export default HomeFolder;
