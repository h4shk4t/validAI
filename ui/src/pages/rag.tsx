import { Thread } from "@/components/rag-chat/thread";
import { AiInput } from "@/components/rag-chat/ai-input";
const Rag = () => {
  return (
    <div className="flex flex-col w-[60%] min-w-[24rem] mx-auto h-screen border-l border-r border-t">
      <header className="bg-background px-4 py-3 flex items-center justify-between mt-2 border-b">
        <h1 className="text-3xl font-bold text-white">Rag</h1>
      </header>
      <Thread />
      <AiInput />
    </div>
  );
};

export default Rag;
