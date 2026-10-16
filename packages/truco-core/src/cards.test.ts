import { describe, expect, it } from 'vitest';
import { compareCards, createDeck, envidoPoints, shuffle, trucoRank, type Card } from './cards.js';

const c = (number: Card['number'], suit: Card['suit']): Card => ({ number, suit });

describe('mazo', () => {
  it('tiene 40 cartas únicas', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(40);
    expect(new Set(deck.map((x) => `${x.number}-${x.suit}`)).size).toBe(40);
  });

  it('mezclar no pierde cartas', () => {
    expect(shuffle(createDeck())).toHaveLength(40);
  });
});

describe('jerarquía del truco', () => {
  it('ordena las cartas bravas', () => {
    expect(trucoRank(c(1, 'espada'))).toBeGreaterThan(trucoRank(c(1, 'basto')));
    expect(trucoRank(c(1, 'basto'))).toBeGreaterThan(trucoRank(c(7, 'espada')));
    expect(trucoRank(c(7, 'espada'))).toBeGreaterThan(trucoRank(c(7, 'oro')));
    expect(trucoRank(c(7, 'oro'))).toBeGreaterThan(trucoRank(c(3, 'copa')));
  });

  it('el 4 es la carta más baja', () => {
    expect(compareCards(c(4, 'oro'), c(5, 'copa'))).toBeLessThan(0);
  });

  it('cartas de igual valor son parda', () => {
    expect(compareCards(c(3, 'oro'), c(3, 'basto'))).toBe(0);
    expect(compareCards(c(7, 'copa'), c(7, 'basto'))).toBe(0);
  });
});

describe('envido', () => {
  it('suma 20 con dos cartas del mismo palo', () => {
    expect(envidoPoints([c(7, 'oro'), c(6, 'oro'), c(1, 'espada')])).toBe(33);
  });

  it('las figuras valen 0', () => {
    expect(envidoPoints([c(12, 'copa'), c(11, 'copa'), c(4, 'basto')])).toBe(20);
  });

  it('sin palos repetidos vale la carta más alta', () => {
    expect(envidoPoints([c(7, 'oro'), c(5, 'copa'), c(12, 'espada')])).toBe(7);
  });

  it('con tres del mismo palo toma las dos mejores', () => {
    expect(envidoPoints([c(7, 'basto'), c(5, 'basto'), c(6, 'basto')])).toBe(33);
  });
});
