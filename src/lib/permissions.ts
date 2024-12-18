import { SubscriptionLevel } from "./subscription";

export function canCreateMealplan(
  SubscriptionLevel: SubscriptionLevel,
  currentMealplanCount: number,
) {
  const maxMealplansMap: Record<SubscriptionLevel, number> = {
    free: Infinity,
    pro_plus: Infinity,
  };

  const maxMealplans = maxMealplansMap[SubscriptionLevel];

  return currentMealplanCount < maxMealplans;
}

export function canUseAITools(subscriptionLevel: SubscriptionLevel) {
  return subscriptionLevel === "free";
}

export function canUseCustomizations(subscriptionLevel: SubscriptionLevel) {
  return subscriptionLevel === "free";
}
