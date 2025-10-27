"use client";
import TaskCard from "./task-card";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useRef, useState } from "react";
import { Task } from "@/server/store/taskStore";
import { Loader2 } from "lucide-react";

export default function TasksList({ initialTasks }: { initialTasks: Task[] }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.getTasksList.useInfiniteQuery(
      {
        limit: 5,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialData: {
          pages: [
            {
              items: initialTasks,
              nextCursor: initialTasks.length >= 5 ? 5 : undefined,
            },
          ],
          pageParams: [undefined],
        },
      },
    );

  const allTasks = data?.pages.flatMap((page) => page.items) ?? [];
  const utils = trpc.useUtils();

  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const deleteTask = trpc.deleteTask.useMutation({
    onMutate: (vars) => {
      setDeletingTaskId(vars.id);
    },
    onSettled: async () => {
      setDeletingTaskId(null);
      await utils.getTasksList.invalidate();
    },
    //invalidates so the frontend updates with deletion
    onSuccess: async () => {
      await utils.getTasksList.invalidate();
    },
  });

  function handleDelete(id: string, titulo: string) {
    deleteTask.mutate({ id: id, titulo: titulo });
  }

  // This is for triggering the infinite scroll fetches
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1 },
    );
    const node = loadMoreRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="gap-4 flex flex-col w-full pb-4">
      {allTasks.map((task) => (
        // create separate component for better understanding
        <TaskCard
          key={task.id}
          task={task}
          handleDelete={handleDelete}
          isPendingMutation={deletingTaskId === task.id}
        />
      ))}
      {/* Using this div to trigger the infinite scroll */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="py-8 text-center text-gray-500">
          {isFetchingNextPage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Scroll to load more"
          )}
        </div>
      )}
    </div>
  );
}
