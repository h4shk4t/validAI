import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ActiveFilesHeader from "./active-files-header";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import darcula from "./darcula.json";
import SecondaryPanel from "./secondary-panel";
import { getFileContent, saveFile } from "@/lib/api";
import { useCodespaceStore } from "@/lib/stores/codespace-store";
import { useDebounce } from "@/lib/hooks/useDebounce";

const CodeEditor = () => {
  const theme = JSON.parse(JSON.stringify(darcula));
  const { selectedFile, currentFileContent, setCurrentFileContent } = useCodespaceStore();

  const debouncedFileContent = useDebounce(currentFileContent, 500);
  useEffect(() => {
    async function saveContent() {
      if (debouncedFileContent && selectedFile) {
        await saveFile(selectedFile.path, debouncedFileContent); // Perform API call here
      }
    }
    saveContent();
  }, [debouncedFileContent]);

  useEffect(() => {
    async function fetchContent() {
      const content = selectedFile
        ? await getFileContent(selectedFile.path)
        : "";
      setCurrentFileContent(content);
    }
    fetchContent();
  }, [selectedFile]);

  return (
    <ResizablePanelGroup direction="vertical" className="w-full border-b">
      <ResizablePanel defaultSize={70}>
        <ActiveFilesHeader setFileContent={setCurrentFileContent} />
        <Editor
          value={currentFileContent}
          language="solidity"
          width={"100%"}
          height={"100%"}
          onChange={(fileContent) => setCurrentFileContent(fileContent)}
          theme="darcula"
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("darcula", theme);
          }}
          onMount={(_, monaco) => {
            monaco.editor.setTheme("darcula");
          }}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30}>
        <SecondaryPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CodeEditor;
