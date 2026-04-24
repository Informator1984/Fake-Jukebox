import Button from "@/components/ui/Button";

interface ExportBarProps {
  documentId: string;
}

export default function ExportBar({ documentId }: ExportBarProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">Export:</span>
      {(["json", "csv", "markdown"] as const).map((fmt) => (
        <a key={fmt} href={`/api/export?documentId=${documentId}&format=${fmt}`} download>
          <Button size="sm" variant="secondary">
            {fmt.toUpperCase()}
          </Button>
        </a>
      ))}
    </div>
  );
}
