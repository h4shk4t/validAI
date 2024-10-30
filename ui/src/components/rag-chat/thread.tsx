import { UserBubble, AiBubble } from "./bubble";
import styles from "./chat.module.css";
import { useChatStore } from "@/lib/stores/chat-store";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { requestRag } from "@/lib/api";
import { useRef } from "react";

export function Thread() {
  const { userInput, thread, addAiLoadingBubble, showAiResponse } =
    useChatStore();
  const threadRef = useRef<HTMLDivElement | null>(null);
  const hasBeenRendered = useRef(false);

  useEffect(() => {
    async function fetchResponse() {
      if (hasBeenRendered.current) {
        addAiLoadingBubble();
        const res = await requestRag(userInput);
        const { answer, referencedFiles } = res;
        showAiResponse([{ answer, referencedFiles }]);
      }
      hasBeenRendered.current = true;
    }
    fetchResponse();
  }, [userInput]);

  // Scroll to the bottom of the thread when a new message is added
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.addEventListener("DOMNodeInserted", (e) => {
        const target = e.target as HTMLElement;
        target.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [thread]);

  return (
    <div className={`flex-1 overflow-auto p-4 ${styles.sleek_scrollbar}`}>
      <div className="mx-auto space-y-4" ref={threadRef}>
        <AnimatePresence>
          {thread.map((bubble, i) => {
            if (bubble.sender === "user") {
              return (
                <PushAnimationWrapper>
                  <UserBubble key={i} text={bubble.data} />
                </PushAnimationWrapper>
              );
            } else {
              return (
                <PushAnimationWrapper>
                  <AiBubble key={i} data={bubble.data} />
                </PushAnimationWrapper>
              );
            }
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PushAnimationWrapper(props: { children: React.ReactNode }) {
  return (
    <motion.div
      layout
      className="mx-auto space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.1 },
        layout: {
          type: "spring",
          bounce: 0.3,
        },
      }}
    >
      {props.children}
    </motion.div>
  );
}
