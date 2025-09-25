"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StatusProps {
  completionStatus: boolean;
}

function Status({ completionStatus }: StatusProps) {
  return (
    <p className={completionStatus ? "text-green-600" : "text-red-600"}>
      {completionStatus ? "Completed" : "Uncompleted"}
    </p>
  );
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
}

// const routeApi = getRouteApi('https://jsonplaceholder/typicode.com/todos/{todoId}')
function TodoDetailPage() {
  // const pathname = usePathname();
  const searchparams = useSearchParams();
  const { id } = useParams();
  const newid = Number(id);

  const [localTodos, setLocalTodos] = useState<Todo | undefined>();

  useEffect(() => {
    const createdTodos: Todo[] = JSON.parse(
      localStorage.getItem("createdTodos") || "[]"
    );
    if (createdTodos) {
      const foundTodos = createdTodos.find((t) => String(t.id) === id);
      setLocalTodos(foundTodos);
    }
  }, [id]);

  const fetchTodos = async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${newid}`
    );
    if (!response.ok) throw new Error("failed to fetch");
    return response.json() as Promise<Todo>;
  };
  const {
    isPending,
    error,
    data: apiTodo,
  } = useQuery<Todo, Error>({
    queryKey: ["todo", newid],
    queryFn: fetchTodos,
    enabled: !localTodos,
  });

  const todo = apiTodo || localTodos;
  // const currentPage = Number(searchparams.get("page")) || 1;
  const checkedTodos =
    searchparams.get("checked")?.split(",").map(Number) || [];

  useEffect(() => {
    localStorage.setItem("checkedTodoIds", JSON.stringify(checkedTodos));
  });

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex w-52 flex-col gap-4">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    );

  if (error) return "An error has occurred: " + error.message;

  const isChecked = todo
    ? todo.completed || checkedTodos.includes(todo.id)
    : false;
  //     const toggleChecked = (id: number) => {
  //   setCheckedTodos(prev =>
  //     prev.includes(id)
  //       ? prev.filter(x => x !== id)
  //       : [...prev, id]
  //   );
  // };

  return (
    <>
      <section className="flex justify-center items-center h-screen px-10 bg-slate-100">
        <div className="w-full max-w-lg mx-auto">
          <div className=" border shadow-lg rounded-lg backdrop-blur-lg flex flex-col gap-y-6 items-center py-5">
            <h1 className=" text-xl text-center font-bold ">Todo Detail</h1>
            <span className="font-bold">Title: </span>{" "}
            <span className="">{todo?.title ?? "No Title"}</span>
            <Status completionStatus={isChecked} />
            <p>
              <span className="font-bold"> ID: </span>{" "}
              <span> {todo?.id ?? "No id"} </span>
            </p>
            <Link href={"/todos"}>
              <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl border cursor-pointer rounded-md px-5 py-2 bg-slate-600 hover:bg-slate-700 text-slate-50 text-sm">
                Back To List
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default TodoDetailPage;
