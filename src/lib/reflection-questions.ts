import type { ReflectionChoice } from "./concept-reflection";

export type ReflectionQuestion = {
  id: string;
  prompt: string;
  choices: { id: ReflectionChoice; text: string; explanation: string }[];
  correct: ReflectionChoice;
  explanation: string;
};

export const ORIGINAL_QUESTION_ID = "forma-original";
export const REFLECTION_QUESTIONS: readonly ReflectionQuestion[] = [
  {
    id: ORIGINAL_QUESTION_ID,
    prompt: "Quando ampliamos ou reduzimos uma figura corretamente, o que acontece?",
    correct: "B",
    explanation: "Muito bem! As medidas dos lados mudam na mesma proporção e a forma é preservada. Essa é uma característica das figuras semelhantes!",
    choices: [
      { id: "A", text: "A figura muda de tamanho e de forma.", explanation: "Ao ampliar ou reduzir corretamente, o tamanho muda, mas a forma é preservada. Tente outra vez!" },
      { id: "B", text: "A figura muda de tamanho, mas mantém a forma.", explanation: "O tamanho muda e os lados correspondentes permanecem proporcionais, mantendo a forma." },
      { id: "C", text: "A figura muda apenas de posição.", explanation: "Mudar apenas a posição não amplia nem reduz: na transformação, as medidas mudam na mesma proporção. Tente outra vez!" },
    ],
  },
  {
    id: "ampliacao-dobro",
    prompt: "Um lado mede 3 unidades. Ao ampliar a figura ao dobro, quanto mede o lado correspondente?",
    correct: "A",
    explanation: "Isso! 3 × 2 = 6 unidades. Na ampliação ao dobro, todos os lados correspondentes têm suas medidas multiplicadas por 2.",
    choices: [
      { id: "A", text: "6 unidades.", explanation: "Multiplicar 3 por 2 resulta em 6 unidades." },
      { id: "B", text: "5 unidades.", explanation: "Ampliar ao dobro é multiplicar por 2, não somar 2. Pense no dobro de 3 e tente outra vez!" },
      { id: "C", text: "3 unidades.", explanation: "Manter 3 unidades não amplia esse lado. Na ampliação ao dobro, a medida deve dobrar. Tente outra vez!" },
    ],
  },
  {
    id: "reducao-metade",
    prompt: "Um lado mede 8 unidades. Ao reduzir a figura à metade, quanto mede o lado correspondente?",
    correct: "C",
    explanation: "Muito bem! 8 ÷ 2 = 4 unidades. Reduzir à metade divide a medida de cada lado por 2.",
    choices: [
      { id: "A", text: "6 unidades.", explanation: "Reduzir à metade não é subtrair 2: é dividir a medida por 2. Tente outra vez!" },
      { id: "B", text: "16 unidades.", explanation: "16 é o dobro de 8, uma ampliação. Para reduzir, precisamos de uma medida menor. Tente outra vez!" },
      { id: "C", text: "4 unidades.", explanation: "Dividir 8 por 2 resulta em 4 unidades." },
    ],
  },
  {
    id: "todos-os-lados",
    prompt: "Para ampliar uma figura mantendo sua forma, como devemos mudar as medidas dos lados?",
    correct: "B",
    explanation: "Exatamente! Multiplicamos todas as medidas pelo mesmo fator. Assim, os lados correspondentes ficam proporcionais e a forma é preservada.",
    choices: [
      { id: "A", text: "Aumentar apenas um dos lados.", explanation: "Aumentar só um lado pode deformar a figura. Todos os lados precisam seguir a mesma proporção. Tente outra vez!" },
      { id: "B", text: "Multiplicar todas pelo mesmo fator.", explanation: "O mesmo fator em todos os lados mantém a proporção e a forma." },
      { id: "C", text: "Somar a mesma medida a todos os lados.", explanation: "Somar a mesma medida nem sempre mantém a proporção entre os lados. Precisamos de um mesmo fator de multiplicação. Tente outra vez!" },
    ],
  },
  {
    id: "malha-maior",
    prompt: "Usando os mesmos pontos correspondentes, o que acontece quando os quadradinhos da nova malha têm o dobro do lado?",
    correct: "A",
    explanation: "Isso! Os lados da figura ficam com o dobro da medida, mesmo usando os mesmos pontos correspondentes. A figura aumenta e mantém a forma.",
    choices: [
      { id: "A", text: "A figura fica com o dobro das medidas dos lados.", explanation: "Quadradinhos com o dobro do lado dobram as medidas da figura." },
      { id: "B", text: "A figura fica com metade das medidas dos lados.", explanation: "Quadradinhos maiores ampliam, não reduzem. Compare o tamanho dos lados dos quadradinhos e tente outra vez!" },
      { id: "C", text: "A figura permanece com o mesmo tamanho.", explanation: "Os pontos correspondem, mas a distância entre eles aumenta com os quadradinhos maiores. Tente outra vez!" },
    ],
  },
  {
    id: "lados-proporcionais",
    prompt: "Dois lados medem 2 e 4 unidades. Qual par pode corresponder a eles em uma ampliação que mantém a forma?",
    correct: "C",
    explanation: "Muito bem! De 2 para 4 e de 4 para 8, as duas medidas dobram. O mesmo fator mantém os lados correspondentes proporcionais.",
    choices: [
      { id: "A", text: "4 e 6 unidades.", explanation: "A primeira medida dobra, mas a segunda não. As duas precisam mudar pelo mesmo fator. Tente outra vez!" },
      { id: "B", text: "2 e 8 unidades.", explanation: "Uma medida fica igual e a outra dobra. Isso não mantém a proporção. Tente outra vez!" },
      { id: "C", text: "4 e 8 unidades.", explanation: "As duas medidas são multiplicadas por 2, mantendo a proporção." },
    ],
  },
  {
    id: "figuras-semelhantes",
    prompt: "O que caracteriza duas figuras semelhantes?",
    correct: "B",
    explanation: "Exatamente! Figuras semelhantes têm a mesma forma e lados correspondentes proporcionais. Elas podem ter tamanhos diferentes.",
    choices: [
      { id: "A", text: "Ter a mesma cor, mesmo com formas diferentes.", explanation: "A cor não determina semelhança matemática. Observe a forma e a proporção dos lados. Tente outra vez!" },
      { id: "B", text: "Ter a mesma forma e lados correspondentes proporcionais.", explanation: "A forma e a proporção dos lados caracterizam figuras semelhantes." },
      { id: "C", text: "Ter necessariamente o mesmo tamanho.", explanation: "Figuras semelhantes podem ter tamanhos diferentes: os lados correspondentes precisam ser proporcionais. Tente outra vez!" },
    ],
  },
];

export function reflectionQuestion(id: string) {
  return REFLECTION_QUESTIONS.find(question => question.id === id) ?? REFLECTION_QUESTIONS[0];
}