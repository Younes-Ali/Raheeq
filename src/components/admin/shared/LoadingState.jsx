import { LoaderCircle } from "lucide-react";

export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center gap-3">
      <LoaderCircle className="animate-spin text-[#1b9c85]" size={36} />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
