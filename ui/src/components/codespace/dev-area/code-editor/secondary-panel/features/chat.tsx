import { useState } from "react";
import { File, MenuIcon, MessageCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Markdown from "react-markdown";
import indexes from "./indexes.json";

interface ReferenceFile {
  name: string;
  path: string;
}

const Chat = () => {
  const [query, setQuery] = useState<string>("");
  const [output, setOutput] = useState("Hello! How can I help you today?");
  const [referenceFiles, setReferenceFiles] = useState<ReferenceFile[]>([
    { name: "Introduction.md", path: "/user/docs/Introduction.md" },
    { name: "GettingStarted.md", path: "/user/docs/GettingStarted.md" },
    { name: "Changelog.md", path: "/user/docs/Changelog.md" },
    { name: "FAQ.md", path: "/user/docs/FAQ.md" },
    { name: "InstallationGuide.md", path: "/user/docs/InstallationGuide.md" },
  ]);

  const [loading, setLoading] = useState(false); // State for loading
  const [fileContent, setFileContent] = useState<string>(""); // State for file content

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(query);
  };

  const fetchFileContent = async (filePath: string) => {
    setLoading(true);
    try {
      const response = await fetch(filePath);
      const content = await response.text();
      setFileContent(content);
    } catch (error) {
      console.error("Error fetching file:", error);
      setFileContent("Error loading file content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="w-full border-b">
        <ResizablePanel defaultSize={80}>
          <Markdown className="text-sm font-mono p-2 whitespace-pre">
            {output}
          </Markdown>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="h-full overflow-scroll" defaultSize={20}>
          <div className="bg-card p-2">
            <p className="font-medium text-muted-foreground tracking-tight">
              References
            </p>
            <div className="flex flex-col gap-1">
              {referenceFiles.map((file) => (
                <Dialog key={file.name}>
                  <DialogTrigger asChild>
                    <div
                      className="text-sm tracking-tight bg-background border hover:bg-secondary-foreground hover:cursor-pointer px-2 py-1 inline-flex items-center"
                      onClick={() => fetchFileContent(file.path)} // Fetch file content on click
                    >
                      <File className="w-4 mr-2" />
                      {file.name}
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{file.name}</DialogTitle>
                    </DialogHeader>
                    <div className="h-64 overflow-y-scroll">
                      {loading ? (
                        <div>Loading file content...</div> // Show loading state
                      ) : (
                        <Markdown className="text-sm font-mono whitespace-pre">
                          {fileContent}
                        </Markdown>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="flex flex-row items-center gap-2 w-full border-t py-1 bg-muted absolute bottom-0">
        <DocSupportMenu />
        <MessageCircle className="w-3 h-3" />
        <form className="flex-1" onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            placeholder="Ask anything..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full outline-none tracking-tight bg-muted"
          />
        </form>
      </div>
    </>
  );
};

const DocSupportMenu = () => {
  const addSupport = () => {
    console.log("Adding support");
  };
  return (
    <Popover>
      <PopoverTrigger>
        <button className="w-6 h-6 ml-1 bg-background rounded-md flex justify-center items-center">
          <MenuIcon className="w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col max-w-[240px]">
        <div className="w-full font-semibold mb-2">Supported Indexes</div>
        <div className="flex flex-col gap-1">
          {Object.values(indexes).map((index) => (
            <div className="py-1 text-sm tracking-tight bg-muted px-2 rounded-md">
              {index.name}
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground pt-4 border-t mb-1">
          Add Support
        </p>
        <form
          onSubmit={addSupport}
          className="flex flex-row items-center gap-1 w-full"
        >
          <input
            type="text"
            placeholder="Paste docs link"
            className="flex-1 text-sm outline-none bg-input rounded-md px-2 py-1"
          />
          <button className="w-6 h-6 ml-1 bg-primary text-primary-foreground rounded-md flex justify-center items-center">
            <Plus className="w-3 h-3" />
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default Chat;
