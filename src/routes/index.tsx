import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RayBackground } from "@/components/RayBackground";
import { SpeechBubble } from "@/components/SpeechBubble";
import { CartoonButton } from "@/components/CartoonButton";
import akemiHi from "@/assets/akemi-hi.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Malhas Quadriculadas — Akemi" },
      { name: "description", content: "Aprenda a usar a malha quadriculada para desenhar com a Akemi." },
      { property: "og:title", content: "Malhas Quadriculadas — Akemi" },
      { property: "og:description", content: "Amplie e reduza figuras com Akemi na malha quadriculada." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Intro,
});

function Intro() {
  const navigate = useNavigate();
  return (
    <RayBackground variant="blue">
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <h1 className="sr-only">Malhas Quadriculadas com a Akemi</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 max-w-4xl w-full">
          <img
            src={akemiHi}
            alt="Akemi acenando"
            width={768}
            height={1024}
            className="w-64 md:w-80 h-auto select-none"
            draggable={false}
          />
          <SpeechBubble tailSide="left" className="mt-4 md:mt-0 md:-ml-2 max-w-md">
            <p className="text-black">
              Olá, amigos!
              <br />
              <br />
              Eu sou a <strong>Akemi</strong>!
              <br />
              Hoje nós vamos aprender a usar uma <strong>malha quadriculada</strong> para desenhar!
              <br />
              Com ela, você pode aumentar e diminuir figuras.
              <br />
              <br />
              Vamos lá?
            </p>
          </SpeechBubble>
        </div>
        <div className="mt-8 md:mt-12 self-end">
          <CartoonButton tone="cyan" onClick={() => navigate({ to: "/menu" })}>
            CONTINUAR
          </CartoonButton>
        </div>
      </main>
    </RayBackground>
  );
}
