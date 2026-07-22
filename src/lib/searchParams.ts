import { z } from 'zod'
import { foodTagSchema, type FoodTag } from '../food'

// Accepts only a single string value (arrays and null fall back to ''),
// trimmed and capped so arbitrary URL input can't grow unbounded.
export const searchParamSchema = z.string().trim().max(100).catch('')

// ?tags=Spicy,Vegetarian — unknown tags are dropped rather than throwing,
// so a hand-edited or stale URL still renders.
export const tagsParamSchema = z
  .string()
  .transform((value) =>
    Array.from(
      new Set(
        value
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean),
      ),
    ).filter((part): part is FoodTag => foodTagSchema.safeParse(part).success),
  )
  .catch([] as Array<FoodTag>)

export function serializeTags(tags: ReadonlyArray<FoodTag>): string | undefined {
  return tags.length > 0 ? tags.join(',') : undefined
}
