import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { MealplanValues } from "@/lib/validation";
import { WandSparkles } from "lucide-react";
import { useState } from "react";
import { generateSummary } from "./actions";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permissions";

interface GenerateSummaryButtonProps {
  mealplanData: MealplanValues;
  onSummaryGenerated: (summary: string) => void;
}

export default function GenerateSummaryButton({
  onSummaryGenerated,
  mealplanData,
}: GenerateSummaryButtonProps) {
  const subscriptionLevel = useSubscriptionLevel();

  const premiumModal = usePremiumModal();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!canUseAITools(subscriptionLevel)) {
      premiumModal.setOpen(true);
      return;
    }

    try {
      setLoading(true);
      const aiResponse = await generateSummary(mealplanData);
      onSummaryGenerated(aiResponse);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoadingButton
      variant="outline"
      type="button"
      onClick={handleClick}
      loading={loading}
    >
      <WandSparkles className="size-4" />
      Generate Meal Plan
    </LoadingButton>
  );
}
