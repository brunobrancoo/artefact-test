"use server";
import TasksList from "@/components/tasks-list";
import TasksHeader from "@/components/tasks-header";
import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const tasksList = await serverClient.getTasksList();
  const hasTasks = tasksList.items.length > 0;

  return (
    <main className="flex flex-col items-center pt-8 bg-[#0a0a0a] min-h-screen text-white">
      {hasTasks ? (
        <div className="flex flex-col gap-6 w-full max-w-3xl px-4">
          <TasksHeader hasTasks={hasTasks} />
          <TasksList initialTasks={tasksList.items} />
        </div>
      ) : (
        <TasksHeader hasTasks={hasTasks} />
      )}
    </main>
  );
}
