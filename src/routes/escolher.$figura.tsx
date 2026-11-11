import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { LearningScreen } from "@/components/LearningScreen";
import { Mila } from "@/components/Mila";
import { ReferenceGrid } from "@/components/ReferenceGrid";
import { CartoonButton } from "@/components/CartoonButton";
import { FIGURAS, type Modo } from "@/data/figuras";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/escolher/$figura")({ head: ({ params }) => pageMeta(`${FIGURAS[params.figura]?.nome ?? "Figura"}: ampliar ou reduzir`, "Escolha reduzir à metade ou ampliar ao dobro, usando pontos correspondentes na malha."), component: Choose });
function Choose() {
 const { figura: id } = Route.useParams(); const figura = FIGURAS[id]; const navigate = useNavigate();
 if (!figura) throw notFound();
 const select = (modo: Modo) => navigate({ to: "/desenhar/$figura", params: { figura: id }, search: { modo } });
 return <LearningScreen step={3} figura={id} onBack={() => navigate({ to: "/menu" })}>
  <div className="learning-choose"><div className="selection-heading"><span className="eyebrow">VOCÊ ESCOLHEU: {figura.nome.toUpperCase()}</span><h1>Ampliar ou reduzir?</h1><p>Agora escolha o que você quer fazer com essa figura.</p></div>
  <div className="transform-layout"><Mila pose="explaining" /><div className="transform-reference"><ReferenceGrid figura={figura} cell={24} /><strong>{figura.nome}</strong></div></div>
  <div className="transform-actions"><CartoonButton onClick={() => select("reduzir")}><ArrowDownLeft size={28} /><span>REDUZIR <small>metade</small></span></CartoonButton><CartoonButton tone="pink" onClick={() => select("ampliar")}><ArrowUpRight size={28} /><span>AMPLIAR <small>dobro</small></span></CartoonButton></div></div>
 </LearningScreen>;
}
