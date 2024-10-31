import { Thread } from "@/components/rag-chat/thread";
import { AiInput } from "@/components/rag-chat/ai-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MenuIcon, Plus } from "lucide-react";
import indexes from "./indexes.json";

const ChatBot = () => {
  return (
    <div className="flex flex-col w-[60%] min-w-[24rem] mx-auto h-full max-h-[calc(100vh-3rem)] border-l border-r border-t">
      <header className="bg-background px-4 py-3 flex items-center justify-between mt-2 border-b">
        <h1 className="text-3xl font-bold text-white">ChatBot</h1>
        <DocSupportMenu />
      </header>
      <Thread />
      <AiInput />
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
        <button className="ml-1 bg-background rounded-md flex justify-center items-center">
          <MenuIcon className="w-6" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col max-w-[260px]">
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
          className="flex flex-row items-center w-full"
        >
          <input
            type="text"
            placeholder="Paste docs link"
            className="text-sm flex-1 outline-none bg-input rounded-md px-2 py-1"
          />
          <button className="w-6 h-6 ml-1 bg-primary text-primary-foreground rounded-md flex justify-center items-center">
            <Plus className="w-3 h-3" />
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default ChatBot;
