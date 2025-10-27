"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/server/store/taskStore";
import { format } from "date-fns";
import { Loader2, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";

interface Props {
  task: Task;
  handleDelete: (id: string, titulo: string) => void;
  isPendingMutation: boolean;
}

export default function TaskCard({
  task,
  handleDelete,
  isPendingMutation,
}: Props) {
  const { dataCriacao, ...updateTaskInfo } = { ...task };
  const utils = trpc.useUtils();
  const updateTaskMutation = trpc.updateTask.useMutation({
    onSuccess: async () => {
      await utils.getTasksList.invalidate();
    },
  });

  return (
    <Card
      key={task.id}
      className={cn("w-full", task.completed === true && "bg-green-50")}
    >
      <CardHeader>
        <div className="flex w-full">
          <CardTitle
            className={cn(task.completed && "line-through text-gray-500")}
          >
            {task.titulo}
          </CardTitle>
          <div className="flex w-auto gap-2 ml-auto">
            {/* Edit button */}
            <Link href={`/task/update?id=${task.id}`}>
              <Button
                variant="outline"
                size="icon"
                aria-label="Edit task"
                className="hover:text-blue-500 hover:cursor-pointer"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>

            {/* Delete button */}
            <Button
              variant="outline"
              size="icon"
              aria-label="Delete task"
              onClick={() => handleDelete(task.id, task.titulo)}
              disabled={isPendingMutation}
              className="hover:cursor-pointer"
            >
              {isPendingMutation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TrashIcon className="h-4 w-4 text-red-500" />
              )}
            </Button>
          </div>
        </div>
        <CardDescription>{task.descricao}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4">
        <p className="text-md font-semibold">Creation date: </p>
        <p>{format(task.dataCriacao, "dd-MM-yyyy")}</p>
        <div className="ml-auto w-auto flex gap-2 items-center">
          <p className="text-sm">done: </p>
          <Checkbox
            checked={task.completed}
            onCheckedChange={() =>
              updateTaskMutation.mutate({
                ...updateTaskInfo,
                completed: !task.completed,
              })
            }
          ></Checkbox>
        </div>
      </CardContent>
    </Card>
  );
}
