import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { RayBackground } from "@/components/RayBackground";
import { ReferenceGrid } from "@/components/ReferenceGrid";
import { DrawingGrid } from "@/components/DrawingGrid";
import { ToolPanel } from "@/components/ToolPanel";
import { CartoonButton } from "@/components/CartoonButton";
import { ScaleDemonstration } from "@/components/ScaleDemonstration";
import { FIGURAS, comparar, type Modo, type Segmento, type Vertex } from "@/data/figuras";
import { criarDesafio } from "@/data/desafios";

export const Route = createFileRoute("/desenhar/$figura")({
  validateSearch: (search: Record<string, unknown>): { modo: Modo } => ({ modo: search.modo === "ampliar" ? "ampliar" : "reduzir" }),
  head: ({ params }) => ({ meta: [
    { title: `Desenhar ${FIGURAS[params.figura]?.nome ?? "figura"} — Malhas com Akemi` },
    { name: "description", content: "Desenhe a figura ampliada ou reduzida na malha quadriculada e confira sua transformação." },
    { property: "og:title", content: `Desenhar ${FIGURAS[params.figura]?.nome ?? "figura"} — Malhas com Akemi` },
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
  const [segmentos, setSegmentos] = useState<Segmento[]>([]);
  const [pending, setPending] = useState<Vertex | null>(null);
  const [resultado, setResultado] = useState<ReturnType<typeof comparar> | null>(null);
  const [example, setExample] = useState(false);
  useEffect(() => {
    try { setExample(sessionStorage.getItem("akemi-example-seen") !== "yes"); }
    catch { setExample(true); }
  }, []);
  if (!figura) throw notFound();
  const desafio = criarDesafio(figura, modo);
  const resume = () => {
    setExample(false);
    try { sessionStorage.setItem("akemi-example-seen", "yes"); } catch { /* Session preference is optional. */ }
  };
  const changed = () => { setPending(null); setResultado(null); };
  return <RayBackground variant="blue" soft>
    <main className="activity-main">
      <header className="activity-header">
        <h1 className="font-extrabold text-xl">{figura.nome} — {modo === "ampliar" ? "AMPLIAR" : "REDUZIR"}</h1>
        <p className="font-bold">{modo === "ampliar" ? "Desenhe com o dobro da medida de cada lado." : "Desenhe com metade da medida de cada lado."}</p>
      </header>
      <div className="activity-boards">
        <section className="activity-board" aria-label="Modelo"><h2>Modelo</h2><ReferenceGrid figura={desafio.modelo} cell={desafio.cellModelo} /></section>
        <section className="activity-board" aria-label="Desenho do aluno"><h2>Desenhe aqui</h2>
          <DrawingGrid cols={desafio.resposta.cols} rows={desafio.resposta.rows} cell={desafio.cellResposta} segmentos={segmentos} circulos={desafio.resposta.circulos} pendingFrom={pending} toolActive onAddSegment={s => { setSegmentos(prev => [...prev, s]); setResultado(null); }} onSetPending={setPending} />
          <div className="activity-tools"><ToolPanel pencilActive onPencil={() => setPending(null)} onUndo={() => { setSegmentos(s => s.slice(0, -1)); changed(); }} onErase={() => { setSegmentos([]); changed(); }} /></div>
        </section>
      </div>
      <div className="activity-actions">
        <Link to="/escolher/$figura" params={{ figura: id }}><CartoonButton>VOLTAR</CartoonButton></Link>
        <CartoonButton onClick={() => { setPending(null); setExample(true); }}>VER EXEMPLO</CartoonButton>
        <CartoonButton onClick={() => { setPending(null); setResultado(comparar(segmentos, desafio.resposta.segmentos)); }}>VERIFICAR</CartoonButton>
      </div>
      {example && <ScaleDemonstration modo={modo} onContinue={resume} />}
      {resultado && <div className="activity-modal"><section className="activity-dialog" style={{ maxWidth: 440 }} role="dialog" aria-modal="true" aria-labelledby="result-title">
        <h2 id="result-title" className="text-2xl font-extrabold mb-3">{resultado.completo ? "Parabéns!" : "Quase lá!"}</h2>
        {resultado.completo ? <p>Seu desenho está perfeito!</p> : <>
          <p>Acertos: <strong>{resultado.acertos}</strong> de <strong>{resultado.total}</strong></p>
          {resultado.faltando > 0 && <p>Faltam {resultado.faltando} trecho(s).</p>}
          {resultado.errados > 0 && <p>Há {resultado.errados} trecho(s) incorreto(s) ou a mais.</p>}
          <p className="mt-3">Tente de novo!</p>
        </>}
        <div className="example-controls"><CartoonButton onClick={() => setResultado(null)}>CONTINUAR</CartoonButton>{resultado.completo && <Link to="/menu"><CartoonButton tone="green">MENU</CartoonButton></Link>}</div>
      </section></div>}
    </main>
  </RayBackground>;
}
