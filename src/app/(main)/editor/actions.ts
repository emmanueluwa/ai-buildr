"use server";

import { canCreateMealplan, canUseCustomizations } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { mealplanSchema, MealplanValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import path from "path";

export async function saveMealplan(values: MealplanValues) {
  const { id } = values;

  const {
    photo,
    lifestyleHealth,
    goal,
    feedingPreferences,
    ...mealplanValues
  } = mealplanSchema.parse(values);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  //   todo: check resume count for non-premium users
  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  //trying to create new resume
  if (!id) {
    const mealplanCount = await prisma.mealPlan.count({
      where: { userId },
    });

    if (!canCreateMealplan(subscriptionLevel, mealplanCount)) {
      throw new Error("Max resume count reached for this subscription level");
    }
  }

  const existingMealplan = id
    ? await prisma.mealPlan.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingMealplan) {
    throw new Error("Resume not found");
  }

  const hasCustomizations =
    (mealplanValues.borderStyle &&
      mealplanValues.borderStyle !== existingMealplan?.borderStyle) ||
    (mealplanValues.colorHex &&
      mealplanValues.colorHex !== existingMealplan?.colorHex);

  if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
    throw new Error("Customizations not allowed for this subscription level");
  }

  //   undefined = no photo uploaded , null = deleting current photo
  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    if (existingMealplan?.photoUrl) {
      await del(existingMealplan.photoUrl);
    }

    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      //urls not guessable, url needed to find user image
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingMealplan?.photoUrl) {
      await del(existingMealplan.photoUrl);
    }
    newPhotoUrl = null;
  }

  //save changes to db
  if (id) {
    return prisma.mealPlan.update({
      where: { id },
      data: {
        ...mealplanValues,
        photoUrl: newPhotoUrl,
        LifestyleHealth: {
          deleteMany: {},
          create: lifestyleHealth?.map((lifestyle) => ({
            ...lifestyle,
          })),
        },
        Goal: {
          deleteMany: {},
          create: goal?.map((goal) => ({
            ...goal,
          })),
        },
        FeedingPreferences: feedingPreferences,
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.mealPlan.create({
      data: {
        ...mealplanValues,
        userId,
        photoUrl: newPhotoUrl,
        LifestyleHealth: {
          create: lifestyleHealth?.map((lifestyle) => ({
            ...lifestyle,
          })),
        },
        Goal: {
          create: goal?.map((goal) => ({
            ...goal,
          })),
        },
      },
    });
  }
}
