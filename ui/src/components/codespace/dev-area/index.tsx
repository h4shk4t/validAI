import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SideBar from "./sidebar";
import CodeEditor from "./code-editor";

const DevArea = () => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full border-b"
    >
      <ResizablePanel defaultSize={20}>
        <SideBar />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80}>
        <CodeEditor />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DevArea;
