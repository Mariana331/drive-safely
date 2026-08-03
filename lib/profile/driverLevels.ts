export const DRIVER_LEVELS = [
  { id: 'beginner', label: 'Beginner', minScore: 0 },
  { id: 'careful', label: 'Careful Driver', minScore: 40 },
  { id: 'safe', label: 'Safe Driver', minScore: 60 },
  { id: 'expert', label: 'Road Expert', minScore: 80 },
  { id: 'champion', label: 'Safety Champion', minScore: 90 },
] as const;

export type DriverLevelId = (typeof DRIVER_LEVELS)[number]['id'];

export function getDriverLevel(safetyScore: number) {
  let current: (typeof DRIVER_LEVELS)[number] = DRIVER_LEVELS[0];
  for (const level of DRIVER_LEVELS) {
    if (safetyScore >= level.minScore) current = level;
  }
  return current;
}

export function getDriverLevelIndex(safetyScore: number) {
  const current = getDriverLevel(safetyScore);
  return DRIVER_LEVELS.findIndex((level) => level.id === current.id);
}
