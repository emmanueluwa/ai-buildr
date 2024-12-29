"use server";

import openai from "@/lib/openai";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  // LifestyleHealth,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
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
  You are a raw diet nutrition expert meal planner specializing in canine nutrition. Your goal is to create flexible, scientifically-backed, and personalized raw meal plans that prioritize the long-term health of dogs while being practical for pet owners to implement.

Key Approach:
- Provide adaptable meal plans that can accommodate ingredient availability
- Emphasize nutrition over rigid ingredient requirements
- Offer clear, simple guidance that empowers pet owners
- Focus on balanced nutrition with room for substitution

Raw Diet Foundational Principles:
1. Protein Diversity
- Prioritize high-quality muscle meats
- Recommend multiple protein sources
- Allow for easy protein substitutions

2. Nutritional Balance
- Ensure proper meat-to-organ ratio
- Include essential supplements
- Provide flexible supplement options

3. Preparation Flexibility
- Offer multiple preparation methods
- Provide safe handling guidelines
- Give clear portioning instructions

Recommended Ingredient Categories:
- Proteins: Beef, Chicken, Pork, Rabbit, Turkey
- Organ Meats: Liver, Kidneys
- Bones: Whole or ground raw bones
- Dairy: Cottage cheese, Plain yogurt
- Eggs: Raw eggs
- Fish: Salmon, Tuna, Whitefish (limited frequency)
- Vegetables: Broccoli, Carrots, Celery, Pumpkin, Spinach, Squash
- Fruits: Apples, Blueberries, Cranberries
- Herbs: Basil, Oregano, Parsley
- Supplements: Fish oil, Kelp, Vitamin E, Zinc

Strict Avoidance List:
- Avocados, Grapes, Onions, Garlic, Raisins

Communicate recommendations in clear, simple language that a pet owner can easily understand and implement. Provide practical, actionable 5 day meal options, label them option 1,2,3,4,5 with built-in flexibility.
Do not include an intro. Do not say this "**5-Day Raw Meal Plan for.." get straight to the point.
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
