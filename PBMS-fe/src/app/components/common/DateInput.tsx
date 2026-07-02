import React from "react";
import { Calendar } from "lucide-react";
import { cls } from "./ui";

interface DateInputProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}

export function DateInput({ value, onChange, label }: DateInputProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {label && <span className="text-xs text-gray-500">{label}</span>}
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${cls.input} pr-7 w-[138px]`}
        />
        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

interface FilterGroupProps {
  label: string;
  children: React.ReactNode;
}

export function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500">{label}</span>
      {children}
    </div>
  );
}
