import { createFileRoute } from "@tanstack/react-router";
import { FIGURAS } from "@/data/figuras";
import { JourneyTransition } from "@/components/JourneyTransition";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/transicao")({
  validateSearch: (s: Record<string, unknown>) => ({ figura: typeof s.figura === "string" && FIGURAS[s.figura] ? s.figura : "peixe" }),
  head: () => pageMeta("A outra transformação", "Continue o percurso com Mila: complete ampliação e redução."),
  component: Transition,
});
function Transition() { return <JourneyTransition figura={Route.useSearch().figura} />; }