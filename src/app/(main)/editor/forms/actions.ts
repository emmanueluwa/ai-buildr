"use server";

import openai from "@/lib/openai";
import { canUseAITools } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  LifestyleHealth,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const {
    age,
    lifestyleHealth,
    goal,
    name,
    breed,
    weight,
    sex,
    reproduction,
    feedingPreferences,
    summary,
  } = generateSummarySchema.parse(input);

  const systemMessage = `
    You are a holistic pet nutrition expert focused on creating personalized, nutritionally complete meal plans that prioritize long-term pet health. 
  
    Key Principles:
    - Avoid commercial pet food brands with low-quality ingredients
    - Focus on whole, natural foods
    - Provide scientifically-backed nutritional recommendations
    - Explain recommendations in simple, easy-to-understand language
    - Consider individual pet's unique needs
  
    Provide a comprehensive meal plan that includes:
    1. Nutritional breakdown
    2. Meal recipes
    3. Portion sizes
    4. Feeding schedule
    5. Nutritional goals explanation
    6. Potential health benefits
    `;

  const userMessage = `
    Pet Details:
    - Name: ${name}
    - Breed: ${breed}
    - Weight: ${weight} kg
    - Age: ${age} years
    - Sex: ${sex}
    - Neutered: ${reproduction}
  
    Lifestyle:
    - ${lifestyleHealth}
  
    Nutritional Goals:
    - ${goal}
  
    Feeding Preferences:
    - ${feedingPreferences}
  
    Additional Context:
    ${summary} || "No additional information provided"}
  
    Please generate a comprehensive, easy-to-understand meal plan addressing all these details.
    `;
  console.log("systemMessage", systemMessage);
  console.log("userMessage", userMessage);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return aiResponse;
}

// export async function generateWorkExperience(
//   input: GenerateWorkExperienceInput,
// ) {
//   const { userId } = await auth();
//   if (!userId) {
//     throw new Error("Unauthorized");
//   }

//   const subscriptionLevel = await getUserSubscriptionLevel(userId);

//   if (!canUseAITools(subscriptionLevel)) {
//     throw new Error("Upgrade your subscription to use this feature");
//   }

//   const { description } = generateWorkExperienceSchema.parse(input);

//   const systemMessage = `
//   You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input. Your response
//   must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any
//   new ones.

//   Job title: <job title>
//   Company: <company name>
//   Start data: <format: YYYY-MM-DD> (only if provided)
//   End date: <format: YYYY-MM-DD> (only if provided)
//   Description: <an optimized description in bullet format, might be inferred from the title>
//   `;

//   const userMessage = `
//   Please provide a work experience entry from this description:
//   ${description}
//   `;

//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: systemMessage,
//       },
//       {
//         role: "user",
//         content: userMessage,
//       },
//     ],
//   });

//   const aiResponse = completion.choices[0].message.content;

//   if (!aiResponse) {
//     throw new Error("Failed to generate AI response");
//   }

//   console.log("aiResponse:workExperience: => ", aiResponse);
//   return {
//     position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
//     company: aiResponse.match(/Company: (.*)/)?.[1] || "",
//     description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
//     startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
//     endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
//   } satisfies WorkExperience;
// }
