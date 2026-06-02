import { cn } from "@/lib/utils";

export function TypeButton({
  active,
  onClick,
  tone,
  children,
}: {
  active: boolean;
  onClick: () => void;
  tone: "income" | "expense";
  children: React.ReactNode;
}) {
  const color =
    tone === "income" ? "var(--color-income)" : "var(--color-expense)";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-2xl border py-4 font-medium transition-all",
        active
          ? "border-transparent"
          : "border-border/60 text-muted-foreground hover:text-foreground",
      )}
      style={
        active
          ? {
              background: `color-mix(in oklab, ${color} 16%, transparent)`,
              color,
              boxShadow: `inset 0 0 0 1px ${color}`,
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}
