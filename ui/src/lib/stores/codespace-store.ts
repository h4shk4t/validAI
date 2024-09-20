import { TreeViewElement } from "@/components/ui/tree-view-api";
import { create } from "zustand";

interface CodespaceStore {
  homeFolderPath: string;
  files: TreeViewElement[];
  selectedFile: TreeViewElement | null;
  selectedFolderPath: string | null;
  filesChanged: boolean;

  setFolderPath: (homeFolderPath: string) => void;
  setFiles: (files: TreeViewElement[]) => void;
  setSelectedFile: (file: TreeViewElement) => void;
  setSelectedFolderPath: (folderPath: string) => void;
  setFilesChanged: (filesChanged: boolean) => void;
}

export const useCodespaceStore = create<CodespaceStore>((set) => ({
  homeFolderPath: "./repos/test",
  files: [],
  selectedFile: null,
  selectedFolderPath: null,
  filesChanged: false,

  setFolderPath: (homeFolderPath) => set({ homeFolderPath }),
  setFiles: (files) => set({ files }),
  setSelectedFile: (selectedFile) => set({ selectedFile }),
  setSelectedFolderPath: (selectedFolderPath) => set({ selectedFolderPath }),
  setFilesChanged: (filesChanged) => set({ filesChanged }),
}));
