import { useState, useRef, useEffect } from "react";
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
import Markdown from "react-markdown";
import indexes from "./indexes.json";
import { requestRag } from "@/lib/api";

interface ReferenceFile {
  [key: string]: string;
}

const Chat = () => {
  const [query, setQuery] = useState<string>("");
  const [thinking, setThinking] = useState(false);
  const [output, setOutput] = useState("Hello! How can I help you today?");

  const [referenceFiles, setReferenceFiles] = useState<ReferenceFile[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setThinking(true);
    setQuery("Thinking...");
    const { answer, referencedFiles } = await requestRag(query);
    setOutput(answer);
    setReferenceFiles(referencedFiles);
    setThinking(false);
    setQuery("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="grid grid-cols-4 gap-4 h-full w-full">
      <div className="col-span-3 overflow-y-auto border-r h-full">
        <Markdown className="text-sm font-mono p-2 whitespace-pre-wrap">
          {output}
        </Markdown>
      </div>
      <div className="col-span-1 overflow-y-auto h-full">
        <div className="bg-card p-2">
          <p className="font-medium text-muted-foreground tracking-tight">
            References
          </p>
          <div className="flex flex-col gap-1 pb-8 pt-2">
            {Object.keys(referenceFiles).map((fileName, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="text-sm tracking-tight bg-background border hover:bg-secondary-foreground hover:cursor-pointer px-2 py-1 inline-flex items-center">
                    <File className="w-4 mr-2" />
                    {fileName}
                  </div>
                </DialogTrigger>
                <DialogContent className="min-w-[40rem]">
                  <DialogHeader>
                    <DialogTitle>{fileName}</DialogTitle>
                  </DialogHeader>
                  <div className="h-[36rem] overflow-y-auto">
                    <Markdown className="whitespace-pre-wrap text-sm bg-white/5 rounded-md p-2">
                      {referenceFiles[fileName]}
                    </Markdown>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
      {/* </div>
      </div> */}

      <div
        className={`
        flex flex-row items-center gap-2 w-full border-t py-1 bg-muted
        absolute bottom-0 left-0 right-0
        ${thinking && "opacity-60 cursor-wait"}
      `}
      >
        <DocSupportMenu />
        <MessageCircle className="w-3 h-3" />
        <form className="flex-1" onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            disabled={thinking}
            placeholder="Ask anything..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full outline-none tracking-tight bg-muted"
          />
        </form>
      </div>
    </div>
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
