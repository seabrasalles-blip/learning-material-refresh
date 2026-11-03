import presenting from "@/assets/mila/mila-apresentando.png.asset.json";
import explaining from "@/assets/mila/mila-explicando.png.asset.json";
import encouraging from "@/assets/mila/mila-incentivando.png.asset.json";
import celebrating from "@/assets/mila/mila-comemorando.png.asset.json";
import thinking from "@/assets/mila/mila-pensando.png.asset.json";

const poses = { presenting, explaining, encouraging, celebrating, thinking };
export function Mila({ pose = "presenting", className = "" }: { pose?: keyof typeof poses; className?: string }) {
  return <img src={poses[pose].url} alt="Mila" className={`mila ${className}`} draggable={false} />;
}