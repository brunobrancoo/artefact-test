# Artefact's Tasks Manager

## How to run the project:

- Clone the project
- `cd` into the project directory
- Run `npm install`  
  _(You may need `--force` due to React 19 peer deps — totally safe for local.)_
- Run `npm run dev`

You'll notice this differs from typical Next.js projects: you'll be prompted whether you want mock data or not. The script handling this can be found at `scripts/dev-with-prompt.mjs`.

The `.env` is included for convenience, since its only purpose is controlling mock data loading.

## Why the mock data script?

I wanted to make it easier to test the infinite scroll feature without manually creating dozens of tasks. The mock data is AI-generated for convenience.

# Technical Decisions & Thought Process

## App router vs pages router:

The technical challenge didn't specify which router to use. tRPC's documentation states that App Router solved many problems they originally aimed to address, which suggested the target project might use Pages Router. However, their App Router documentation is less comprehensive, making me wonder if the real challenge was implementing it with App Router.

After lots of overthinking, I chose App Router since I'm more comfortable with it.

## Turbopack and In-Memory Storage Issues

I typically use Turbopack, but it caused significant issues with in-memory storage. Tasks would show success toasts when created but wouldn't appear in the list, even after refreshing. Console logging showed the task existed in the creation context but was missing from the backend storage.

It took a while before I started suspecting Turbopack itself, but the thought was:

_Since Turbopack is designed for speed, maybe it parallelizes by spawning multiple Node processes._

Went to the [docs](https://nextjs.org/docs/app/api-reference/turbopack#why-turbopack) and found this:

> _Incremental Computation_: Turbopack parallelizes work across cores and caches results down to the function level. Once a piece of work is done, Turbopack won’t repeat it.

Disabling Turbopack resolved the issue, confirming the hypothesis. Man, that felt great.

## Infinite scroll:

I hadn't implemented infinite scroll before, but my pagination experience helped. I used Tanstack Query's `useInfiniteQuery`, modified the `getTasks` endpoint to support pagination, and triggered fetches with `IntersectionObserver` inside an `useEffect`.

The `IntersectionObserver` part was very fun.

## Completed field:

Rather than just deleting completed tasks, I added a completed state with a visibility toggle. This feels more practical for an actual task manager usage, complemented by a "clean all completed" feature.

## Update and create in the same page

This was in the challenge description:

> ### Página de Criação/Atualização de Tarefas:
>
> ■ Crie um formulário para inserir os dados de uma nova tarefa ou editar
> uma existente.

Since "Página" is singular and you guys mention "um formulário" (one form), I thought it was required and went with the [action] dynamic route. One page, one form, two behaviours. While it's elegant, it does combine two distinct responsibilities in one component.

## About tRPC

I've never used tRPC before. It felt amazing and very straightforward, and as someone who's worked with graphQL and codegen, the automatic types without code generation felt amazingly great.

---

Thanks for reading! It was a fun challenge, I hope this README shows a bit of my thought process.
