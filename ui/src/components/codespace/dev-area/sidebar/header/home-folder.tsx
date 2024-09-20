import DeleteFile from "./folder-actions/delete-file";
import NewFile from "./folder-actions/new-file";

const HomeFolder = () => {
  return (
    <div className="mx-2 flex flex-row justify-between items-center flex-1">
      HomeFolder
      <div className="flex flex-row gap-2">
        <NewFile />
        <DeleteFile />
      </div>
    </div>
  );
};

export default HomeFolder;
