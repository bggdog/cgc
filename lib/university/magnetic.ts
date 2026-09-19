/** Maximum pixels a magnetic control may travel from rest. */
export const MAGNETIC_MAX_PX = 10;

/** Fraction of cursor distance applied as pull. */
export const MAGNETIC_STRENGTH = 0.18;

/** Converts cursor distance from an element's centre into a clamped offset. */
export function clampPull(
  distance: number,
  strength: number = MAGNETIC_STRENGTH,
  max: number = MAGNETIC_MAX_PX
): number {
  const pull = distance * strength;
  return Math.max(-max, Math.min(max, pull));
}
