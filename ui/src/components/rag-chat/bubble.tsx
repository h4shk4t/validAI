import { MarkdownFadeIn } from "@/components/ui/markdown-fade-in";
import { AiBubbleData } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export function UserBubble(props: { text: string }) {
  return (
    <div className="flex items-start justify-end gap-4">
      <div className="bg-primary rounded-lg p-3 max-w-[50%] min-w-[25%]">
        <div className="font-semibold text-sm tracking-tight">You</div>
        <div className="text-xs tracking-tight">
          <p>{props.text}</p>
        </div>
      </div>
    </div>
  );
}

export function AiBubble(props: { data: AiBubbleData }) {
  return (
    <div className="flex items-start gap-4 justify-start">
      <div className="bg-background text-foreground rounded-lg border-2 border-accent p-3 min-w-[30%] max-w-[70%]">
        <div className="font-bold text-foreground tracking-tight">Bot</div>
        <div className="text-xs flex flex-col gap-2 tracking-tight">
          {props.data.isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {props.data.response?.map((res, i) => {
                <MarkdownFadeIn
                  markdown={res.answer}
                  className="text-xs font-normal"
                  key={i}
                />;
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
    <div className="space-y-2">
      <Skeleton className="h-4 " />
      <Skeleton className="h-4" />
    </div>
  );
}
