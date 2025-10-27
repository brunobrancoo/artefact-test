import * as z from "zod";
import { publicProcedure, router } from "./trpc";
import { randomUUID } from "crypto";
import { Task, tasksList } from "./store/taskStore";

export const appRouter = router({
  getTasksList: publicProcedure
    .input(
      z
        .object({ cursor: z.number().optional(), limit: z.number().optional() })
        .optional(),
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? 5;
      const cursor = input?.cursor ?? 0;
      const items = tasksList.slice(cursor, cursor + limit);
      const nextCursor =
        cursor + limit < tasksList.length ? cursor + limit : undefined;
      return { items, nextCursor };
    }),
  getTaskById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const task = tasksList.find((task) => task.id === input.id);
      if (!task || input.id === "") {
        throw new Error(`No task found with id ${input.id}`);
      }
      return task;
    }),
  createTask: publicProcedure
    .input(
      z.object({
        titulo: z.string(),
        descricao: z.string().nullable(),
      }),
    )
    .mutation(({ input }) => {
      let newId = randomUUID();

      // Commentary: Insanely unlikely but you never know, we're not in an actual database ¯\__(ツ)__/¯
      while (tasksList.some((task) => task.id === newId)) {
        newId = randomUUID();
      }

      // Commentary: Already validated on form submission but you never know
      if (input.titulo === "" || input.titulo === null) {
        throw new Error("Task title is required");
      }

      // Commentary: This was not asked but I thought it could serve as a reminder for someone with lots of tasks
      if (tasksList.some((task) => task.titulo === input.titulo)) {
        throw new Error("You've already created this task");
      }

      // Mounting task before creating
      const newTask: Task = {
        ...input,
        id: newId,
        dataCriacao: new Date(),
        completed: false,
      };

      tasksList.push(newTask);
      return { message: "Task created successfully", newTask };
    }),
  deleteTask: publicProcedure
    .input(
      z.object({
        id: z.string(),
        titulo: z.string(),
      }),
    )
    .mutation(({ input }) => {
      const remaining = tasksList.filter((task) => task.id !== input.id);
      // since we import the tasksList from a shared module, we need to mutate the array in place to
      // preserve the same reference
      tasksList.splice(0, tasksList.length, ...remaining);
      return {
        message: "Task deleted successfully.",
        taskTitle: input.titulo,
      };
    }),
  updateTask: publicProcedure
    .input(
      z.object({
        titulo: z.string(),
        descricao: z.string().nullable(),
        completed: z.boolean(),
        id: z.string(),
      }),
    )
    .mutation(({ input }) => {
      const updateIndex = tasksList.findIndex((task) => input.id === task.id);
      if (updateIndex === -1) {
        throw new Error("The task you're trying to update does not exist.");
      }

      const duplicateTask = tasksList.find(
        (task) => task.titulo === input.titulo && task.id !== input.id,
      );

      if (duplicateTask) {
        throw new Error("You already have a task with this title");
      }
      tasksList[updateIndex] = {
        ...tasksList[updateIndex],
        descricao: input.descricao,
        titulo: input.titulo,
        completed:
          input.completed !== null
            ? input.completed
            : tasksList[updateIndex].completed,
      };

      return {
        message: "Task updated successfully.",
        task: tasksList[updateIndex],
      };
    }),
  deleteCompletedTasks: publicProcedure.mutation(() => {
    const completedCount = tasksList.filter((task) => task.completed).length;

    if (completedCount === 0) {
      throw new Error("No completed tasks to delete");
    }

    const remaining = tasksList.filter((task) => !task.completed);
    tasksList.splice(0, tasksList.length, ...remaining);

    return {
      message: `${completedCount} completed task${completedCount > 1 ? "s" : ""} deleted successfully`,
      deletedCount: completedCount,
    };
  }),
});

export type AppRouter = typeof appRouter;
