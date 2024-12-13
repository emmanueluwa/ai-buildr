import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import {
  feedingPreferencesSchema,
  FeedingPreferencesValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SkillsForm({
  mealplanData,
  setMealplanData,
}: EditorFormProps) {
  const form = useForm<FeedingPreferencesValues>({
    resolver: zodResolver(feedingPreferencesSchema),
    defaultValues: {
      feedingPreferences: mealplanData.feedingPreferences || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      //todo: update resume data
      setMealplanData({
        ...mealplanData,
        feedingPreferences:
          values.feedingPreferences
            ?.filter((feedingPreferences) => feedingPreferences !== undefined)
            .map((preference) => preference.trim())
            //filter out empty response
            .filter((preference) => preference !== "") || [],
      });
    });

    //ensuring always only one form watcher
    return unsubscribe;
  }, [form, mealplanData, setMealplanData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Feeding Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Please provide any preferences you or your pet have here, for example
          current favourite foods/proteins, any known allergies or
          sensitivities, home cooking ability/comfort level
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="feedingPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Feeding preferences</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g allergic to chicken, doesn't like salmon, loves eating beef, he only eats a raw diet"
                    onChange={(e) => {
                      //split response into array of strings
                      const feedingPreferences = e.target.value.split(",");
                      field.onChange(feedingPreferences);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Separate each preference with a comma.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
