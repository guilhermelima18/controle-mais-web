import { cn } from "@/lib/utils";

export function FilterChip({
  children,
  active,
  onClick,
  tone,
  size = "md",
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  tone?: "income" | "expense";
  size?: "sm" | "md";
}) {
  const toneColor =
    tone === "income"
      ? "var(--color-income)"
      : tone === "expense"
        ? "var(--color-expense)"
        : undefined;

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border transition-all",
        size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm",
        active
          ? "border-transparent text-background shadow-md"
          : "border-border/60 bg-background/30 text-muted-foreground hover:text-foreground",
      )}
      style={
        active
          ? {
              background: toneColor ?? "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}
