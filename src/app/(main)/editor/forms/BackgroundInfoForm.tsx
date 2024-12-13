import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { backgroundInfoSchema, BackgroundInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export default function BackgroundInfoForm({
  mealplanData,
  setMealplanData,
}: EditorFormProps) {
  const form = useForm<BackgroundInfoValues>({
    resolver: zodResolver(backgroundInfoSchema),
    defaultValues: {
      name: mealplanData.name || "",
      breed: mealplanData.breed || "",
      age: mealplanData.age || "",
      weight: mealplanData.weight || "",
      sex: mealplanData.sex || "",
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

  const photoInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="tet-center space-y-1.5">
        <h2 className="text-2xl font-semibold">Background info</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about your pet. If you are unsure about any of your answers
          just describe what you can see or know in as much detail as possible.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="photo"
            render={({ field: { value, ...fieldValues } }) => (
              <FormItem>
                <FormLabel>Your photo</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        fieldValues.onChange(file);
                      }}
                      ref={photoInputRef}
                    />
                  </FormControl>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      fieldValues.onChange(null);
                      if (photoInputRef.current) {
                        photoInputRef.current.value = "";
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormControl />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormControl />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormControl />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormControl />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sex</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormControl />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
