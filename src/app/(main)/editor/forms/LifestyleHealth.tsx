import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { lifestyleHealthSchema, LifestyleHealthValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export default function LifestyleHealthForm({
  mealplanData,
  setMealplanData,
}: EditorFormProps) {
  const form = useForm<LifestyleHealthValues>({
    resolver: zodResolver(lifestyleHealthSchema),
    defaultValues: {
      lifestyleHealth: mealplanData.lifestyleHealth || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      //todo: update resume data
      setMealplanData({
        ...mealplanData,
        lifestyleHealth:
          values.lifestyleHealth?.filter(
            (lifestyle) => lifestyle !== undefined,
          ) || [],
      });
    });

    //ensuring always only one form watcher
    return unsubscribe;
  }, [form, mealplanData, setMealplanData]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "lifestyleHealth",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((filed) => filed.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);

      return arrayMove(fields, oldIndex, newIndex);
    }
  }

  return (
    <div className="max-w-cl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Lifestyle & Health</h2>
        <p className="text-sm text-muted-foreground">
          Add all lifestyle and health information for your pet that you can
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <LifestyleHealthItem
                  id={field.id}
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  activity: "",
                  diet: "",
                  health: "",
                  description: "",
                })
              }
            >
              Add Lifestyle and Health info
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface LifestyleHealthItemProps {
  id: string;
  form: UseFormReturn<LifestyleHealthValues>;
  index: number;
  remove: (index: number) => void;
}

function LifestyleHealthItem({
  id,
  form,
  index,
  remove,
}: LifestyleHealthItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  return (
    <div
      className={cn(
        "space-y-3 rounded-md border bg-background p-3",
        isDragging && "relative z-50 cursor-grab shadow-xl",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Lifestyle Health {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>

      <FormField
        control={form.control}
        name={`lifestyleHealth.${index}.activity`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Activity Levels</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`lifestyleHealth.${index}.diet`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diet, describe the current diet of your dog</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`lifestyleHealth.${index}.health`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Health, describe your dogs body condition</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormDescription>
        Add <span className="font-semibold">any</span> extra information you can
        think of regarding your pets health and lifestyle.
      </FormDescription>
      <FormField
        control={form.control}
        name={`lifestyleHealth.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Extra information</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  );
}
