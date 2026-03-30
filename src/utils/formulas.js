/**
 * Motor de Fórmulas Código Ruído - Avernus
 */

export const calculatePS = (vig, level) => {
  const base = (vig * 6) + 12;
  const levelBonus = Math.floor(level / 2) * 4;
  return base + levelBonus;
};

export const calculateSAN = (exp, level) => {
  const base = (exp * 4) + 12;
  const levelBonus = Math.floor(level / 2) * 2;
  return base + levelBonus;
};

export const calculateRM = (int, exp) => 10 + int + exp;

export const calculatePE = (exp) => (exp * 10) + 5;

export const calculateCA = (vig, agi, armadura = 0) => 10 + Math.max(vig, agi) + armadura;

export const getPACost = (currentValue) => {
  // De 3 para 4 custa 2 PA, os demais custam 1.
  return currentValue === 3 ? 2 : 1;
};

export const getPPCost = (currentBonus) => {
  // Acima de +10 custa 2 PP, os demais custam 1.
  return currentBonus >= 10 ? 2 : 1;
};
