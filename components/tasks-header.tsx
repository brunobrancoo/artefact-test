"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";

interface TasksHeaderProps {
  hasTasks: boolean;
}

export default function TasksHeader({ hasTasks }: TasksHeaderProps) {
  const utils = trpc.useUtils();

  // Here I'm getting live task data to calculate completed tasks reactively
  const { data: tasksList } = trpc.getTasksList.useQuery();
  const hasCompletedTasks =
    tasksList?.items.some((task) => task.completed) ?? false;

  const deleteCompletedMutation = trpc.deleteCompletedTasks.useMutation({
    onSuccess: async (data) => {
      await utils.getTasksList.invalidate();
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClearCompleted = () => {
    deleteCompletedMutation.mutate();
  };

  if (!hasTasks) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full gap-6 text-center">
        <h1 className="text-4xl font-semibold">Simple Tasks Manager</h1>
        <Link href="/task/create">
          <Button className="hover:cursor-pointer bg-gray-700 hover:bg-gray-700/80 text-lg px-6">
            <PlusIcon className="mr-2 h-5 w-5" />
            Create a new task
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center w-full">
      <h1 className="text-4xl font-semibold">Simple Tasks Manager</h1>
      <div className="flex gap-3">
        <Button
          onClick={handleClearCompleted}
          disabled={!hasCompletedTasks || deleteCompletedMutation.isPending}
          variant="destructive"
          className="hover:cursor-pointer"
        >
          {/* This button doesn't have loading state because this mutation is very fast, the blink was honestly uglier than not having loading state */}
          <Trash2Icon className="mr-2 h-4 w-4" />
          Clear Completed
        </Button>
        <Link href="/task/create">
          <Button className="hover:cursor-pointer bg-white text-black hover:bg-white/80">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create a new task
          </Button>
        </Link>
      </div>
    </div>
  );
}
