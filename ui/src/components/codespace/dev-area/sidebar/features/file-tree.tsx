import { TreeItem } from "@/components/ui/tree-view";
import {
  CollapseButton,
  Tree,
  TreeViewElement,
} from "@/components/ui/tree-view-api";
import { getFileTree } from "@/lib/api";
import { useCodespaceStore } from "@/lib/stores/codespace-store";
import { useEffect } from "react";

const FileTree = () => {
  const { homeFolderPath, files, setFiles, filesChanged, setFilesChanged } =
    useCodespaceStore();

  useEffect(() => {
    const fetchFiles = async () => {
      const data = await getFileTree(homeFolderPath);
      setFiles(data);
      setFilesChanged(false);
    };
    fetchFiles();
  }, [filesChanged]);

  return (
    <Tree className="w-full bg-card rounded-md" indicator={true}>
      <div className="w-full p-2">
        {files.map((element: TreeViewElement, _) => (
          <TreeItem key={element.id} elements={[element]} />
        ))}
      </div>
      <CollapseButton elements={files} expandAll={true} />
    </Tree>
  );
};

export default FileTree;
