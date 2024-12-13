import prisma from "@/lib/prisma";
import { mealplanDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import MealplanItem from "./MealplanItem";
import CreateMealplanButton from "./CreateMealplanButton";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canCreateMealplan } from "@/lib/permissions";

export const metadata: Metadata = {
  title: "Your Meal Plans",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [mealplans, totalCount, subscriptionLevel] = await Promise.all([
    prisma.mealPlan.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: mealplanDataInclude,
    }),
    prisma.mealPlan.count({
      where: {
        userId,
      },
    }),
    getUserSubscriptionLevel(userId),
  ]);

  // todo: check allowance for non premium users

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <CreateMealplanButton
        canCreate={canCreateMealplan(subscriptionLevel, totalCount)}
      />

      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Your meal plans</h1>
        <p>Total: {totalCount}</p>
      </div>

      <div className="flex w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {mealplans.map((mealplan) => (
          <MealplanItem key={mealplan.id} mealplan={mealplan} />
        ))}
      </div>
    </main>
  );
}
