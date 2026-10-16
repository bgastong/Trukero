export const SUITS = ['espada', 'basto', 'oro', 'copa'] as const;
export type Suit = (typeof SUITS)[number];

export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12] as const;
export type CardNumber = (typeof NUMBERS)[number];

export interface Card {
  number: CardNumber;
  suit: Suit;
}

/** Mazo español de 40 cartas (sin 8 ni 9). */
export function createDeck(): Card[] {
  return SUITS.flatMap((suit) => NUMBERS.map((number) => ({ number, suit })));
}

/** Fisher-Yates. `random` se puede inyectar para tests reproducibles. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/** Jerarquía del truco: mayor número = carta más fuerte (1 de espada = 14). */
export function trucoRank(card: Card): number {
  const { number, suit } = card;
  if (number === 1 && suit === 'espada') return 14;
  if (number === 1 && suit === 'basto') return 13;
  if (number === 7 && suit === 'espada') return 12;
  if (number === 7 && suit === 'oro') return 11;
  switch (number) {
    case 3: return 10;
    case 2: return 9;
    case 1: return 8; // 1 de oro y 1 de copa
    case 12: return 7;
    case 11: return 6;
    case 10: return 5;
    case 7: return 4; // 7 de copa y 7 de basto
    case 6: return 3;
    case 5: return 2;
    case 4: return 1;
  }
}

/** >0 si gana `a`, <0 si gana `b`, 0 si es parda. */
export function compareCards(a: Card, b: Card): number {
  return trucoRank(a) - trucoRank(b);
}

/** Valor de una carta para el envido: las figuras (10, 11, 12) valen 0. */
export function envidoValue(card: Card): number {
  return card.number >= 10 ? 0 : card.number;
}

/** Tantos de envido de una mano de hasta 3 cartas. */
export function envidoPoints(hand: readonly Card[]): number {
  let best = 0;
  for (const suit of SUITS) {
    const values = hand
      .filter((c) => c.suit === suit)
      .map(envidoValue)
      .sort((x, y) => y - x);
    if (values.length >= 2) {
      best = Math.max(best, 20 + values[0]! + values[1]!);
    } else if (values.length === 1) {
      best = Math.max(best, values[0]!);
    }
  }
  return best;
}
