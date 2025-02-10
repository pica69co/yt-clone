"use client";
import { trpc } from "@/trpc/client";
import React from "react";

export const ClientPage = () => {
  const [data] = trpc.categories.getMany.useSuspenseQuery();
  return <div>{JSON.stringify(data)}</div>;
};
