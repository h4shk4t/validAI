import { Trash } from "lucide-react";
import React from "react";

const DeleteFile = () => {
  return (
    <div>
      <Trash className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground" />
    </div>
  );
};

export default DeleteFile;
