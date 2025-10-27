"use client";
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { trpc } from "@/app/_trpc/client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const formSchema = z.object({
  titulo: z
    .string()
    .min(1, { message: "Title must have at least 1 character" }),
  descricao: z.string().nullable(),
});

type Form = z.infer<typeof formSchema>;

export default function CreateOrUpdateTask() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isCreate = params.action == "create";
  const taskId = searchParams.get("id");

  const {
    data: currentTask,
    isLoading,
    isFetched,
  } = trpc.getTaskById.useQuery(
    { id: taskId ?? "" },
    //only fetch if we have taskId
    {
      enabled: !!taskId,
      // Setting to only one retry cause the loading screen was taking too long when manually changing the task ID on the URL
      retry: 1,
    },
  );

  const form = useForm<Form>({
    defaultValues: {
      titulo: currentTask?.titulo || "",
      descricao: currentTask?.descricao || "",
    },
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  // load the current task fields if it exists
  useEffect(() => {
    if (currentTask) {
      form.reset({
        titulo: currentTask.titulo,
        descricao: currentTask.descricao,
      });
    }
  }, [currentTask, form]);

  const utils = trpc.useUtils();

  const createTaskMutation = trpc.createTask.useMutation({
    //same invalidation as on delete
    onSuccess: async (data) => {
      await utils.getTasksList.invalidate();
      toast.promise<{ message: string }>(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ message: data.message }), 200),
          ),
        {
          loading: "Loading...",
          success: (data) => `${data.message}`,
          error: "Error",
          richColors: true,
        },
      );
      form.reset();
    },

    onError: (e) => {
      toast.promise<{ name: string }>(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject({ name: "Task" }), 200),
          ),
        {
          loading: "Loading...",
          error: e.message,
          richColors: true,
        },
      );
    },
  });

  const updateTaskMutation = trpc.updateTask.useMutation({
    onSuccess: async (data) => {
      await utils.getTasksList.invalidate();
      toast.promise<{ message: string }>(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ message: data.message }), 200),
          ),
        {
          loading: "Loading...",
          success: (data) => `${data.message}`,
          error: "Error",
          richColors: true,
        },
      );
    },
    onError: (e) => {
      toast.promise<{ name: string }>(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject({ name: "Task" }), 200),
          ),
        {
          loading: "Loading...",
          error: e.message,
          richColors: true,
        },
      );
    },
  });
  function handleCreate(data: { titulo: string; descricao: string | null }) {
    createTaskMutation.mutate({ ...data });
  }

  function handleUpdate(data: {
    id: string;
    titulo: string;
    descricao: string | null;
    completed: boolean;
  }) {
    console.log(data.id);
    updateTaskMutation.mutate({ ...data });
  }
  function onSubmit(data: Form) {
    if (isCreate) {
      handleCreate(data);
    }
    if (!isCreate && currentTask) {
      handleUpdate({
        ...data,
        id: currentTask?.id,
        completed: currentTask?.completed,
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center gap-4 bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
        <p className="text-white">Loading task...</p>
      </div>
    );
  }

  // Once fetched but no task returned
  if (isFetched && !currentTask && !isCreate) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center gap-4 bg-[#0a0a0a]">
        <h2 className="text-white">
          The task you&apos;re trying to update does not exist ;(
        </h2>
        <Link href="/">
          <Button className="bg-white text-black hover:bg-white/80 hover:cursor-pointer">
            Back to task list
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center pt-8 bg-[#0a0a0a] gap-4 min-h-screen">
      {
        // Thought-process: Honestly I got this UI from shadcn's own Form doc since the technical case said not to worry too much with design
      }

      <Card className="w-[1000px]">
        <CardHeader>
          <CardTitle>{isCreate ? "Create a new" : "Update"} task</CardTitle>
          <CardDescription>
            Please provide title and description
          </CardDescription>
          <CardAction>
            <Link href="/" className="flex gap-4" prefetch={false}>
              <ArrowLeftIcon />
              <p>Back to tasks</p>
            </Link>
          </CardAction>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} id="task-form">
          <CardContent>
            <FieldGroup>
              <Controller
                name="titulo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-titulo">Task title</FieldLabel>
                    <Input
                      {...field}
                      id="form-titulo"
                      aria-invalid={fieldState.invalid}
                      placeholder=""
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="descricao"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-descricao">
                      Task description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      value={field.value ? field.value : ""}
                    ></Textarea>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter className="mt-4">
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset form
              </Button>
              <Button
                type="submit"
                form="task-form"
                className="hover:cursor-pointer"
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending ||
                updateTaskMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : isCreate ? (
                  "Create new task"
                ) : (
                  "Update task"
                )}
              </Button>
            </Field>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
