import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LearningScreen } from "@/components/LearningScreen";
import { Mila } from "@/components/Mila";
import { CartoonButton } from "@/components/CartoonButton";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/")({ head: () => pageMeta("Malha Quadriculada", "Amplie e reduza figuras usando a malha com Mila."), component: Cover });
function Cover() {
 const navigate = useNavigate();
 return <LearningScreen cover><div className="cover-content">
   <div className="cover-title"><span className="eyebrow">VAMOS DESENHAR COM A MILA</span><h1>Malha<br /><span>Quadriculada</span></h1><p>Amplie e reduza figuras<br />usando a malha</p></div>
   <Mila pose="presenting" className="cover-mila" />
   <CartoonButton tone="pink" className="cover-start" onClick={() => navigate({ to: "/apresentacao" })}>COMEÇAR <ArrowRight size={23} /></CartoonButton>
 </div></LearningScreen>;
}
