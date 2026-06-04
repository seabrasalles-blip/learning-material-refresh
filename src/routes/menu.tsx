import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RayBackground } from "@/components/RayBackground";
import { SpeechBubble } from "@/components/SpeechBubble";
import { CartoonButton } from "@/components/CartoonButton";
import { ReferenceGrid } from "@/components/ReferenceGrid";
import { FIGURAS_LIST } from "@/data/figuras";
import akemiWave from "@/assets/akemi-wave.png";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Escolha a figura — Malhas com Akemi" },
      { name: "description", content: "Escolha qual figura desenhar na malha quadriculada." },
    ],
  }),
  component: Menu,
});

function Menu() {
  const navigate = useNavigate();
  return (
    <RayBackground variant="green">
      <main className="min-h-screen flex flex-col px-4 py-6">
        <div className="self-start">
          <Link to="/">
            <CartoonButton tone="green">VOLTAR</CartoonButton>
          </Link>
        </div>

        <div className="flex-1 flex flex-col-reverse md:flex-row items-center justify-center gap-6 max-w-6xl mx-auto w-full">
          <img
            src={akemiWave}
            alt="Akemi sorrindo"
            width={768}
            height={1024}
            className="w-48 md:w-64 h-auto select-none"
            draggable={false}
          />
          <div className="flex flex-col gap-4 items-center">
            <div
              className="bg-white/90 border-[3px] border-black rounded-3xl p-4 md:p-6 shadow-xl"
              style={{ transform: "rotate(-1deg)" }}
            >
              <div className="grid grid-cols-3 gap-3 md:gap-5">
                {FIGURAS_LIST.map((fig) => (
                  <button
                    key={fig.id}
                    type="button"
                    onClick={() => navigate({ to: "/desenhar/$figura", params: { figura: fig.id } })}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-yellow-100 transition cursor-pointer"
                  >
                    <ReferenceGrid figura={fig} cell={14} showLabels={false} className="w-32 md:w-40" />
                    <span
                      className="font-extrabold text-base md:text-lg"
                      style={{ fontFamily: "'Comic Sans MS', system-ui, sans-serif" }}
                    >
                      {fig.nome.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <SpeechBubble tailSide="left" className="max-w-md">
              <p className="text-black">
                Para começar, escolha o desenho que você quer fazer! Basta clicar sobre ele.
              </p>
            </SpeechBubble>
          </div>
        </div>
      </main>
    </RayBackground>
  );
}
