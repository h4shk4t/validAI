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
import { getFileContent } from "@/lib/api";
import { useCodespaceStore } from "@/lib/stores/codespace-store";

const CodeEditor = () => {
  const [value, setValue] = useState<string | undefined>("");
  const theme = JSON.parse(JSON.stringify(darcula));
  const { selectedFile } = useCodespaceStore();

  useEffect(() => {
    async function fetchContent() {
      const content = selectedFile
        ? await getFileContent(selectedFile.path)
        : "";
      setValue(content);
    }
    fetchContent();
  }, [selectedFile]);

  return (
    <ResizablePanelGroup direction="vertical" className="w-full border-b">
      <ResizablePanel defaultSize={75}>
        <ActiveFilesHeader />
        <Editor
          value={value}
          language="solidity"
          width={"100%"}
          height={"100%"}
          onChange={(value) => setValue(value)}
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
      <ResizablePanel defaultSize={25}>
        <SecondaryPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CodeEditor;
