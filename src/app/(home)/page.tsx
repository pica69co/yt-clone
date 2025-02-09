import { HydrateClient, trpc } from "@/trpc/server";
import { ClientPage } from "./client";
import { Suspense } from "react";

export default function Home() {
  void trpc.hello.prefetch({ text: "Oskar" });
  return (
    <div>
      <HydrateClient>
        <Suspense fallback={<p>Wait...</p>}>
          <ClientPage />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
