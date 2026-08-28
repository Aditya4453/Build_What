import { Suspense } from "react";
import { Track } from "@/components/flow-ui";
import { Shell } from "@/components/shell";

export default function Page() {
  return (
    <Shell>
      <Suspense fallback={null}>
        <Track />
      </Suspense>
    </Shell>
  );
}
