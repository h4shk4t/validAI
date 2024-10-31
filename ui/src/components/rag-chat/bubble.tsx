import { MarkdownFadeIn } from "@/components/ui/markdown-fade-in";
import { AiBubbleData } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { File } from "lucide-react";
import Markdown from "react-markdown";

export function UserBubble(props: { text: string }) {
  return (
    <div className="flex items-start justify-end gap-4">
      <div className="bg-primary/60 rounded-l-lg rounded-b-lg p-3 max-w-[50%] min-w-[25%]">
        <div className="font-semibold text-sm tracking-tight text-white">You</div>
        <div className="text-sm tracking-tight">
          <p>{props.text}</p>
        </div>
      </div>
    </div>
  );
}

export function AiBubble(props: { data: AiBubbleData }) {
  return (
    <div className="flex items-start gap-4 justify-start">
      <div className="bg-muted/40 text-foreground rounded-r-lg border rounded-b-lg p-3 min-w-[30%] max-w-[70%]">
        <div className="font-bold text-foreground tracking-tight text-white">Bot</div>
        <div className="text-xs flex flex-col gap-2 tracking-tight">
          {props.data.isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {props.data.response?.map((res, i) => {
                return (
                  <div key={i}>
                    <MarkdownFadeIn
                      markdown={res.answer}
                      className="text-sm font-normal"
                    />
                    <div className="flex flex-row flex-wrap gap-1 mt-2">
                      {Object.keys(res.referencedFiles).map((fileName, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <div className="text-sm tracking-tight rounded-md bg-background border hover:bg-secondary-foreground hover:cursor-pointer px-2 py-1 inline-flex items-center">
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
                                {res.referencedFiles[fileName]}
                              </Markdown>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2 animate-pulse inline-flex items-end gap-1 pb-1">
        <div className="w-4 h-4 bg-primary rounded-full" />
        <span className="text-muted-foreground font-semibold"> Thinking...</span>
    </div>
  );
}
