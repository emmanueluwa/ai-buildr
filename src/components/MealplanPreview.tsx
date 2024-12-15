import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { MealplanValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import Markdown from "./Markdown";

interface MealplanPreviewProps {
  mealplanData: MealplanValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function ResumePreview({
  mealplanData,
  contentRef,
  className,
}: MealplanPreviewProps) {
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
        ref={contentRef}
        id="mealplanPreviewContent"
      >
        {/* <pre>{JSON.stringify(resumeData, null, 2)}</pre> */}
        <SummarySection mealplanData={mealplanData} />

        <BackgroundInfoHeader mealplanData={mealplanData} />

        {/* <LifestyleHealthSection mealplanData={mealplanData} /> */}

        <GoalSection mealplanData={mealplanData} />

        <FeedingPreferencesSection mealplanData={mealplanData} />
      </div>
    </div>
  );
}

interface MealplanSectionProps {
  mealplanData: MealplanValues;
}

function BackgroundInfoHeader({ mealplanData }: MealplanSectionProps) {
  const {
    name,
    breed,
    age,
    weight,
    reproduction,
    sex,
    photo,
    colorHex,
    borderStyle,
  } = mealplanData;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);

    //not selected, removed
    if (photo === null) setPhotoSrc("");

    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="author image"
          className="aspect-square object-cover"
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                  ? "9999px"
                  : "10%",
          }}
        />
      )}

      <div className="space-y-2.5">
        <div className="space-y-1">
          <p className="text-3xl font-bold" style={{ color: colorHex }}>
            {name} {age}
          </p>
          <p className="font-medium" style={{ color: colorHex }}>
            {breed} {reproduction}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {sex} {weight}
        </p>
      </div>
    </div>
  );
}

function SummarySection({ mealplanData }: MealplanSectionProps) {
  const { summary, colorHex } = mealplanData;

  if (!summary) return null;

  return (
    <>
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Meal Plan
        </p>
        <div className="text-sm leading-relaxed">
          <Markdown content={summary} />
        </div>
      </div>
      <hr className="border-2" style={{ borderColor: colorHex }} />
    </>
  );
}

// function LifestyleHealthSection({ mealplanData }: MealplanSectionProps) {
//   const { lifestyleHealth, colorHex } = mealplanData;

//   const lifestyleHealthNotEmpty = lifestyleHealth?.filter(
//     (lifestyle) => Object.values(lifestyle).filter(Boolean).length > 0,
//   );

//   if (!lifestyleHealthNotEmpty?.length) return null;

//   return (
//     <>
//       <hr className="border-2" style={{ borderColor: colorHex }} />
//       <div className="space-y-3">
//         <p className="text-lg font-semibold" style={{ color: colorHex }}>
//           Lifestyle & Health
//         </p>
//         {lifestyleHealthNotEmpty.map((lifestyle, index) => (
//           <div key={index} className="break-inside-avoid space-y-1">
//             <p className="text-xs font-semibold">{lifestyle.activity}</p>
//             <p className="text-xs font-semibold">{lifestyle.diet}</p>
//             <p className="text-xs font-semibold">{lifestyle.health}</p>

//             <div className="whitespace-pre-line text-xs">
//               {lifestyle.description}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

function GoalSection({ mealplanData }: MealplanSectionProps) {
  const { goal, colorHex } = mealplanData;

  const goalNotEmpty = goal?.filter(
    (goal) => Object.values(goal).filter(Boolean).length > 0,
  );

  if (!goalNotEmpty?.length) return null;

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Goal
        </p>
        {goalNotEmpty.map((goal, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: colorHex }}
            >
              <span>{goal.budget}</span>
            </div>
            <p className="text-xs font-semibold">{goal.goal}</p>
            <p className="text-xs font-semibold">{goal.preferred_source}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function FeedingPreferencesSection({ mealplanData }: MealplanSectionProps) {
  const { feedingPreferences, colorHex, borderStyle } = mealplanData;

  if (!feedingPreferences?.length) return null;

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Feeding Preferences
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {feedingPreferences.map((preference, index) => (
            <Badge
              key={index}
              className="rounded-md bg-black text-white hover:bg-black"
              style={{
                backgroundColor: colorHex,
                borderRadius:
                  borderStyle === BorderStyles.SQUARE
                    ? "0px"
                    : borderStyle === BorderStyles.CIRCLE
                      ? "9999px"
                      : "8px",
              }}
            >
              {preference}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}
