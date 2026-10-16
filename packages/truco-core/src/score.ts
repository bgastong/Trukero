export type TeamId = 'nosotros' | 'ellos';

export interface Score {
  /** Partida a 15 o a 30 puntos. */
  target: 15 | 30;
  points: Record<TeamId, number>;
}

export function createScore(target: Score['target'] = 30): Score {
  return { target, points: { nosotros: 0, ellos: 0 } };
}

export function addPoints(score: Score, team: TeamId, amount: number): Score {
  const next = Math.max(0, Math.min(score.target, score.points[team] + amount));
  return { ...score, points: { ...score.points, [team]: next } };
}

export function winner(score: Score): TeamId | null {
  if (score.points.nosotros >= score.target) return 'nosotros';
  if (score.points.ellos >= score.target) return 'ellos';
  return null;
}

/** En partidas a 30, de 0 a 15 son "malas" y de 16 en adelante "buenas". */
export function isBuenas(score: Score, team: TeamId): boolean {
  return score.target === 30 && score.points[team] > 15;
}
