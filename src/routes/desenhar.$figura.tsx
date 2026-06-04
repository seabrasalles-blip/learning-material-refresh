import { useState } from "react";
import { createFileRoute, Link, useNavigate, useParams, notFound } from "@tanstack/react-router";
import { RayBackground } from "@/components/RayBackground";
import { ReferenceGrid } from "@/components/ReferenceGrid";
import { DrawingGrid } from "@/components/DrawingGrid";
import { ToolPanel } from "@/components/ToolPanel";
import { CartoonButton } from "@/components/CartoonButton";
import { FIGURAS, comparar, type Segmento, type Vertex } from "@/data/figuras";

export const Route = createFileRoute("/desenhar/$figura")({
  head: ({ params }) => {
    const f = FIGURAS[params.figura];
    const nome = f ? f.nome : "Desenhar";
    return {
      meta: [
        { title: `Desenhar ${nome} — Malhas com Akemi` },
        { name: "description", content: `Use a malha quadriculada para desenhar uma ${nome.toLowerCase()}.` },
      ],
    };
  },
  beforeLoad: ({ params }) => {
    if (!FIGURAS[params.figura]) throw notFound();
  },
  component: Desenhar,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h2 className="text-2xl font-bold mb-2">Figura não encontrada</h2>
        <Link to="/menu" className="underline text-blue-700">Voltar ao menu</Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <p className="mb-3">Algo deu errado.</p>
        <button onClick={reset} className="underline">Tentar novamente</button>
      </div>
    </div>
  ),
});

function Desenhar() {
  const { figura: figId } = useParams({ from: "/desenhar/$figura" });
  const figura = FIGURAS[figId]!;
  const navigate = useNavigate();

  const [segmentos, setSegmentos] = useState<Segmento[]>([]);
  const [pending, setPending] = useState<Vertex | null>(null);
  const [pencilActive, setPencilActive] = useState(true);
  const [resultado, setResultado] = useState<null | ReturnType<typeof comparar>>(null);
  const [mostrarGabarito, setMostrarGabarito] = useState(false);

  function handleVerificar() {
    const r = comparar(segmentos, figura.segmentos);
    setResultado(r);
    setMostrarGabarito(true);
  }

  return (
    <RayBackground variant="blue">
      <main className="min-h-screen flex flex-col px-3 py-4 md:px-6">
        <div className="flex items-start gap-4 md:gap-6 flex-1">
          {/* tool panel */}
          <div className="flex flex-col gap-4">
            <ToolPanel
              pencilActive={pencilActive}
              onPencil={() => {
                setPencilActive(true);
                setPending(null);
              }}
              onUndo={() => {
                setSegmentos((s) => s.slice(0, -1));
                setPending(null);
                setResultado(null);
                setMostrarGabarito(false);
              }}
              onErase={() => {
                setSegmentos([]);
                setPending(null);
                setResultado(null);
                setMostrarGabarito(false);
              }}
            />
          </div>

          {/* grids */}
          <div className="flex-1 flex flex-col items-center gap-4 md:gap-6 max-w-4xl mx-auto">
            <div className="w-full max-w-2xl">
              <p className="text-center font-bold mb-1 text-[#1a3c5a]">Desenhe aqui:</p>
              <DrawingGrid
                cols={figura.cols}
                rows={figura.rows}
                cell={42}
                segmentos={segmentos}
                pendingFrom={pending}
                toolActive={pencilActive}
                onAddSegment={(s) => {
                  setSegmentos((prev) => [...prev, s]);
                  setResultado(null);
                }}
                onSetPending={setPending}
              />
            </div>

            <div className="w-full max-w-2xl">
              <p className="text-center font-bold mb-1 text-[#1a3c5a]">Modelo — {figura.nome}:</p>
              <div className="relative">
                <ReferenceGrid figura={figura} cell={38} className="w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* bottom actions */}
        <div className="flex items-center justify-between mt-4">
          <Link to="/menu">
            <CartoonButton tone="cyan">VOLTAR</CartoonButton>
          </Link>
          <CartoonButton tone="cyan" onClick={handleVerificar}>
            VERIFICAR
          </CartoonButton>
        </div>

        {/* result modal */}
        {resultado && mostrarGabarito && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setMostrarGabarito(false)}
          >
            <div
              className="bg-white rounded-3xl border-[4px] border-black p-6 md:p-8 max-w-md text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {resultado.completo ? (
                <>
                  <div className="text-6xl mb-2">🎉</div>
                  <h2 className="text-2xl font-extrabold text-green-700 mb-2">Parabéns!</h2>
                  <p className="text-gray-700 mb-5">Seu desenho está perfeito!</p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-2">🤔</div>
                  <h2 className="text-2xl font-extrabold text-pink-700 mb-2">Quase lá!</h2>
                  <p className="text-gray-700 mb-1">
                    Acertos: <strong>{resultado.acertos}</strong> de <strong>{resultado.total}</strong>
                  </p>
                  {resultado.faltando > 0 && (
                    <p className="text-sm text-gray-600">Faltam {resultado.faltando} traço(s).</p>
                  )}
                  {resultado.errados > 0 && (
                    <p className="text-sm text-gray-600">Você desenhou {resultado.errados} traço(s) a mais.</p>
                  )}
                  <p className="text-gray-700 mt-3 mb-5">Tente de novo!</p>
                </>
              )}
              <div className="flex gap-3 justify-center flex-wrap">
                <CartoonButton tone="cyan" onClick={() => setMostrarGabarito(false)}>
                  CONTINUAR
                </CartoonButton>
                {resultado.completo && (
                  <CartoonButton tone="green" onClick={() => navigate({ to: "/menu" })}>
                    MENU
                  </CartoonButton>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </RayBackground>
  );
}
