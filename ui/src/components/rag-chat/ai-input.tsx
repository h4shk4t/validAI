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
      <form onSubmit={handleSubmit}>
          <Input
            className="rounded-full text-xs bg-background/30 backdrop-blur-md"
            placeholder="Ask Something.."
            id="compose"
          />
          <Button
            type="submit"
            size={"icon"}
            variant={"gooeyRight"}
            className="absolute float-end rounded-full mr-1"
          >
            <Send className="w-4 h-4" />
          </Button>
      </form>
    </>
  );
}
