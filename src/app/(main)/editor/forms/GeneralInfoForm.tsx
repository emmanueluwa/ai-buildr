import { generalInfoSchema, GeneralInfoValues } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { useEffect } from "react";

export default function GeneralInfoForm({
  mealplanData,
  setMealplanData,
}: EditorFormProps) {
  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: mealplanData.title || "",
      description: mealplanData.description || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      //todo: update resume data
      setMealplanData({ ...mealplanData, ...values });
    });

    //ensuring always only one form watcher
    return unsubscribe;
  }, [form, mealplanData, setMealplanData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">General information</h2>
        <p className="text-sm text-muted-foreground">...</p>
      </div>

      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meal Plan name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="..." autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="..." />
                </FormControl>
                <FormDescription>
                  Feel free to add a description of the meal plan
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
