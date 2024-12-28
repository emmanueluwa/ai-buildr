import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { summarySchema, SummaryValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import GenerateSummaryButton from "./GenerateSummaryButton";

export default function SummaryForm({
  mealplanData,
  setMealplanData,
}: EditorFormProps) {
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: mealplanData.summary || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      setMealplanData({ ...mealplanData, ...values });
    });

    return unsubscribe;
  }, [form, mealplanData, setMealplanData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Meal Plan</h2>
        <p className="text-sm text-muted-foreground">
          Click the button to generate your meal plan. Once completed feel free
          to edit the generated plan to your preference.
          <div className="py-2" />
          If on mobile or tablet, to view your meal plan click the black box
          below with the yellow document icon.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <GenerateSummaryButton
                  mealplanData={mealplanData}
                  onSummaryGenerated={(summary) =>
                    form.setValue("summary", summary)
                  }
                />
                <div className="pb-6" />
                <FormLabel className="sr-only">Summary</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Brief text about..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
