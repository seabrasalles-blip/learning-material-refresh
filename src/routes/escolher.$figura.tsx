import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { FIGURAS, type Modo } from "@/data/figuras";
import { RayBackground } from "@/components/RayBackground";
import { ReferenceGrid } from "@/components/ReferenceGrid";
import { CartoonButton } from "@/components/CartoonButton";
import { SpeechBubble } from "@/components/SpeechBubble";
import akemi from "@/assets/akemi-wave.png";

export const Route = createFileRoute("/escolher/$figura")({
  head: ({ params }) => ({ meta: [
    { title: `${FIGURAS[params.figura]?.nome ?? "Figura"}: ampliar ou reduzir — Malhas com Akemi` },
    { name: "description", content: "Escolha ampliar ao dobro ou reduzir à metade a figura com Akemi." },
    { property: "og:title", content: "Escolha a transformação — Malhas com Akemi" },
    { property: "og:description", content: "Ampliação e redução de figuras na malha quadriculada." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Escolher,
});
function Escolher() {
  const { figura: id } = Route.useParams();
  const figura = FIGURAS[id];
  const navigate = useNavigate();
  if (!figura) throw notFound();
  const select = (modo: Modo) => navigate({ to: "/desenhar/$figura", params: { figura: id }, search: { modo } });
  return <RayBackground variant="green"><main className="min-h-screen flex flex-col p-5">
    <Link to="/menu" className="self-start"><CartoonButton tone="green">VOLTAR</CartoonButton></Link>
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-extrabold">{figura.nome}</h1>
      <div className="flex items-center gap-4"><img src={akemi} alt="Akemi" className="w-24 md:w-36 h-auto" /><ReferenceGrid figura={figura} cell={25} /></div>
      <SpeechBubble tailSide="left"><p>Vamos ampliar ou reduzir?</p></SpeechBubble>
      <div className="flex gap-4"><CartoonButton onClick={() => select("reduzir")}>REDUZIR · ½</CartoonButton><CartoonButton tone="green" onClick={() => select("ampliar")}>AMPLIAR · 2</CartoonButton></div>
    </div>
  </main></RayBackground>;
}