import { useEffect, useState } from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Play, Home } from "lucide-react";
import { LearningScreen } from "@/components/LearningScreen";
import { LearningDialog } from "@/components/LearningDialog";
import { Mila } from "@/components/Mila";
import { ReferenceGrid } from "@/components/ReferenceGrid";
import { DrawingGrid } from "@/components/DrawingGrid";
import { ToolPanel } from "@/components/ToolPanel";
import { CartoonButton } from "@/components/CartoonButton";
import { ScaleDemonstration } from "@/components/ScaleDemonstration";
import { FIGURAS, comparar, type Modo, type Segmento, type Vertex } from "@/data/figuras";
import { criarDesafio } from "@/data/desafios";
import { completeActivity, journeyComplete } from "@/lib/session-progress";
import { markDemonstrationSeen, shouldShowDemonstration } from "@/lib/demonstration-session";
import { eraseSegment } from "@/lib/segment-tools";
import { orientacao } from "@/data/orientacao";
import { drawingHint, markDrawingHintsDone, shouldShowDrawingHints, HINT_SEGMENTS_TO_FINISH } from "@/lib/drawing-hints";

export const Route = createFileRoute("/desenhar/$figura")({
  validateSearch: (search: Record<string, unknown>): { modo: Modo } => ({ modo: search.modo === "ampliar" ? "ampliar" : "reduzir" }),
  head: ({ params }) => ({ meta: [
    { title: `Desenhar ${FIGURAS[params.figura]?.nome ?? "figura"} — Malhas com Mila` },
    { name: "description", content: "Desenhe a figura ampliada ou reduzida na malha quadriculada e confira sua transformação." },
    { property: "og:title", content: `Desenhar ${FIGURAS[params.figura]?.nome ?? "figura"} — Malhas com Mila` },
    { property: "og:description", content: "Pratique ampliação e redução com verificação matemática." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Desenhar,
});
function Desenhar() {
  const { figura: id } = Route.useParams();
  const { modo } = Route.useSearch();
  const figura = FIGURAS[id];
  if (!figura) throw notFound();
  return <Atividade key={`${id}-${modo}`} id={id} modo={modo} />;
}
function Atividade({ id, modo }: { id: string; modo: Modo }) {
  const figura = FIGURAS[id];
  const navigate = useNavigate();
  const [segmentos, setSegmentos] = useState<Segmento[]>([]);
  const [pending, setPending] = useState<Vertex | null>(null);
  const [resultado, setResultado] = useState<ReturnType<typeof comparar> | null>(null);
  const [example, setExample] = useState(false);
  const [pencilActive, setPencilActive] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [hints, setHints] = useState(false);
  useEffect(() => {
    setExample(shouldShowDemonstration(modo));
    setHints(shouldShowDrawingHints());
  }, [modo]);
  useEffect(() => { if (hints && segmentos.length >= HINT_SEGMENTS_TO_FINISH) { markDrawingHintsDone(); setHints(false); } }, [hints, segmentos.length]);
  const hint = hints && pencilActive ? drawingHint(pending, segmentos.length) : null;
  if (!figura) throw notFound();
  const desafio = criarDesafio(figura, modo);
  const resume = () => {
    setExample(false);
    markDemonstrationSeen(modo);
  };
  const changed = () => { setPending(null); setResultado(null); };
  return <LearningScreen activity step={4} onBack={() => navigate({ to: "/escolher/$figura", params: { figura: id } })} footer={<><CartoonButton onClick={() => { setPending(null); setExample(true); }}><Play size={18} /> VER EXEMPLO</CartoonButton><CartoonButton tone="pink" onClick={() => { setPending(null); const result = comparar(segmentos, desafio.resposta.segmentos); if (result.completo) completeActivity({ figura: id, modo }); setResultado(result); }}>VERIFICAR <Check size={20} /></CartoonButton></>}>
    <div className="activity-main">
      <header className="activity-header">
        <h1 className="font-extrabold text-xl">{figura.nome} — {modo === "ampliar" ? "AMPLIAR" : "REDUZIR"}</h1>
        <p className="font-bold">Use os pontos correspondentes nas duas malhas. {modo === "ampliar" ? "Cada lado ficará com o dobro da medida." : "Cada lado ficará com metade da medida."}</p>
      </header>
      <div className="activity-boards">
        <section className="activity-board" aria-label="Modelo"><h2>Modelo</h2><ReferenceGrid figura={desafio.modelo} cell={desafio.cellModelo} /></section>
        <section className="activity-board" aria-label="Desenho do aluno"><h2>Desenhe aqui</h2>
          {hint && <p className="drawing-hint" role="status">{hint}</p>}
          <DrawingGrid cols={desafio.resposta.cols} rows={desafio.resposta.rows} cell={desafio.cellResposta} segmentos={segmentos} circulos={desafio.resposta.circulos} pendingFrom={pending} toolActive={pencilActive} onEraseSegment={index => { setSegmentos(s => eraseSegment(s, index)); changed(); }} onAddSegment={s => { setSegmentos(prev => [...prev, s]); setResultado(null); }} onSetPending={setPending} />
          <div className="activity-tools"><ToolPanel pencilActive={pencilActive} onPencil={() => { setPencilActive(true); setPending(null); }} onUndo={() => { setSegmentos(s => s.slice(0, -1)); changed(); }} onErase={() => { setPencilActive(false); changed(); }} onClear={() => { if (segmentos.length) setConfirmClear(true); else changed(); }} /></div>
        </section>
      </div>
      {example && <ScaleDemonstration modo={modo} onContinue={resume} />}
      {confirmClear && <LearningDialog title="Limpar todo o desenho?" onClose={() => setConfirmClear(false)}>
        <p>Todos os seus traços serão apagados. Os círculos da atividade serão mantidos.</p>
        <div className="example-controls">
          <CartoonButton onClick={() => setConfirmClear(false)}>CANCELAR</CartoonButton>
          <CartoonButton tone="pink" onClick={() => { setSegmentos([]); changed(); setConfirmClear(false); }}>LIMPAR TUDO</CartoonButton>
        </div>
      </LearningDialog>}
      {resultado && !example && <LearningDialog title={resultado.completo ? "Muito bem!" : "Quase lá!"} onClose={() => setResultado(null)} className="feedback-dialog">
        <Mila pose={resultado.completo ? "celebrating" : "encouraging"} className="feedback-mila" />
        <p className="feedback-message">{resultado.completo ? "Você conseguiu!" : orientacao(figura, resultado)}</p>
        <div className="example-controls">{resultado.completo ? <>
          <CartoonButton tone="pink" onClick={() => navigate({ to: journeyComplete(completeActivity({ figura: id, modo })) ? "/conclusao" : "/transicao", search: { figura: id, modo } })}>CONTINUAR <ArrowRight size={18} /></CartoonButton>
          <CartoonButton onClick={() => navigate({ to: "/menu" })}>ESCOLHER OUTRA FIGURA</CartoonButton>
          <CartoonButton tone="green" onClick={() => navigate({ to: "/" })}><Home size={18} /> MENU INICIAL</CartoonButton>
        </> : <>
          <CartoonButton tone="pink" onClick={() => setResultado(null)}>TENTAR NOVAMENTE</CartoonButton>
          <CartoonButton onClick={() => { setResultado(null); setExample(true); }}><Play size={18} /> VER EXEMPLO</CartoonButton>
        </>}</div>
      </LearningDialog>}
    </div>
  </LearningScreen>;
}
