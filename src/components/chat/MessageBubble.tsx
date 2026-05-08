import type { Message } from "@/types/domain";
import { cn, formatDateTime } from "@/lib/utils";

export function MessageBubble({
  message,
  mine
}: {
  message: Message;
  mine: boolean;
}) {
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm",
          mine
            ? "bg-gradient-to-r from-emerald-600 to-skyline-500 text-white"
            : "border border-slate-200 bg-white text-slate-700"
        )}
      >
        <p>{message.content}</p>
        <p className={cn("mt-1 text-[11px]", mine ? "text-emerald-50" : "text-slate-400")}>
          {formatDateTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
