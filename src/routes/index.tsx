import { createFileRoute, useNavigate } from "@tanstack/react-router";
import coverBackground from "@/assets/mila/fundo-capa.png.asset.json";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/")({ head: () => pageMeta("Malha Quadriculada", "Amplie e reduza figuras usando a malha com Mila."), component: Cover });
function Cover() {
 const navigate = useNavigate();
 return <main className="cover-stage">
   <div className="cover-frame">
     <img src={coverBackground.url} alt="Malha Quadriculada — Amplie e reduza figuras usando a malha. Mila apresenta um peixe desenhado em uma malha pequena e depois em uma malha maior." className="cover-art" />
     <button type="button" className="cover-hotspot" aria-label="Começar" onClick={() => navigate({ to: "/apresentacao" })} />
   </div>
 </main>;
}
