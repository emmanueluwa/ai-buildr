"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function deleteMealplan(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const mealplan = await prisma.mealPlan.findUnique({
    where: {
      id,
      userId,
    },
  });
  if (!mealplan) {
    throw new Error("Resume not found");
  }

  if (mealplan.photoUrl) {
    await del(mealplan.photoUrl);
  }

  await prisma.mealPlan.delete({
    where: {
      id,
    },
  });

  revalidatePath("/mealplans");
}
