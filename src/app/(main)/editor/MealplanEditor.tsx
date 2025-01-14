"use client";

import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./forms/Breadcrumbs";
import Footer from "./Footer";
import { useState } from "react";
import { MealplanValues } from "@/lib/validation";
import ResumePreviewSection from "./ResumePreviewSection";
import { cn, mapToMealplanValues } from "@/lib/utils";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import useAutoSaveMealplan from "./useAutoSaveResume";
import { MealplanServerData } from "@/lib/types";

interface MealplanEditorProps {
  mealplanToEdit: MealplanServerData | null;
}

export default function MealplanEditor({
  mealplanToEdit,
}: MealplanEditorProps) {
  const searchParams = useSearchParams();

  const [mealplanData, setMealplanData] = useState<MealplanValues>(
    mealplanToEdit ? mapToMealplanValues(mealplanToEdit) : {},
  );

  const [showSmallMealplanPreview, setShowSmallMealplanPreview] =
    useState(false);

  const { isSaving, hasUnsavedChanges } = useAutoSaveMealplan(mealplanData);

  useUnloadWarning(hasUnsavedChanges);

  const currentStep = searchParams.get("step") || steps[1].key;

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("step", key);

    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your meal plan</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below. The more information you provide the more your
          meal plan will suit your needs.
        </p>
      </header>

      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
              showSmallMealplanPreview && "hidden",
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                mealplanData={mealplanData}
                setMealplanData={setMealplanData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <ResumePreviewSection
            mealplanData={mealplanData}
            setResumeData={setMealplanData}
            className={cn(showSmallMealplanPreview && "flex")}
          />
        </div>
      </main>

      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        setShowSmallResumePreview={setShowSmallMealplanPreview}
        showSmallResumePreview={showSmallMealplanPreview}
        isSaving={isSaving}
      />
    </div>
  );
}
