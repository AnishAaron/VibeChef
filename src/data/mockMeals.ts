import { Meal } from '../types';

export const ALL_MEALS: Meal[] = [
  // BREAKFASTS
  {
    id: 'b1',
    name: 'Simple Fried Eggs & Avocado Toast',
    type: 'breakfast',
    prepTime: 10,
    energyRequired: 1,
    estimatedCost: 3.50,
    ingredients: [
      { name: 'Eggs', amount: '2 large', category: 'Dairy & Eggs' },
      { name: 'Bread', amount: '2 slices', category: 'Pantry' },
      { name: 'Avocado', amount: '1/2 piece', category: 'Produce' },
      { name: 'Butter', amount: '1 tbsp', category: 'Dairy & Eggs' }
    ],
    instructions: [
      'Toast your bread slices to golden brown perfection.',
      'Melt butter in a pan over medium heat and crack the eggs in.',
      'Cook eggs to your preferred doneness (sunny-side up or over-easy).',
      'Mash avocado onto the toast with a pinch of salt and pepper.',
      'Top the avocado toast with your fried eggs and enjoy!'
    ],
    description: 'A lightning-fast, high-protein breakfast that combines creamy avocado with perfect warm runny eggs.'
  },
  {
    id: 'b2',
    name: 'Honey Banana Oatmeal Bowl',
    type: 'breakfast',
    prepTime: 12,
    energyRequired: 1,
    estimatedCost: 2.20,
    ingredients: [
      { name: 'Oats', amount: '1/2 cup', category: 'Pantry' },
      { name: 'Milk', amount: '1 cup', category: 'Dairy & Eggs' },
      { name: 'Bananas', amount: '1 ripe', category: 'Produce' },
      { name: 'Honey', amount: '1 tbsp', category: 'Pantry' },
      { name: 'Cinnamon', amount: '1 pinch', category: 'Pantry' }
    ],
    instructions: [
      'In a small saucepan, combine oats and milk over medium heat.',
      'Bring to a gentle simmer, stirring frequently, for about 5-7 minutes until creamy.',
      'Pour oats into a bowl and slice the banana on top.',
      'Drizzle with honey and sprinkle a touch of cinnamon.'
    ],
    description: 'A comforting, warm, and naturally sweet fiber-rich bowl to fuel your morning with minimal kitchen effort.'
  },
  {
    id: 'b3',
    name: 'Fresh Spinach & Feta Omelette',
    type: 'breakfast',
    prepTime: 15,
    energyRequired: 2,
    estimatedCost: 4.00,
    ingredients: [
      { name: 'Eggs', amount: '3 large', category: 'Dairy & Eggs' },
      { name: 'Spinach', amount: '1 cup fresh', category: 'Produce' },
      { name: 'Feta Cheese', amount: '1/4 cup crumbled', category: 'Dairy & Eggs' },
      { name: 'Garlic', amount: '1 clove, minced', category: 'Produce' },
      { name: 'Olive Oil', amount: '1 tsp', category: 'Pantry' }
    ],
    instructions: [
      'Whisk eggs in a bowl with a pinch of salt and pepper.',
      'Heat oil in a non-stick skillet, saute the minced garlic and spinach until wilted (1-2 mins).',
      'Pour the whisked eggs over the spinach, reducing heat to medium-low.',
      'As the eggs set, sprinkle crumbled feta over one half.',
      'Fold the omelette over, cook for another minute, then slide onto a plate.'
    ],
    description: 'An elegant, Mediterranean-style omelette bursting with iron-rich spinach and salty feta cheese.'
  },
  {
    id: 'b4',
    name: 'Tactile Sweet Potato & Egg Skillet',
    type: 'breakfast',
    prepTime: 30,
    energyRequired: 4,
    estimatedCost: 5.50,
    ingredients: [
      { name: 'Potatoes', amount: '2 medium, diced', category: 'Produce' },
      { name: 'Eggs', amount: '2 large', category: 'Dairy & Eggs' },
      { name: 'Cheese', amount: '1/4 cup shredded', category: 'Dairy & Eggs' },
      { name: 'Onion', amount: '1/2 medium, chopped', category: 'Produce' },
      { name: 'Olive Oil', amount: '1 tbsp', category: 'Pantry' }
    ],
    instructions: [
      'Heat olive oil in a cast-iron skillet over medium-high heat.',
      'Add diced potatoes and chopped onions. Cook, stirring occasionally, for 15 minutes until crispy and soft inside.',
      'Use a spoon to create two small wells in the potato mixture.',
      'Crack an egg into each well. Cover the skillet with a lid.',
      'Cook for 5-6 minutes until egg whites are set but yolks remain soft.',
      'Sprinkle shredded cheese over the top, letting it melt before serving.'
    ],
    description: 'A hearty, rustic breakfast skillet with crispy potato hash, melted cheese, and perfectly poached eggs.'
  },
  {
    id: 'b5',
    name: 'Stuffed French Toast with Berry Compote',
    type: 'breakfast',
    prepTime: 25,
    energyRequired: 3,
    estimatedCost: 6.80,
    ingredients: [
      { name: 'Bread', amount: '4 thick slices', category: 'Pantry' },
      { name: 'Eggs', amount: '2 large', category: 'Dairy & Eggs' },
      { name: 'Cream Cheese', amount: '2 oz', category: 'Dairy & Eggs' },
      { name: 'Milk', amount: '1/4 cup', category: 'Dairy & Eggs' },
      { name: 'Bananas', amount: '1/2 sliced', category: 'Produce' },
      { name: 'Honey', amount: '2 tbsp', category: 'Pantry' }
    ],
    instructions: [
      'Spread cream cheese on two slices of bread, place banana slices on top, and close with the remaining bread to make sandwiches.',
      'Whisk eggs, milk, and a pinch of cinnamon in a wide dish.',
      'Dip sandwiches into the egg mixture, allowing them to soak for 15 seconds per side.',
      'Cook in a greased pan over medium heat for 3-4 minutes on each side until golden brown.',
      'Serve hot, drizzled with honey or maple syrup.'
    ],
    description: 'An indulgent weekend-style French toast stuffed with velvety cream cheese and sweet bananas.'
  },

  // LUNCHES
  {
    id: 'l1',
    name: 'Caprese Tomato Toast & Salad',
    type: 'lunch',
    prepTime: 10,
    energyRequired: 1,
    estimatedCost: 3.80,
    ingredients: [
      { name: 'Bread', amount: '2 thick slices', category: 'Pantry' },
      { name: 'Tomatoes', amount: '1 medium, sliced', category: 'Produce' },
      { name: 'Cheese', amount: '2 oz mozzarella', category: 'Dairy & Eggs' },
      { name: 'Spinach', amount: '1 cup', category: 'Produce' },
      { name: 'Olive Oil', amount: '1 tbsp', category: 'Pantry' }
    ],
    instructions: [
      'Drizzle bread slices with olive oil and toast them.',
      'Layer fresh mozzarella slices and tomato slices on top of the toast.',
      'Season with salt, pepper, and a tiny splash of balsamic or olive oil.',
      'Serve alongside a simple bed of fresh spinach tossed with a touch of oil.'
    ],
    description: 'A simple Italian classic translated into a quick, fresh lunch featuring ripe tomatoes and soft mozzarella.'
  },
  {
    id: 'l2',
    name: 'Savory Garlic Potato Hash',
    type: 'lunch',
    prepTime: 20,
    energyRequired: 2,
    estimatedCost: 2.50,
    ingredients: [
      { name: 'Potatoes', amount: '3 medium, cubed', category: 'Produce' },
      { name: 'Garlic', amount: '3 cloves, sliced', category: 'Produce' },
      { name: 'Olive Oil', amount: '2 tbsp', category: 'Pantry' },
      { name: 'Spinach', amount: '1/2 cup', category: 'Produce' }
    ],
    instructions: [
      'Microwave cubed potatoes for 3 minutes to par-cook and save stove time.',
      'Heat oil in a skillet, add garlic and potatoes, fry on high heat until edges turn golden and crispy (10-12 mins).',
      'Toss in spinach during the final minute until wilted.',
      'Season generously with salt, cracked black pepper, and paprika.'
    ],
    description: 'An earthy, incredibly affordable comfort food lunch utilizing basic pantry staples with punchy garlic.'
  },
  {
    id: 'l3',
    name: 'Aesthetic Mediterranean Chickpea Salad',
    type: 'lunch',
    prepTime: 12,
    energyRequired: 1,
    estimatedCost: 4.50,
    ingredients: [
      { name: 'Tomatoes', amount: '1 cup diced', category: 'Produce' },
      { name: 'Avocado', amount: '1 whole, diced', category: 'Produce' },
      { name: 'Feta Cheese', amount: '1/4 cup crumbled', category: 'Dairy & Eggs' },
      { name: 'Cucumbers', amount: '1 small, sliced', category: 'Produce' },
      { name: 'Lemon Juice', amount: '1 tbsp', category: 'Pantry' }
    ],
    instructions: [
      'In a medium bowl, combine diced tomatoes, cucumbers, and avocado.',
      'Gently fold in the crumbled feta cheese.',
      'Drizzle with olive oil, lemon juice, salt, and pepper.',
      'Toss lightly and serve cold. Incredible with crusty bread!'
    ],
    description: 'A gorgeous, colorful raw salad packed with healthy fats, crunchy cucumbers, and salty feta accents.'
  },
  {
    id: 'l4',
    name: 'Rustic Creamy Tomato Pasta',
    type: 'lunch',
    prepTime: 20,
    energyRequired: 3,
    estimatedCost: 5.20,
    ingredients: [
      { name: 'Pasta', amount: '8 oz', category: 'Pantry' },
      { name: 'Tomatoes', amount: '1 can crushed', category: 'Pantry' },
      { name: 'Garlic', amount: '4 cloves, minced', category: 'Produce' },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy & Eggs' },
      { name: 'Cheese', amount: '1/4 cup parmesan', category: 'Dairy & Eggs' }
    ],
    instructions: [
      'Boil pasta in salted water according to package directions.',
      'In a pan, melt butter and saute garlic over medium heat for 1 minute.',
      'Add crushed tomatoes, salt, and pepper, letting it simmer for 8-10 minutes to thicken.',
      'Stir in half of the parmesan cheese into the sauce.',
      'Drain pasta, toss it directly into the sauce, and garnish with the remaining parmesan.'
    ],
    description: 'A classic rich tomato sauce cooked with butter and garlic, coating tender al dente pasta.'
  },
  {
    id: 'l5',
    name: 'Chef-Style Chicken Avocado Wrap',
    type: 'lunch',
    prepTime: 25,
    energyRequired: 3,
    estimatedCost: 7.50,
    ingredients: [
      { name: 'Chicken', amount: '6 oz breast, sliced', category: 'Meat & Seafood' },
      { name: 'Avocado', amount: '1/2 mashed', category: 'Produce' },
      { name: 'Spinach', amount: '1 cup', category: 'Produce' },
      { name: 'Bread', amount: '2 large tortillas/wraps', category: 'Pantry' },
      { name: 'Butter', amount: '1 tbsp', category: 'Dairy & Eggs' }
    ],
    instructions: [
      'Season sliced chicken with salt, pepper, and garlic powder.',
      'Melt butter in a pan and cook the chicken slices for 6-8 minutes until fully cooked and golden.',
      'Spread mashed avocado on the wrap, layer fresh spinach and the warm chicken.',
      'Roll tightly, slice in half, and enjoy warm.'
    ],
    description: 'A protein-packed wrap with warm seasoned chicken, smooth avocado mash, and fresh greens.'
  },
  {
    id: 'l6',
    name: 'Golden Chicken & Veggie Stir-Fry',
    type: 'lunch',
    prepTime: 35,
    energyRequired: 4,
    estimatedCost: 9.00,
    ingredients: [
      { name: 'Chicken', amount: '8 oz breast, cubed', category: 'Meat & Seafood' },
      { name: 'Rice', amount: '1 cup dry', category: 'Pantry' },
      { name: 'Broccoli', amount: '1 head, chopped', category: 'Produce' },
      { name: 'Garlic', amount: '3 cloves, minced', category: 'Produce' },
      { name: 'Soy Sauce', amount: '2 tbsp', category: 'Pantry' }
    ],
    instructions: [
      'Cook rice in a small pot with 2 cups of water for 15-18 minutes until fluffy.',
      'Heat oil in a wok or large frying pan over high heat, cook chicken until browned (5-6 mins).',
      'Add broccoli and minced garlic, stir-frying frequently for 4-5 minutes.',
      'Pour soy sauce over the mixture, cook for 2 more minutes until sauce glazes the ingredients.',
      'Serve hot over a generous bed of warm rice.'
    ],
    description: 'An energizing, delicious hot stir-fry packed with clean protein, crisp broccoli, and savory garlic glaze.'
  },

  // DINNERS
  {
    id: 'd1',
    name: 'Ultimate Garlic Butter Pasta',
    type: 'dinner',
    prepTime: 15,
    energyRequired: 1,
    estimatedCost: 3.20,
    ingredients: [
      { name: 'Pasta', amount: '8 oz', category: 'Pantry' },
      { name: 'Garlic', amount: '5 cloves, thinly sliced', category: 'Produce' },
      { name: 'Butter', amount: '3 tbsp', category: 'Dairy & Eggs' },
      { name: 'Cheese', amount: '1/3 cup parmesan', category: 'Dairy & Eggs' },
      { name: 'Cinnamon', amount: '1 pinch (optional accent)', category: 'Pantry' }
    ],
    instructions: [
      'Cook pasta in salted boiling water. Reserve 1/2 cup of pasta water before draining.',
      'Melt butter in a large skillet over low-medium heat. Add sliced garlic and cook gently for 3 minutes until soft and fragrant (do not burn!).',
      'Add drained pasta and half the cheese into the skillet.',
      'Pour in a splash of the starch-rich pasta water and toss vigorously to emulsify the sauce.',
      'Top with the remaining cheese and fresh cracked black pepper.'
    ],
    description: 'An incredibly comforting Italian classic that relies on high-quality butter, toasted garlic, and creamy cheese.'
  },
  {
    id: 'd2',
    name: 'Cast-Iron Tomato Spinach Frittata',
    type: 'dinner',
    prepTime: 20,
    energyRequired: 2,
    estimatedCost: 4.80,
    ingredients: [
      { name: 'Eggs', amount: '6 large', category: 'Dairy & Eggs' },
      { name: 'Tomatoes', amount: '1 medium, sliced', category: 'Produce' },
      { name: 'Spinach', amount: '2 cups fresh', category: 'Produce' },
      { name: 'Cheese', amount: '1/2 cup shredded', category: 'Dairy & Eggs' },
      { name: 'Butter', amount: '1 tbsp', category: 'Dairy & Eggs' }
    ],
    instructions: [
      'Preheat oven to 400°F (or cook entirely on stovetop covered with lid).',
      'Whisk eggs with a splash of milk, salt, pepper, and half of the cheese.',
      'Melt butter in an oven-safe skillet, cook spinach until wilted.',
      'Pour in the egg mixture and cook undisturbed for 3 minutes until bottom sets.',
      'Arrange tomato slices and scatter the remaining cheese over the top.',
      'Transfer skillet to oven for 8-10 minutes until puffed and golden brown.'
    ],
    description: 'A beautiful, fluffy baked egg dish loaded with melting cheese, vibrant spinach, and caramelized tomatoes.'
  },
  {
    id: 'd3',
    name: 'Twice-Baked Cheese & Garlic Potatoes',
    type: 'dinner',
    prepTime: 40,
    energyRequired: 2,
    estimatedCost: 3.90,
    ingredients: [
      { name: 'Potatoes', amount: '3 large russets', category: 'Produce' },
      { name: 'Cheese', amount: '1/2 cup cheddar', category: 'Dairy & Eggs' },
      { name: 'Garlic', amount: '3 cloves, minced', category: 'Produce' },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy & Eggs' },
      { name: 'Milk', amount: '1/4 cup', category: 'Dairy & Eggs' }
    ],
    instructions: [
      'Poke potatoes with a fork and microwave for 8-10 minutes (flipping halfway) until soft.',
      'Slice off the top third of each potato. Scoop out the warm insides, leaving a sturdy shell.',
      'Mash the potato flesh with butter, milk, minced garlic, salt, and half the cheese.',
      'Spoon the fluffy seasoned mash back into the potato skins.',
      'Top with remaining cheese and bake or microwave for 2 minutes to melt.'
    ],
    description: 'Crispy skin shells loaded with fluffy, garlic-scented mashed potato filling and melting cheddar cheese.'
  },
  {
    id: 'd4',
    name: 'Herb Grilled Chicken & Crispy Potatoes',
    type: 'dinner',
    prepTime: 35,
    energyRequired: 3,
    estimatedCost: 8.50,
    ingredients: [
      { name: 'Chicken', amount: '12 oz breast', category: 'Meat & Seafood' },
      { name: 'Potatoes', amount: '3 medium, cubed', category: 'Produce' },
      { name: 'Garlic', amount: '4 cloves, minced', category: 'Produce' },
      { name: 'Olive Oil', amount: '2 tbsp', category: 'Pantry' },
      { name: 'Butter', amount: '1 tbsp', category: 'Dairy & Eggs' }
    ],
    instructions: [
      'Toss cubed potatoes with olive oil, salt, pepper, and garlic. Cook in a skillet or oven at 420°F for 20 mins until crispy.',
      'Season chicken breasts with salt, pepper, and dried herbs of choice.',
      'Melt butter with a drop of oil in a medium skillet. Cook chicken breasts for 6-7 minutes per side until the center reaches 165°F.',
      'Let chicken rest for 5 minutes before slicing, then serve hot alongside the crispy potato hash.'
    ],
    description: 'A classic, comforting steakhouse-style plate featuring juicy seared chicken breast and golden crispy garlic potatoes.'
  },
  {
    id: 'd5',
    name: 'Creamy Tuscan Spinach Chicken Pasta',
    type: 'dinner',
    prepTime: 45,
    energyRequired: 4,
    estimatedCost: 11.20,
    ingredients: [
      { name: 'Chicken', amount: '10 oz breast, cubed', category: 'Meat & Seafood' },
      { name: 'Pasta', amount: '8 oz', category: 'Pantry' },
      { name: 'Spinach', amount: '2 cups', category: 'Produce' },
      { name: 'Tomatoes', amount: '2 medium, chopped', category: 'Produce' },
      { name: 'Milk', amount: '1/2 cup', category: 'Dairy & Eggs' },
      { name: 'Cheese', amount: '1/3 cup parmesan', category: 'Dairy & Eggs' }
    ],
    instructions: [
      'Boil pasta in salted water. Drain and set aside.',
      'Sear cubed chicken in a hot oiled skillet with salt and pepper until cooked (6-8 mins). Set chicken aside.',
      'In the same skillet, saute chopped tomatoes and spinach until wilted.',
      'Pour in milk, a spoonful of butter, and parmesan. Simmer for 3 minutes to create a creamy reduction.',
      'Return chicken and cooked pasta to the skillet, tossing everything until coated in the rich, pink cream sauce.'
    ],
    description: 'A gourmet-level, luscious pasta dish loaded with pan-seared chicken, spinach, and juicy tomatoes.'
  },
  {
    id: 'd6',
    name: 'Gourmet Roasted Salmon & Crispy Broccoli',
    type: 'dinner',
    prepTime: 30,
    energyRequired: 5,
    estimatedCost: 16.50,
    ingredients: [
      { name: 'Salmon', amount: '2 fillets (approx. 10 oz)', category: 'Meat & Seafood' },
      { name: 'Broccoli', amount: '1 large head, florets', category: 'Produce' },
      { name: 'Garlic', amount: '3 cloves, minced', category: 'Produce' },
      { name: 'Lemon Juice', amount: '2 tbsp', category: 'Pantry' },
      { name: 'Olive Oil', amount: '2 tbsp', category: 'Pantry' }
    ],
    instructions: [
      'Preheat your oven to 400°F (200°C).',
      'Toss broccoli florets in olive oil, minced garlic, salt, and pepper on a baking sheet.',
      'Pat salmon fillets dry and place them alongside the broccoli on the baking sheet.',
      'Drizzle salmon with olive oil, lemon juice, salt, and pepper.',
      'Roast in the oven for 12-15 minutes until salmon is flaky and broccoli edges are crispy.',
      'Serve hot with a fresh lemon wedge.'
    ],
    description: 'An elegant, high-nutrient dinner featuring succulent roasted salmon and garlic-toasted charred broccoli.'
  }
];

export const SUGGESTED_INGREDIENTS = [
  'Eggs', 'Bread', 'Avocado', 'Bananas', 'Oats', 'Milk', 'Spinach',
  'Cheese', 'Potatoes', 'Garlic', 'Tomatoes', 'Pasta', 'Chicken',
  'Broccoli', 'Rice', 'Salmon'
];
