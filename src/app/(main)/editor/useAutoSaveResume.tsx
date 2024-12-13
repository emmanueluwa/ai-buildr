import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { MealplanValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveMealplan } from "./actions";
import { Button } from "@/components/ui/button";
import { fileReplacer } from "@/lib/utils";

export default function useAutoMealplan(mealplanData: MealplanValues) {
  const searchParams = useSearchParams();

  const { toast } = useToast();

  const debouncedMealplanData = useDebounce(mealplanData, 1500);

  const [mealplanId, setMealplanId] = useState(mealplanData.id);

  //save only if change - deep clone
  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(mealplanData),
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedMealplanData]);

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true);
        setIsError(false);

        const newData = structuredClone(debouncedMealplanData);

        const updatedMealplan = await saveMealplan({
          ...newData,
          ...(JSON.stringify(lastSavedData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          id: mealplanId,
        });

        setMealplanId(updatedMealplan.id);
        setLastSavedData(newData);

        if (searchParams.get("mealplanId") !== updatedMealplan.id) {
          const newSearchParams = new URLSearchParams(searchParams);

          newSearchParams.set("mealplanId", updatedMealplan.id);

          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`,
          );
        }
      } catch (error) {
        setIsError(true);
        console.error(error);

        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes.</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss();
                  save();
                }}
              >
                Retry
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false);
      }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedMealplanData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer);

    if (hasUnsavedChanges && debouncedMealplanData && !isSaving && !isError) {
      save();
    }
  }, [
    debouncedMealplanData,
    isSaving,
    lastSavedData,
    isError,
    mealplanId,
    searchParams,
    toast,
  ]);

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(mealplanData) !== JSON.stringify(lastSavedData),
  };
}
