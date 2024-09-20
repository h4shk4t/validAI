import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ActiveFilesHeader from "./active-files-header";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import darcula from "./darcula.json";
import SecondaryPanel from "./secondary-panel";

const CodeEditor = () => {
  const [value, setValue] = useState<string | undefined>("");
  const theme = JSON.parse(JSON.stringify(darcula));

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
