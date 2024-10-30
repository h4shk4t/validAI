import { create } from "zustand";
import { Thread, Bubble, AiResponse } from "@/lib/types";

type ChatStore = {
  userInput: string;
  thread: Thread;
  setUserInput: (input: string) => void;
  addBubble: (bubble: Bubble) => void;
  addAiLoadingBubble: () => void;
  showAiResponse: (response: AiResponse[]) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  userInput: "",
  thread: [{
    sender: "ai",
    data: {
      isLoading: false,
      response: [{
        answer: "Hello! How may I help you today?",
        referencedFiles: [],
      }],
    },
  }],
  setUserInput: (input) => set({ userInput: input }),
  addBubble: (bubble) =>
    set((state) => ({ thread: [...state.thread, bubble] })),
  addAiLoadingBubble: () =>
    set((state) => ({
      thread: [
        ...state.thread,
        {
          sender: "ai",
          data: {
            isLoading: true,
            response: null,
          },
        },
      ],
    })),
  showAiResponse: (response) => {
    set((state) => {
      const newThread = [...state.thread];
      newThread[newThread.length - 1] = {
        sender: "ai",
        data: {
          isLoading: false,
          response: response,
        },
      };
      return { thread: newThread };
    });
  }
}));
