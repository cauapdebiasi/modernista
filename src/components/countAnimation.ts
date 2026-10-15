// Tempo e curva compartilhados pelo rolo dos números (JackpotNumber) e pelas
// barras de progresso (ProgressFill): as duas coisas começam e terminam juntas.
export const TOTAL_DURATION_MS = 3000;
// Curva só de desaceleração (sem "overshoot" além de 1) — uma com valor de Y
// acima de 1 faria o rolo passar do último dígito da faixa e mostrar espaço
// em branco por um instante, o que parecia os números "sumindo".
export const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// Último valor que cada número/barra já animou nesta sessão. Trocar de aba
// desmonta e remonta a tela, e sem essa memória tudo giraria/encheria de
// novo a cada volta — assim só anima na abertura e quando o valor realmente
// muda.
export const lastAnimated = new Map<string, string>();
