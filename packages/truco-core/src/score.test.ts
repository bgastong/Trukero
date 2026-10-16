import { describe, expect, it } from 'vitest';
import { addPoints, createScore, isBuenas, winner } from './score.js';

describe('anotador', () => {
  it('suma puntos sin pasarse del objetivo', () => {
    const score = addPoints(createScore(15), 'nosotros', 20);
    expect(score.points.nosotros).toBe(15);
    expect(winner(score)).toBe('nosotros');
  });

  it('no baja de cero', () => {
    expect(addPoints(createScore(), 'ellos', -3).points.ellos).toBe(0);
  });

  it('distingue malas y buenas a 30', () => {
    expect(isBuenas(addPoints(createScore(30), 'ellos', 15), 'ellos')).toBe(false);
    expect(isBuenas(addPoints(createScore(30), 'ellos', 16), 'ellos')).toBe(true);
  });
});
