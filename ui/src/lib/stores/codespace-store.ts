import { TreeViewElement } from "@/components/ui/tree-view-api";
import { Model } from "@/types/model";
import { create } from "zustand";

interface CodespaceStore {
  hasOnboarded: boolean;
  selectedModel: Model | null;
  currentFileContent: string | undefined;
  homeFolderPath: string;
  files: TreeViewElement[];
  openedFiles: TreeViewElement[];
  selectedFile: TreeViewElement | null;
  selectedFolderPath: string | null;
  filesChanged: boolean;

  setHasOnboarded: (hasOnboarded: boolean) => void;
  setSelectedModel: (selectedModel: Model | null) => void;
  setCurrentFileContent: (currentFileContent: string | undefined) => void;
  setFolderPath: (homeFolderPath: string) => void;
  setFiles: (files: TreeViewElement[]) => void;
  appendOpenFiles: (file: TreeViewElement) => void;
  removeOpenFile: (file: TreeViewElement) => void;
  setSelectedFile: (file: TreeViewElement | null) => void;
  setSelectedFolderPath: (folderPath: string) => void;
  setFilesChanged: (filesChanged: boolean) => void;
}

export const useCodespaceStore = create<CodespaceStore>((set) => ({
  hasOnboarded: false,
  selectedModel: null,
  currentFileContent: "",
  homeFolderPath: "",
  files: [],
  openedFiles: [],
  selectedFile: null,
  selectedFolderPath: null,
  filesChanged: false,

  setHasOnboarded: (hasOnboarded) => set({ hasOnboarded }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  setCurrentFileContent: (currentFileContent) => set({ currentFileContent }),
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
