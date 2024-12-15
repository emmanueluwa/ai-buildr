"use server";

import openai from "@/lib/openai";
import { canUseAITools } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  // LifestyleHealth,
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
  You are a raw diet nutrition expert specializing in canine nutrition. Your goal is to create scientifically-backed, personalized raw meal plans that prioritize the long-term health of dogs.
  
  Raw Diet Principles:
  - Focus on high-quality, whole animal protein sources
  - Balance nutritional needs with species-appropriate raw feeding
  - Provide precise meat, organ, and bone ratios
  - Recommend appropriate supplements to ensure complete nutrition
  - Address individual dog's specific health requirements
  
  Comprehensive Raw Meal Plan Components:
  1. Protein Source Breakdown
     - Meat types and quality recommendations
     - Muscle meat percentages
     - Organ meat selections and quantities
  
  2. Bone Content Guidelines
     - Appropriate raw meaty bone recommendations
     - Calcium to phosphorus ratio
  
  3. Supplement Strategy
     - Essential vitamin and mineral supplements
     - Targeted supplements based on dog's health needs
     - Dosage and sourcing recommendations
  
  4. Portion Control
     - Precise daily portion calculations
     - Weight and body condition-specific portioning
     - Feeding frequency recommendations
  
  5. Nutritional Goals
     - Detailed nutritional profile targeting
     - Health optimization strategies
     - Age and activity level considerations
  
  6. Safety and Preparation
     - Safe handling of raw ingredients
     - Storage recommendations
     - Sanitation guidelines
     - Gradual diet transition strategies
  
  Communicate all recommendations in clear, simple language that a 10 year old pet owner can easily understand and implement. Do not say hello or give a description of what you are about to do.
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

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input. Your response
  must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any
  new ones.

  Job title: <job title>
  Company: <company name>
  Start data: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be inferred from the title>
  `;

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `;

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

  console.log("aiResponse:workExperience: => ", aiResponse);
  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  };
  // satisfies WorkExperience;
}
