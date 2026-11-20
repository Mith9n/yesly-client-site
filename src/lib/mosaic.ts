/**
 * Editorial mosaic layouts shared by listing cards and vendor tiles.
 *
 * A 4-column / 2-row grid carries four photographs: one hero frame on the
 * left and a composed stack of three on the right. Cards with fewer
 * photographs degrade to graceful, still-balanced frames.
 */
export const MOSAIC_LAYOUTS: Record<number, string[]> = {
  1: ["col-span-4 row-span-2"],
  2: ["col-span-2 row-span-2", "col-span-2 row-span-2"],
  3: [
    "col-span-2 row-span-2",
    "col-span-2 row-span-1",
    "col-span-2 row-span-1",
  ],
  4: [
    "col-span-2 row-span-2",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
  ],
};

/**
 * Flatten any gallery source into a de-duplicated set of mosaic frames.
 * Keeps the first four usable image URLs, in order.
 */
export function mosaicImages(
  images: Array<string | null | undefined> | null | undefined,
  limit = 4,
): string[] {
  const unique = new Set<string>();
  for (const image of images || []) {
    if (image) unique.add(image);
    if (unique.size >= limit) break;
  }
  return [...unique];
}
