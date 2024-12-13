import { Metadata } from "next";
import MealplanEditor from "./MealplanEditor";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { mealplanDataInclude } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export const metadata: Metadata = {
  title: "Design your ...",
};

export default async function Page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams;

  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const mealplanToEdit = resumeId
    ? await prisma.mealPlan.findUnique({
        where: { id: resumeId, userId },
        include: mealplanDataInclude,
      })
    : null;

  return <MealplanEditor mealplanToEdit={mealplanToEdit} />;
}
