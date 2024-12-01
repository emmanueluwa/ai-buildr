import { generalInfoSchema, GeneralInfoValues } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function GeneralInfoForm() {
  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
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
              <FormLabel>
                Project name
                <FormControl>
                  <Input {...field} placeholder="..." autoFocus />
                </FormControl>
                <FormMessage />
              </FormLabel>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormLabel>
                Description
                <FormControl>
                  <Input {...field} placeholder="..." />
                </FormControl>
                <FormDescription>Describe...</FormDescription>
                <FormMessage />
              </FormLabel>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
