import { TreeViewElement } from "@/components/ui/tree-view-api";
import { create } from "zustand";

interface CodespaceStore {
  homeFolderPath: string;
  files: TreeViewElement[];
  openedFiles: TreeViewElement[];
  selectedFile: TreeViewElement | null;
  selectedFolderPath: string | null;
  filesChanged: boolean;

  setFolderPath: (homeFolderPath: string) => void;
  setFiles: (files: TreeViewElement[]) => void;
  appendOpenFiles: (file: TreeViewElement) => void;
  removeOpenFile: (file: TreeViewElement) => void;
  setSelectedFile: (file: TreeViewElement | null) => void;
  setSelectedFolderPath: (folderPath: string) => void;
  setFilesChanged: (filesChanged: boolean) => void;
}

export const useCodespaceStore = create<CodespaceStore>((set) => ({
  homeFolderPath: "./repos/test",
  files: [],
  openedFiles: [],
  selectedFile: null,
  selectedFolderPath: null,
  filesChanged: false,

  setFolderPath: (homeFolderPath) => set({ homeFolderPath }),
  setFiles: (files) => set({ files }),
  appendOpenFiles: (file) =>
    set((state) => {
      if (!state.openedFiles.some((f) => f.id === file.id)) {
        return { openedFiles: [...state.openedFiles, file] };
      }
      return state;
    }),
  removeOpenFile: (file) =>
    set((state) => ({
      openedFiles: state.openedFiles.filter((f) => f.id !== file.id),
    })),
  setSelectedFile: (selectedFile) => set({ selectedFile }),
  setSelectedFolderPath: (selectedFolderPath) => set({ selectedFolderPath }),
  setFilesChanged: (filesChanged) => set({ filesChanged }),
}));
