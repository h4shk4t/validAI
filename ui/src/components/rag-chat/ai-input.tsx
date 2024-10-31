import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useChatStore } from "@/lib/stores/chat-store";

export function AiInput() {
  const { setUserInput, addBubble } = useChatStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.compose.value;
    addBubble({ sender: "user", data: input });
    setUserInput(input);
    e.currentTarget.reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full flex flex-row pb-4 gap-2 px-2">
          <Input
            className="rounded-full text-sm tracking-tight bg-background/30 backdrop-blur-md"
            placeholder="Ask Something..."
            id="compose"
          />
          <Button
            type="submit"
            size={"icon"}
            variant={"gooeyRight"}
            className="rounded-full"
          >
            <Send className="w-4 h-4" />
          </Button>
      </form>
    </>
  );
}
