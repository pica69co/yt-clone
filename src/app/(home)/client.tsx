"use client";
import { trpc } from "@/trpc/client";
import React from "react";

export const ClientPage = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "Oskar from client page",
  });
  return <div>{data.greeting}</div>;
};
