import { Calendar, User } from "lucide-react";

interface RelicMetaProps {
  createdBy: string;
  createdAt: string;
}

export function RelicMeta({ createdBy, createdAt }: RelicMetaProps) {
  const items = [
    {
      icon: User,
      label: "Forged by",
      value: createdBy,
    },
    {
      icon: Calendar,
      label: "Inscribed on",
      value: new Date(createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    },
  ];

  return (
    <div className="space-y-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <div>
            <p className="text-xs text-neutral-600 uppercase tracking-wider">{label}</p>
            <p className="text-neutral-200 font-semibold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}