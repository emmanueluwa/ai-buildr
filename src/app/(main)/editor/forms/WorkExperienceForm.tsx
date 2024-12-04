import { Form } from "@/components/ui/form";
import { EditorFormProps } from "@/lib/types";
import { workExperienceSchema, workExperienceValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function WorkExperienceForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<workExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperience: resumeData.workExperience || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      //todo: update resume data
      setResumeData({
        ...resumeData,
        workExperience:
          values.workExperience?.filter(
            (experience) => experience !== undefined,
          ) || [],
      });
    });

    //ensuring always only one form watcher
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  return (
    <div className="max-w-cl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Work Exp</h2>
        <p className="text-sm text-muted-foreground">Add all experiences</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          {fields.map((field) => (
            <WorkExperienceItem key={field.id} />
          ))}
        </form>
      </Form>
    </div>
  );
}

function WorkExperienceItem() {
  return <div>Work exp item</div>;
}
