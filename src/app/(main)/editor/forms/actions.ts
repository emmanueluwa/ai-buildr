"use server";

import openai from "@/lib/openai";
import { GenerateSummaryInput, generateSummarySchema } from "@/lib/validation";

export async function generateSummary(input: GenerateSummaryInput) {
  //todo: block this feature for non premium users

  const { jobTitle, workExperience, education, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
  You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
  Only return the summary and do not include any other information in the response. Keep it concise and professional.
  `;

  const userMessage = `
  Please generate a professional resume summary from this data:

  Job title: ${jobTitle || "N/A"}

  Work experience:
  ${workExperience
    ?.map(
      (experience) => `
    Position: ${experience.position || "N/A"} at ${experience.company || "N/A"} from ${experience.startDate || "N/A"} to ${experience.endDate || "Present"}

    Description:
    ${experience.description || "N/A"}
    `,
    )
    .join("\n\n")}

  Education:
  ${education
    ?.map(
      (education) => `
    Degree: ${education.degree || "N/A"} at ${education.school || "N/A"} from ${education.startDate || "N/A"} to ${education.endDate || "Present"}
    `,
    )
    .join("\n\n")}

    Skills:
    ${skills}
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
