import { cn } from "@/lib/utils";
import { Variants, motion } from "framer-motion";
import { marked } from "marked";
import { useState, useEffect } from "react";

interface MarkdownFadeInProps {
  markdown: string;
  className?: string;
  delay?: number;
  variants?: Variants;
}

export function MarkdownFadeIn({
  markdown,
  delay = 0.15,
  variants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * delay },
    }),
  },
  className,
}: MarkdownFadeInProps) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    async function fetchMarkdown() {
      const htmlContent = await marked(markdown);
      const lineArray = htmlContent
        .split("\n")
        .filter((line) => line.trim() !== "");
      setLines(lineArray);
    }
    fetchMarkdown();
  }, [markdown]);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-1", className)}
    >
      {lines.map((line, i) => (
        <motion.div
          key={i}
          variants={variants}
          custom={i}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ))}
    </motion.div>
  );
}
