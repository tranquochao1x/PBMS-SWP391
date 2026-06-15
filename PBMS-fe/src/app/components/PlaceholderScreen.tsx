import { Construction } from "lucide-react";

interface PlaceholderScreenProps {
  title: string;
}

export default function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white border border-gray-200 rounded shadow-sm">
      <Construction className="w-10 h-10 text-gray-300 mb-3" />
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-gray-400 text-xs mt-1">Chức năng đang được phát triển</p>
    </div>
  );
}
