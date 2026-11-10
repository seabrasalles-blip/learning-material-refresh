import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LearningScreen } from "@/components/LearningScreen";
import { Mila } from "@/components/Mila";
import { CartoonButton } from "@/components/CartoonButton";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/apresentacao")({ head: () => pageMeta("Olá, eu sou a Mila!", "Conheça Mila e comece a explorar ampliação e redução de figuras."), component: Introduction });
function Introduction() {
 const navigate = useNavigate();
 return <LearningScreen step={1} onBack={() => navigate({ to: "/" })}>
  <div className="welcome-layout"><Mila pose="presenting" /><div className="welcome-copy"><span className="eyebrow">QUE BOM TER VOCÊ AQUI!</span><h1>Olá! Eu sou a <em>Mila!</em></h1><p>Nesta atividade, vamos usar a malha quadriculada para ampliar e reduzir figuras.</p><p>Você vai observar os desenhos e reproduzi-los na malha.</p><strong>Vamos começar?</strong><div className="welcome-actions"><CartoonButton tone="pink" onClick={() => navigate({ to: "/menu" })}>CONTINUAR <ArrowRight size={20} /></CartoonButton></div></div></div>
 </LearningScreen>;
}
