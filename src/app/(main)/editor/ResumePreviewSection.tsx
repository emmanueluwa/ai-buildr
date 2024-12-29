import ResumePreview from "@/components/MealplanPreview";
import { MealplanValues } from "@/lib/validation";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import { cn } from "@/lib/utils";

interface ResumePreviewSectionProps {
  mealplanData: MealplanValues;
  setResumeData: (data: MealplanValues) => void;
  className?: string;
}

export default function ResumePreviewSection({
  mealplanData,
  setResumeData,
  className,
}: ResumePreviewSectionProps) {
  return (
    <div
      className={cn("group relative hidden w-full md:flex md:w-1/2", className)}
    >
      <div className="absolute right-1 top-1 flex flex-none flex-col gap-3 opacity-50 transition-opacity group-hover:opacity-100 lg:left-3 lg:top-3 xl:opacity-100">
        <ColorPicker
          color={mealplanData.colorHex}
          onChange={(color) =>
            setResumeData({ ...mealplanData, colorHex: color.hex })
          }
        />
        <BorderStyleButton
          borderStyle={mealplanData.borderStyle}
          onChange={(borderStyle) =>
            setResumeData({ ...mealplanData, borderStyle })
          }
        />
      </div>
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <ResumePreview
          mealplanData={mealplanData}
          className="max-w-2cl shadow-md"
        />
      </div>
    </div>
  );
}
