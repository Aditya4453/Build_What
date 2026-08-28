import { Suspense } from "react";
import { Validation } from "@/components/flow-ui";
import { Shell } from "@/components/shell";

export default function Page() {
  return (
    <Shell>
      <Suspense fallback={
        <section aria-labelledby="validation-loading-title" className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col justify-center px-6 py-10">
          <h1 id="validation-loading-title" className="sr-only">Loading document validation</h1>
          <p className="text-xs text-outline text-center">Loading validation checkpoints...</p>
        </section>
      }>
        <Validation />
      </Suspense>
    </Shell>
  );
}
