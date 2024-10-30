import { Thread } from "@/components/rag-chat/thread";
import { AiInput } from "@/components/rag-chat/ai-input";
export default function Rag() {
  return (
    <>
      <div className="flex flex-col max-w-[48rem] w-[60%] min-w-[24rem] mx-auto h-screen">
        <header className="bg-background px-4 py-3 flex items-center justify-between">
          <h1 className="text-3xl font-bold">RAG</h1>
        </header>
        <Thread />
        <AiInput />
      </div>
    </>
  );
}
