"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {    useSearchParams } from "next/navigation";
import SearchInput from "../components/SearchInput";
import CreateTodo from "../components/CreateTodo";
import Filter from "../components/Filter";
import FilterButtons from "../components/FilterButtons";
import HandleDelete from "../components/DeleteTodo";
import { getCreatedTodos } from "../../utils/storage";
import SignOut from "../components/SignOut";

interface Todos {
  id: number;
  todo?: string;
  title: string;
  completed: boolean;
  userId?: number;
}

const PER_PAGE = 10;

const fetchTodos = async (page: number): Promise<Todos[]> => {
  const _start = (page - 1) * PER_PAGE;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos?_start=${_start}&_limit=${PER_PAGE}`
  );
  if (!response.ok) throw new Error("failed to fetch");
  const apiTodos: Todos[] = await response.json();
  const createdTodos = getCreatedTodos();
  let allTodos;
  if (page === 1) {
    allTodos = [...createdTodos, ...apiTodos];
  } else {
    allTodos = apiTodos;
  }
  return allTodos.slice(0, PER_PAGE);
};

function FetchTodos() {
  type CompletionStatus = "all" | "completed" | "uncompleted";
  // const pathname = usePathname();
  const searchparams = useSearchParams();
  const incomingPage = Number(searchparams.get("page") ?? 1);

  const [page, setPage] = useState<number>(incomingPage ?? 1);
  const [completionStatus, setCompletionStatus] =
    useState<CompletionStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { isPending, error, data, isFetching } = useQuery<Todos[], Error>({
    queryKey: ["todos", page],
    queryFn: () => fetchTodos(page),
  });

  const [checkedTodos, setCheckedTodos] = useState<number[]>([]);
  // store checked todos in localStorage
  useEffect(() => {
    const localStorageKey = "checkedTodoIds";
    const storedTodoString = localStorage.getItem(localStorageKey);
    if (storedTodoString) {
      try {
        const stored = JSON.parse(storedTodoString);
        setCheckedTodos(stored);
      } catch (warning) {
        console.warn("couldn't parse checked todos from localStorage", warning);
        setCheckedTodos([]);
      }
    }
  }, []);

  // save updated checkedTodos state to localStorage
  useEffect(() => {
    localStorage.setItem("checkedTodoIds", JSON.stringify(checkedTodos));
  }, [checkedTodos]);

  if (isPending)
    return (
      <div className="flex items-center justify-center  min-h-screen">
        <div className="flex w-82 flex-col gap-4 items-center">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    );
  if (error) return "An error has occurred: " + error.message;
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  // filter by title
  const searchResult = (data ?? ([] as Todos[])).filter((todo: Todos) =>
    (todo.title ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // filter todo by "completed" and "uncompleted"
  let finalDisplayTodos: Todos[] = [];
  if (completionStatus == "all") {
    finalDisplayTodos = searchResult;
  } else if (completionStatus == "completed") {
    finalDisplayTodos = searchResult.filter((todo: Todos) =>
      checkedTodos.some((id: number) => todo.id === id)
    );
  } else {
    finalDisplayTodos = searchResult.filter(
      (todo: Todos) => !checkedTodos.some((id: number) => todo.id === id)
    );
  }

  // const linkState = { checkedTodos, currentPage: page };

  return (
    <>
      <section className="flex flex-col gap-10 mx-auto py-15 ">
        <h1 className="text-center text-5xl md:text-6xl">TODO-LIST</h1>
        <form
          action=""
          onSubmit={handleSubmit}
          name="todo-form"
          className="w-full flex flex-col gap-y-8"
        >
          <div className="flex flex-col items-center justify-center px-6">
            <div className="mb-5 py-5">
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>

            <div className="mb-8">
              <CreateTodo />
            </div>

            <div className="  space-y-6  ">
              {finalDisplayTodos.map((todo) => (
                <div
                  key={todo.id}
                  className=" md:w-[600px] transform hover:scale-105
            transition-transform duration-700 ease-out flex items-center justify-between gap-4 border h-auto px-5 py-4 rounded-lg shadow-lg "
                >
                  <ul>
                    <label htmlFor="todo-check">
                      <input
                        className="w-10 h-5 cursor-pointer border border-slate-400"
                        type="checkbox"
                        name="checkbox"
                        id="todo-check"
                        checked={checkedTodos.includes(todo.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCheckedTodos([...checkedTodos, todo.id]);
                          } else {
                            setCheckedTodos(
                              checkedTodos.filter((id) => id !== todo.id)
                            );
                          }
                        }}
                      />{" "}
                      <Link
                        className={"font-semibold text-lg"}
                        href={{
                          pathname: `/todos/${todo.id}`,
                          query: { checked: checkedTodos.join(",") },
                        }}
                      >
                        {" "}
                        {todo.title}{" "}
                      </Link>
                    </label>
                  </ul>
                  <HandleDelete todo={todo} page={page} />
                </div>
              ))}
            </div>
          </div>
          <div>{isFetching ? "Updating..." : ""}</div>

          <FilterButtons page={page} setPage={setPage} />

          <Filter
            completionStatus={completionStatus}
            setCompletionStatus={setCompletionStatus}
          />
        </form>

        <div className="flex items-center justify-center mx-auto ">
          <SignOut />
        </div>
      </section>
    </>
  );
}

export default function Todos() {
  return (
    <Suspense fallback={<div>Loading...</div>} >
   <FetchTodos/> 
    </Suspense>
  )
};
