import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LearningScreen } from "@/components/LearningScreen";
import { Mila } from "@/components/Mila";
import { CartoonButton } from "@/components/CartoonButton";
import { ReferenceGrid } from "@/components/ReferenceGrid";
import { FIGURAS_LIST } from "@/data/figuras";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/menu")({ head: () => pageMeta("Escolha a figura", "Escolha flor, figura em degraus, peixe, barco, caminhão ou casa para desenhar com Mila."), component: Menu });
function Menu() {
 const navigate = useNavigate();
 return <LearningScreen step={2} onBack={() => navigate({ to: "/apresentacao" })}>
  <div className="selection-heading"><span className="eyebrow">UM DESENHO, MUITAS POSSIBILIDADES</span><h1>Qual figura vamos desenhar?</h1></div>
  <div className="figure-layout"><aside className="mila-aside"><Mila pose="thinking" /><p>Escolha a figura que você quer desenhar.</p></aside>
  <div className="figure-options">{FIGURAS_LIST.map(fig => <CartoonButton key={fig.id} className="figure-option" onClick={() => navigate({ to: "/escolher/$figura", params: { figura: fig.id } })}><ReferenceGrid figura={fig} cell={13} showLabels={false} /><span>{fig.nome}</span></CartoonButton>)}</div></div>
 </LearningScreen>;
}
