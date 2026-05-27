import { Star } from "lucide-react";

export default function StarRating({ rating = 0, count = 0, interactive = false, onRate }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-border fill-transparent"
          } ${interactive ? "cursor-pointer w-5 h-5" : ""}`}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
      {count > 0 && (
        <span className="text-xs text-muted-foreground ml-1">({count})</span>
      )}
    </div>
  );
}
