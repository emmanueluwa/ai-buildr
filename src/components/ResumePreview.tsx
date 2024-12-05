import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useRef } from "react";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  className?: string;
}

export default function ResumePreview({
  resumeData,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        // 210/297 a4 sheet
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          // 210 mm => 704 pixels
          zoom: (1 / 794) * width,
        }}
      >
        <h1 className="p-6 text-3xl font-bold">
          text changes with size of container
        </h1>
      </div>
    </div>
  );
}
