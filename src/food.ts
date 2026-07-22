import { z } from "zod";

export const foodTags = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Drink",
  "Appetizer",
  "Spicy",
  "Vegetarian",
  "Alcoholic",
] as const;

export const foodTagSchema = z.enum(foodTags);

export type FoodTag = z.infer<typeof foodTagSchema>;

export const foodSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  image: z.string().min(1),
  price: z.number().positive(),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  // ids of other menu items that pair well with this one
  pairings: z.array(z.number().int().positive()),
  tags: z.array(foodTagSchema).min(1),
});

export type Food = z.infer<typeof foodSchema>;

// Validated at module load so malformed entries fail fast with a clear error.
// superRefine ensures every pairing id references a real, different menu item.
const foodsSchema = z.array(foodSchema).superRefine((items, ctx) => {
  const ids = new Set(items.map((item) => item.id));
  items.forEach((item, index) => {
    item.pairings.forEach((pairingId) => {
      if (!ids.has(pairingId) || pairingId === item.id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, "pairings"],
          message: `"${item.name}" has an invalid pairing id: ${pairingId}`,
        });
      }
    });
  });
});

export const foods: Array<Food> = foodsSchema.parse([
  {
    id: 1,
    name: "Burger",
    image: "burger.jpg",
    price: 8.99,
    description:
      "This ain't your average burger. Topped with our tangy cheddar cheese sauce, fresh lettuce, and tomato.",
    longDescription:
      "A half-pound patty of locally raised beef, seared over an open ember grill and smothered in our tangy aged-cheddar cheese sauce. We stack it with crisp lettuce, vine-ripened tomato, and house pickles on a toasted brioche bun that soaks up every drop. It's the burger regulars drive across town for.",
    pairings: [12, 4, 7],
    tags: ["Lunch", "Dinner"],
  },
  {
    id: 2,
    name: "Banana Blueberry French Toast",
    image: "banana-french-toast.jpg",
    price: 9.99,
    description: "Delicious french toast with banana and blueberry.",
    longDescription:
      "Thick-cut brioche soaked overnight in vanilla-cinnamon custard, griddled golden, and crowned with caramelized bananas and a warm blueberry compote. Finished with maple syrup and a dusting of powdered sugar. Sweet enough to feel like dessert, hearty enough to carry you to lunch.",
    pairings: [11, 8],
    tags: ["Breakfast"],
  },
  {
    id: 3,
    name: "Cajun Pasta",
    image: "cajun-pasta.jpg",
    price: 16.99,
    description: "Creole-style pasta that's guaranteed to make you sweat.",
    longDescription:
      "Penne tossed in a fiery Creole cream sauce built on blackened andouille, charred peppers, and a slow-toasted spice blend we grind in-house. The heat sneaks up on you — smoky first, then a slow burn that keeps you reaching for your drink. Ask for it 'Louisiana hot' if you think you can handle it.",
    pairings: [11, 12, 5],
    tags: ["Lunch", "Dinner", "Spicy"],
  },
  {
    id: 4,
    name: "Charcuterie Board",
    image: "charcuterie.jpg",
    price: 14.99,
    description:
      "Delicious assortment of locally-sourced meats, cheeses, and spreads.",
    longDescription:
      "A rotating board of cured meats and farmstead cheeses sourced from producers within fifty miles, plus house pickles, seasonal preserves, marcona almonds, and grilled sourdough. Built for sharing while you decide on mains — or as a meal in its own right with a cocktail.",
    pairings: [13, 12, 10],
    tags: ["Appetizer"],
  },
  {
    id: 5,
    name: "Raspberry Cheesecake",
    image: "cheesecake.jpg",
    price: 7.99,
    description: "Heavenly cheesecake with a sweet raspberry topping.",
    longDescription:
      "Silky New York-style cheesecake on a brown-butter graham crust, topped with a bright raspberry coulis made from berries we roast to concentrate their sweetness. Dense, creamy, and just tart enough to cut through — the classic way to end a night at Salt & Ember.",
    pairings: [13, 11],
    tags: ["Dessert"],
  },
  {
    id: 6,
    name: "Chicken Slammer",
    image: "chicken-slammer.jpg",
    price: 11.99,
    description:
      "Our outrageous chicken sandwich topped with pickled onions and jalapenos.",
    longDescription:
      "Buttermilk-brined chicken thigh, double-dredged and fried crisp, then hit with hot honey and stacked with pickled red onions and fresh jalapeños on a potato roll. Crunchy, sweet, spicy, and a little reckless — everything a fried chicken sandwich should be.",
    pairings: [11, 12],
    tags: ["Lunch", "Dinner", "Spicy"],
  },
  {
    id: 7,
    name: "Death by Chocolate",
    image: "death-by-chocolate.jpg",
    price: 8.99,
    description:
      "Decadent chocolate pudding topped with chocolate cookies, chocolate frosting, and whipped cream.",
    longDescription:
      "Layers of dark chocolate pudding, crushed chocolate cookies, fudge frosting, and soft whipped cream, built in a glass so you can see what you're getting into. Rich to the point of confrontation. We recommend two spoons, but no one will judge you for keeping it to yourself.",
    pairings: [13, 11],
    tags: ["Dessert"],
  },
  {
    id: 8,
    name: "Pile 'O Donuts",
    image: "donuts.jpg",
    price: 6.99,
    description: "Delicious assortment of unique donuts. Guaranteed to please!",
    longDescription:
      "A rotating stack of house-made donuts fried to order — think brown-butter glaze, raspberry jam-filled, and cinnamon-sugar cake, depending on what the kitchen dreamed up that morning. Served warm because cold donuts are a missed opportunity.",
    pairings: [11, 7],
    tags: ["Dessert"],
  },
  {
    id: 9,
    name: "Italian Meatballs",
    image: "italian-meatballs.jpg",
    description: "Spiced meatballs served with a rich tomato sauce.",
    longDescription:
      "Beef and pork meatballs seasoned with fennel, garlic, and pecorino, braised slowly in a San Marzano tomato sauce until they barely hold together. Served with grilled sourdough for dragging through the sauce. An old family recipe we refuse to change.",
    pairings: [14, 13],
    price: 13.99,
    tags: ["Dinner"],
  },
  {
    id: 10,
    name: "Lamb Chop",
    image: "lamb-chop.jpg",
    description: "Delicious lamb chop topped with a Mango chutney.",
    longDescription:
      "Frenched lamb chops marinated in rosemary and garlic, grilled over embers to a blushing medium-rare, and finished with a bright mango chutney that plays sweet against the char. Our most requested special, now permanent by popular demand.",
    pairings: [13, 4, 5],
    price: 19.99,
    tags: ["Dinner"],
  },
  {
    id: 11,
    name: "Mango Lassi",
    image: "mango-lassi.jpg",
    description: "Creamy Mango-flavored delight, served ice cold.",
    longDescription:
      "Alphonso mango purée blended with house-cultured yogurt, a touch of cardamom, and crushed ice. Cold, creamy, and gently sweet — the single best answer on this menu to anything marked Spicy.",
    pairings: [3, 6, 20],
    price: 4.99,
    tags: ["Drink"],
  },
  {
    id: 12,
    name: "Mojito",
    image: "mojito.jpg",
    description: "A refreshing minty cocktail.",
    longDescription:
      "White rum, fresh-pressed lime, cane sugar, and a heavy handful of mint, muddled gently and lengthened with soda over crushed ice. Crisp and cooling — built for spicy plates and slow evenings on the patio.",
    pairings: [20, 4, 1],
    price: 6.99,
    tags: ["Drink", "Alcoholic"],
  },
  {
    id: 13,
    name: "Old Fashioned",
    image: "old-fashioned.jpg",
    description: "A classic cocktail with a twist.",
    longDescription:
      "Small-batch bourbon stirred with demerara syrup and two kinds of bitters, over a single large cube, finished with a flamed orange peel — that's the twist. Smoky, slow, and unhurried. The house pour for anything that came off the grill.",
    pairings: [10, 16, 7],
    price: 7.99,
    tags: ["Drink", "Alcoholic"],
  },
  {
    id: 14,
    name: "Pesto Bowtie Pasta",
    image: "pesto-bowtie-pasta.jpg",
    description:
      "Delicious whole wheat pasta topped with our zesty pesto sauce.",
    longDescription:
      "Whole wheat farfalle folded through a basil-walnut pesto made fresh every afternoon, brightened with lemon zest and finished with shaved pecorino. Light enough for lunch, satisfying enough for dinner, and quietly one of the kitchen's favorites.",
    pairings: [4, 12, 5],
    price: 12.99,
    tags: ["Lunch", "Dinner"],
  },
  {
    id: 15,
    name: "BBQ Chicken Pizza",
    image: "pizza.jpg",
    description:
      "Our homemade thin-crust pizza topped with BBQ chicken and our house cheese blend.",
    longDescription:
      "Thin, blistered crust from our 48-hour dough, layered with smoky BBQ sauce, pulled chicken, red onion, and a three-cheese blend, then finished with fresh cilantro out of the oven. Crisp at the edge, chewy in the middle — pizza the way an ember grill was meant to make it.",
    pairings: [12, 8],
    price: 14.99,
    tags: ["Lunch", "Dinner"],
  },
  {
    id: 16,
    name: "Pork Chop",
    image: "pork-chop.jpg",
    description: "Thick-cut Pork Chop with a sweet apple glaze.",
    longDescription:
      "A double-cut heritage pork chop brined in cider, grilled over embers, and lacquered with a sweet apple glaze that caramelizes at the edges. Juicy, deeply savory, and big enough that we'll wrap the rest without you asking.",
    pairings: [13, 5],
    price: 16.99,
    tags: ["Dinner"],
  },
  {
    id: 17,
    name: "Pork Ramen",
    image: "ramen.jpg",
    description: "Delicious bowl of ramen with pork and vegetables.",
    longDescription:
      "A rich, 12-hour pork bone broth over springy noodles, topped with chashu pork belly, a soft-set egg, charred corn, scallions, and seasonal greens. Deep, warming, and unapologetically slurpable — our cold-weather cure-all, served year round.",
    pairings: [11, 5],
    price: 11.99,
    tags: ["Lunch", "Dinner"],
  },
  {
    id: 18,
    name: "Salmon Salad",
    image: "salmon-salad.jpg",
    description:
      "Fresh salad topped with grilled salmon, mixed vegetables, and our house vinaigrette.",
    longDescription:
      "Ember-grilled salmon over crisp greens, shaved cucumber, radish, and heirloom tomato, dressed in our citrus-shallot vinaigrette and scattered with toasted seeds. Bright, clean, and substantial — proof a salad can headline.",
    pairings: [12, 11],
    price: 14.99,
    tags: ["Lunch", "Dinner", "Vegetarian"],
  },
  {
    id: 19,
    name: "Salmon Steak",
    image: "salmon.jpg",
    description: "Seared salmon steak topped with a sweet mango glaze.",
    longDescription:
      "A center-cut salmon steak seared hard for a crackling skin, then brushed with a sweet-heat mango glaze as it rests. Buttery inside, caramelized outside, and paired at the table with charred lemon. Simple, precise, and gone too fast.",
    pairings: [12, 5],
    price: 18.99,
    tags: ["Dinner"],
  },
  {
    id: 20,
    name: "Chicken Street Tacos",
    image: "street-tacos.jpg",
    description: "Delicious chicken tacos with a spicy mango salsa.",
    longDescription:
      "Three corn tortillas griddled to order and piled with achiote-marinated chicken, a spicy mango salsa, quick-pickled onion, and cotija. Squeeze the lime, take a bite, and understand why these outsell everything else on Friday nights.",
    pairings: [12, 11, 5],
    price: 9.99,
    tags: ["Lunch", "Dinner", "Spicy"],
  },
  {
    id: 21,
    name: "Veggie Sammy",
    image: "veggie-sammy.jpg",
    description: "Fresh grilled veggies on our homemade toasted sourdough.",
    longDescription:
      "Ember-grilled zucchini, peppers, and portobello layered with herbed goat cheese and arugula on our house sourdough, toasted in brown butter. Smoky, tangy, and hearty enough to convert the skeptics at the table.",
    pairings: [11, 8],
    price: 8.99,
    tags: ["Lunch", "Dinner", "Vegetarian"],
  },
]);
