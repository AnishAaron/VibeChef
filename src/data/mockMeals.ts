import { Meal } from '../types';

export const ALL_MEALS: Meal[] = [
  // BREAKFASTS
  {
    id: 'b1',
    name: 'Kanda Poha with Peanuts',
    type: 'breakfast',
    prepTime: 12,
    energyRequired: 1,
    estimatedCost: 35,
    ingredients: [
      { name: 'Poha (Flattened Rice)', amount: '1.5 cups', category: 'Pantry' },
      { name: 'Onions (Pyaz)', amount: '1 medium, chopped', category: 'Produce' },
      { name: 'Peanuts (Moongfali)', amount: '2 tbsp', category: 'Pantry' },
      { name: 'Green Chilies', amount: '2, slit', category: 'Produce' },
      { name: 'Mustard Seeds (Rai)', amount: '1/2 tsp', category: 'Pantry' },
      { name: 'Curry Leaves', amount: '6-8 leaves', category: 'Produce' }
    ],
    instructions: [
      'Rinse Poha under running water in a colander until soft but not mushy. Add turmeric and salt to it, toss gently, and keep aside.',
      'Heat oil in a pan, roast peanuts until crunchy, and set aside.',
      'In the same pan, add mustard seeds, curry leaves, and green chilies. Let them splutter.',
      'Add chopped onions and sauté until translucent.',
      'Add the soaked poha and roasted peanuts, stir gently on low heat for 3-4 minutes.',
      'Garnish with fresh coriander and a squeeze of fresh lemon juice before serving hot.'
    ],
    description: 'A classic, light, yet incredibly satisfying Indian breakfast featuring fluffy seasoned flattened rice tossed with caramelized onions and crunchy roasted peanuts.'
  },
  {
    id: 'b2',
    name: 'Quick Masala Oats Bowl',
    type: 'breakfast',
    prepTime: 10,
    energyRequired: 1,
    estimatedCost: 30,
    ingredients: [
      { name: 'Oats', amount: '1/2 cup', category: 'Pantry' },
      { name: 'Onions (Pyaz)', amount: '1/2 medium, chopped', category: 'Produce' },
      { name: 'Tomatoes', amount: '1/2 medium, chopped', category: 'Produce' },
      { name: 'Green Chilies', amount: '1, chopped', category: 'Produce' },
      { name: 'Ginger-Garlic Paste', amount: '1/2 tsp', category: 'Pantry' },
      { name: 'Ghee or Oil', amount: '1 tsp', category: 'Pantry' }
    ],
    instructions: [
      'Heat ghee or oil in a pan, sauté onions, green chilies, and ginger-garlic paste until onions are soft.',
      'Add tomatoes and cook for 2 minutes until soft.',
      'Toss in oats, a pinch of turmeric, garam masala, and salt. Stir for 1 minute.',
      'Add 1.5 cups of water and bring to a simmer.',
      'Cook covered on medium-low heat for 5-6 minutes until creamy and oats are cooked. Serve warm.'
    ],
    description: 'A warm, savory, fiber-packed breakfast bowl spiced with Indian masala, perfect for a quick and nutritious morning start.'
  },
  {
    id: 'b3',
    name: 'Besan Chilla (Savory Gram Flour Crepes)',
    type: 'breakfast',
    prepTime: 15,
    energyRequired: 2,
    estimatedCost: 40,
    ingredients: [
      { name: 'Besan (Gram Flour)', amount: '1 cup', category: 'Pantry' },
      { name: 'Onions (Pyaz)', amount: '1/2 medium, finely chopped', category: 'Produce' },
      { name: 'Tomatoes', amount: '1/2 medium, finely chopped', category: 'Produce' },
      { name: 'Green Chilies', amount: '1, finely chopped', category: 'Produce' },
      { name: 'Coriander Leaves', amount: '2 tbsp, chopped', category: 'Produce' },
      { name: 'Oil', amount: '2 tsp', category: 'Pantry' }
    ],
    instructions: [
      'In a mixing bowl, combine besan, chopped onions, tomatoes, chilies, coriander, salt, and a pinch of carom seeds (ajwain).',
      'Whisk in water gradually to make a smooth, pouring consistency batter (similar to pancake batter).',
      'Heat a non-stick tawa or flat griddle and grease it lightly with oil.',
      'Pour a ladleful of batter and spread it gently in a circular motion to make a thin crepe.',
      'Drizzle a few drops of oil around the edges and cook on medium heat until the base turns golden and crispy.',
      'Flip and cook the other side for another 1-2 minutes. Serve hot with green chutney or ketchup.'
    ],
    description: 'High-protein, gluten-free savory crepes made from chickpea flour, flavored with fresh vegetables and warm spices.'
  },
  {
    id: 'b4',
    name: 'Home-style Paneer Bhurji Toast',
    type: 'breakfast',
    prepTime: 15,
    energyRequired: 2,
    estimatedCost: 75,
    ingredients: [
      { name: 'Paneer (Cottage Cheese)', amount: '100g, crumbled', category: 'Dairy & Eggs' },
      { name: 'Bread', amount: '4 slices', category: 'Pantry' },
      { name: 'Onions (Pyaz)', amount: '1/2 medium, chopped', category: 'Produce' },
      { name: 'Tomatoes', amount: '1/2 medium, chopped', category: 'Produce' },
      { name: 'Butter', amount: '1 tbsp', category: 'Dairy & Eggs' },
      { name: 'Turmeric & Garam Masala', amount: '1/4 tsp each', category: 'Pantry' }
    ],
    instructions: [
      'Heat half the butter in a pan, sauté onions and green chilies until translucent.',
      'Add tomatoes and cook until soft and mushy.',
      'Add salt, turmeric, and garam masala. Toss in crumbled fresh paneer and mix well on low heat for 2-3 minutes.',
      'In a separate flat pan, toast the bread slices with the remaining butter until golden and crispy.',
      'Spoon the savory hot paneer bhurji generously over the warm toasts and serve.'
    ],
    description: 'An indulgent, protein-rich breakfast featuring scrambled fresh paneer cooked in a savory onion-tomato masala on butter-toasted bread.'
  },
  {
    id: 'b5',
    name: 'Aloo Paratha with Curd',
    type: 'breakfast',
    prepTime: 25,
    energyRequired: 3,
    estimatedCost: 55,
    ingredients: [
      { name: 'Atta (Wheat Flour)', amount: '1 cup', category: 'Pantry' },
      { name: 'Potatoes (Aloo)', amount: '2 medium, boiled & mashed', category: 'Produce' },
      { name: 'Curd (Dahi)', amount: '1/2 cup', category: 'Dairy & Eggs' },
      { name: 'Green Chilies', amount: '1, finely chopped', category: 'Produce' },
      { name: 'Ghee or Butter', amount: '1.5 tbsp', category: 'Dairy & Eggs' },
      { name: 'Kashmiri Red Chili Powder', amount: '1/2 tsp', category: 'Pantry' }
    ],
    instructions: [
      'Knead wheat flour with a pinch of salt and water into a smooth dough. Let it rest.',
      'In a bowl, mix mashed boiled potatoes, green chilies, coriander, salt, red chili powder, and a pinch of dry mango powder (amchur).',
      'Roll out a small ball of dough, place a portion of potato stuffing in the center, and pleat the edges to seal completely.',
      'Roll out gently into a flatbread, ensuring the stuffing doesn\'t spill.',
      'Cook on a hot griddle (tawa), flipping and spreading ghee or butter on both sides until crispy and speckled with golden spots.',
      'Serve blistering hot with a cup of cool, fresh curd (dahi).'
    ],
    description: 'The ultimate Indian comfort breakfast: whole wheat flatbread stuffed with spiced mashed potatoes, griddled with ghee, and served with cool yogurt.'
  },

  // LUNCHES
  {
    id: 'l1',
    name: 'Comforting Dal Khichdi with Ghee',
    type: 'lunch',
    prepTime: 20,
    energyRequired: 1,
    estimatedCost: 45,
    ingredients: [
      { name: 'Rice (Chawal)', amount: '1/2 cup', category: 'Pantry' },
      { name: 'Moong Dal', amount: '1/2 cup', category: 'Pantry' },
      { name: 'Ghee', amount: '1 tbsp', category: 'Dairy & Eggs' },
      { name: 'Onions (Pyaz)', amount: '1/2 medium, chopped', category: 'Produce' },
      { name: 'Tomatoes', amount: '1 small, chopped', category: 'Produce' },
      { name: 'Cumin Seeds (Jeera)', amount: '1/2 tsp', category: 'Pantry' }
    ],
    instructions: [
      'Wash rice and moong dal together. Drain well.',
      'In a pressure cooker or heavy pot, heat ghee. Add cumin seeds and let them splutter.',
      'Sauté onions, ginger, and green chilies until golden.',
      'Add tomatoes, turmeric, and salt. Cook until tomatoes are mushy.',
      'Add the washed rice and dal, roast for 1 minute, then add 3.5 cups of water.',
      'Pressure cook for 3 whistles (or cook covered in a pot for 18-20 minutes) until soft and thoroughly cooked. Serve hot with an extra drizzle of ghee.'
    ],
    description: 'A wholesome, comforting, single-pot meal of soft cooked rice and yellow lentils, lightly spiced and tempered with ghee and cumin.'
  },
  {
    id: 'l2',
    name: 'Roti & Jeera Aloo (Spiced Cumin Potatoes)',
    type: 'lunch',
    prepTime: 20,
    energyRequired: 2,
    estimatedCost: 40,
    ingredients: [
      { name: 'Potatoes (Aloo)', amount: '3 medium, boiled & cubed', category: 'Produce' },
      { name: 'Atta (Wheat Flour)', amount: '1 cup', category: 'Pantry' },
      { name: 'Cumin Seeds (Jeera)', amount: '1 tsp', category: 'Pantry' },
      { name: 'Oil or Ghee', amount: '1 tbsp', category: 'Pantry' },
      { name: 'Turmeric & Chili Powder', amount: '1/2 tsp each', category: 'Pantry' }
    ],
    instructions: [
      'Knead the atta with water into a soft dough. Roll out into thin round rotis.',
      'Cook the rotis on a hot griddle, puffing them over direct flame if possible. Wrap in a cloth to keep soft.',
      'Heat oil in a pan, add cumin seeds and let them crackle and darken slightly.',
      'Add cubed boiled potatoes, turmeric, chili powder, coriander powder, and salt.',
      'Sauté on medium-high heat for 5-7 minutes until the potatoes develop a crispy golden crust.',
      'Garnish with fresh coriander and serve alongside the warm soft rotis.'
    ],
    description: 'A beloved Indian dry vegetable dish featuring potatoes tossed with plenty of toasted cumin and traditional spices, paired with hand-rolled wheat rotis.'
  },
  {
    id: 'l3',
    name: 'Punjabi Chole with Steamed Rice',
    type: 'lunch',
    prepTime: 30,
    energyRequired: 3,
    estimatedCost: 70,
    ingredients: [
      { name: 'Chickpeas (Chole)', amount: '1 cup, soaked or boiled', category: 'Pantry' },
      { name: 'Rice (Chawal)', amount: '1 cup', category: 'Pantry' },
      { name: 'Onions (Pyaz)', amount: '1 large, finely chopped', category: 'Produce' },
      { name: 'Tomatoes', amount: '2 medium, pureed', category: 'Produce' },
      { name: 'Ginger-Garlic Paste', amount: '1 tsp', category: 'Pantry' },
      { name: 'Chole Masala powder', amount: '1.5 tsp', category: 'Pantry' }
    ],
    instructions: [
      'Cook rice in a pot with 2 cups of water and a pinch of salt until soft and fluffy. Drain and keep warm.',
      'Heat oil in a pan, sauté onions until golden brown. Add ginger-garlic paste and sauté for 1 minute.',
      'Pour in pureed tomatoes and cook until oil separates from the masala.',
      'Add chole masala, turmeric, red chili powder, salt, and the boiled chickpeas with 1 cup of water.',
      'Simmer on medium heat for 12-15 minutes, mashing a few chickpeas with the spoon to thicken the curry gravy.',
      'Garnish with green chilies and serve over warm steamed rice.'
    ],
    description: 'Hearty, spiced chickpea curry slow-simmered in a dark, tangy onion-tomato gravy, paired with fluffy basmati rice.'
  },
  {
    id: 'l4',
    name: 'Egg Curry with Steamed Rice',
    type: 'lunch',
    prepTime: 25,
    energyRequired: 3,
    estimatedCost: 75,
    ingredients: [
      { name: 'Eggs', amount: '3, boiled and peeled', category: 'Dairy & Eggs' },
      { name: 'Rice (Chawal)', amount: '1 cup', category: 'Pantry' },
      { name: 'Onions (Pyaz)', amount: '1 medium, finely chopped', category: 'Produce' },
      { name: 'Tomatoes', amount: '1 large, pureed', category: 'Produce' },
      { name: 'Ginger-Garlic Paste', amount: '1 tsp', category: 'Pantry' },
      { name: 'Garam Masala', amount: '1/2 tsp', category: 'Pantry' }
    ],
    instructions: [
      'Boil rice in water until soft and keep warm.',
      'Prick the boiled eggs with a fork. Sauté them in a pan with a pinch of turmeric and chili powder for 2 minutes until golden; set aside.',
      'In the same pan, heat more oil, sauté onions until soft, then add ginger-garlic paste.',
      'Add tomato puree, turmeric, red chili powder, coriander powder, and salt. Cook until oil separates.',
      'Add 1 cup of water, bring to a boil, then slide in the sautéed boiled eggs.',
      'Simmer for 8 minutes to let the eggs absorb the rich masala. Garnish with garam masala and serve with hot rice.'
    ],
    description: 'Pan-seared hard-boiled eggs cooked in a rich, deeply spiced onion-tomato curry, served alongside fresh steamed rice.'
  },
  {
    id: 'l5',
    name: 'Paneer Butter Masala with Roti',
    type: 'lunch',
    prepTime: 30,
    energyRequired: 4,
    estimatedCost: 120,
    ingredients: [
      { name: 'Paneer (Cottage Cheese)', amount: '150g, cubed', category: 'Dairy & Eggs' },
      { name: 'Atta (Wheat Flour)', amount: '1 cup', category: 'Pantry' },
      { name: 'Tomatoes', amount: '3 medium, pureed', category: 'Produce' },
      { name: 'Onions (Pyaz)', amount: '1 medium, chopped', category: 'Produce' },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy & Eggs' },
      { name: 'Curd (Dahi)', amount: '2 tbsp', category: 'Dairy & Eggs' }
    ],
    instructions: [
      'Prepare atta dough and roll out fresh soft rotis; set aside in a hot-pot.',
      'Melt butter in a pan, sauté onions and ginger until soft, then blend them with pureed tomatoes to make a smooth base.',
      'Cook this gravy in the pan, adding turmeric, Kashmiri red chili powder, garam masala, and salt until it thickens.',
      'Add a splash of water and the curd, mixing thoroughly on low heat.',
      'Slide in soft fresh paneer cubes and simmer gently for 5 minutes.',
      'Serve hot with a pat of butter on top alongside warm rotis.'
    ],
    description: 'A creamy, mildly sweet, orange-hued paneer curry made with butter, cashew or curd paste, tomato purée, and soft paneer cubes, paired with whole wheat rotis.'
  },

  // DINNERS
  {
    id: 'd1',
    name: 'Yellow Dal Tadka & Jeera Rice',
    type: 'dinner',
    prepTime: 20,
    energyRequired: 1,
    estimatedCost: 50,
    ingredients: [
      { name: 'Moong Dal or Toor Dal', amount: '3/4 cup', category: 'Pantry' },
      { name: 'Rice (Chawal)', amount: '1 cup', category: 'Pantry' },
      { name: 'Ghee', amount: '1.5 tbsp', category: 'Dairy & Eggs' },
      { name: 'Garlic', amount: '4 cloves, finely chopped', category: 'Produce' },
      { name: 'Cumin Seeds (Jeera)', amount: '1 tsp', category: 'Pantry' },
      { name: 'Onions (Pyaz)', amount: '1/2 medium, chopped', category: 'Produce' }
    ],
    instructions: [
      'Boil the lentils (dal) with turmeric, salt, and water in a pressure cooker or pot until completely mushy.',
      'Cook rice with 1 tsp of cumin seeds and a little ghee in water to make aromatic Jeera Rice.',
      'For the Tadka: Heat ghee in a small pan, add cumin seeds and let them brown.',
      'Add chopped garlic, dry red chilies, and a pinch of asafoetida (hing). Fry until garlic is golden and highly fragrant.',
      'Add chopped onions and a pinch of chili powder, sautéing for 2 minutes.',
      'Pour this sizzling aromatic ghee-garlic tempering directly over the hot boiled dal. Stir and serve over warm Jeera Rice.'
    ],
    description: 'The definitive Indian comfort food: creamy yellow lentils finished with a sizzling, fragrant tempering of ghee, cumin, and fried garlic, served with cumin-scented rice.'
  },
  {
    id: 'd2',
    name: 'Mixed Veg Pulav with Curd',
    type: 'dinner',
    prepTime: 25,
    energyRequired: 2,
    estimatedCost: 70,
    ingredients: [
      { name: 'Rice (Chawal)', amount: '1 cup basmati', category: 'Pantry' },
      { name: 'Potatoes (Aloo)', amount: '1 medium, cubed', category: 'Produce' },
      { name: 'Curd (Dahi)', amount: '1/2 cup', category: 'Dairy & Eggs' },
      { name: 'Green Peas & Carrots', amount: '1/2 cup, chopped', category: 'Produce' },
      { name: 'Onions (Pyaz)', amount: '1 medium, sliced', category: 'Produce' },
      { name: 'Whole Spices (Cardamom, Cloves)', amount: '1 pinch', category: 'Pantry' }
    ],
    instructions: [
      'Rinse basmati rice and soak for 15 minutes.',
      'In a pot or pressure cooker, heat oil or ghee. Add whole spices (cardamom, clove, cinnamon) and let them sizzle.',
      'Sauté sliced onions until lightly golden, then add ginger-garlic paste.',
      'Add cubed potatoes, peas, and carrots. Cook for 2-3 minutes.',
      'Drain the rice and add it to the veggies. Stir gently to coat with ghee/oil.',
      'Add 2 cups of water and salt. Bring to a boil, cover tightly, and cook on low heat for 12 minutes (or 1 whistle) until fluffy. Serve with cool dahi.'
    ],
    description: 'An aromatic, fragrant rice dish steamed with ghee, cardamom, cinnamon, and mixed vegetables, served with refreshing cold yogurt.'
  },
  {
    id: 'd3',
    name: 'Baingan Bharta (Roasted Eggplant) & Roti',
    type: 'dinner',
    prepTime: 30,
    energyRequired: 2,
    estimatedCost: 60,
    ingredients: [
      { name: 'Eggplant (Baingan)', amount: '1 large', category: 'Produce' },
      { name: 'Atta (Wheat Flour)', amount: '1 cup', category: 'Pantry' },
      { name: 'Onions (Pyaz)', amount: '1 large, finely chopped', category: 'Produce' },
      { name: 'Tomatoes', amount: '2 medium, chopped', category: 'Produce' },
      { name: 'Garlic', amount: '4 cloves, minced', category: 'Produce' },
      { name: 'Mustard Oil', amount: '1 tbsp', category: 'Pantry' }
    ],
    instructions: [
      'Make rotis using atta and water; set aside.',
      'Prick the eggplant and roast it directly over an open flame, turning frequently, until the skin is completely charred and the inside is tender (8-10 mins).',
      'Let it cool, peel off the charred skin, and mash the smoky flesh thoroughly.',
      'Heat mustard oil in a pan, sauté minced garlic and onions until brown.',
      'Add tomatoes, green chilies, turmeric, red chili powder, and salt. Cook until mushy.',
      'Stir in the mashed smoky eggplant and cook on medium-low heat for 10 minutes to blend the flavors. Garnish with coriander.'
    ],
    description: 'Flame-roasted eggplant mashed and sautéed with mustard oil, pungent garlic, onions, and ripe tomatoes to create a deeply smoky, savory side dish paired with wheat rotis.'
  },
  {
    id: 'd4',
    name: 'Home-style Egg Bhurji & Paratha',
    type: 'dinner',
    prepTime: 20,
    energyRequired: 2,
    estimatedCost: 65,
    ingredients: [
      { name: 'Eggs', amount: '3 large', category: 'Dairy & Eggs' },
      { name: 'Atta (Wheat Flour)', amount: '1 cup', category: 'Pantry' },
      { name: 'Onions (Pyaz)', amount: '1 large, finely chopped', category: 'Produce' },
      { name: 'Tomatoes', amount: '1 medium, chopped', category: 'Produce' },
      { name: 'Green Chilies', amount: '2, chopped', category: 'Produce' },
      { name: 'Ghee or Oil', amount: '1.5 tbsp', category: 'Dairy & Eggs' }
    ],
    instructions: [
      'Knead atta with salt and ghee into a dough. Roll out and fold into layered square parathas; fry with ghee on tawa until layered and crispy.',
      'In a skillet, heat ghee, sauté onions and green chilies until golden.',
      'Add chopped tomatoes, salt, turmeric, and a pinch of pav bhaji or garam masala. Sauté until tomatoes are soft.',
      'Whisk eggs in a bowl and pour directly into the pan.',
      'Stir continuously on medium heat until the eggs scramble and cook into soft, spiced, moist crumbs.',
      'Serve hot scrambled egg bhurji alongside the warm flaky parathas.'
    ],
    description: 'Spicy, street-style scrambled eggs cooked with finely chopped onions, green chilies, and tangy tomatoes, served with flaky multi-layered wheat flatbreads.'
  },
  {
    id: 'd5',
    name: 'Kadhai Paneer with Butter Roti',
    type: 'dinner',
    prepTime: 35,
    energyRequired: 4,
    estimatedCost: 140,
    ingredients: [
      { name: 'Paneer (Cottage Cheese)', amount: '150g, cubed', category: 'Dairy & Eggs' },
      { name: 'Atta (Wheat Flour)', amount: '1 cup', category: 'Pantry' },
      { name: 'Onions (Pyaz)', amount: '1 large, diced', category: 'Produce' },
      { name: 'Tomatoes', amount: '2 medium, pureed', category: 'Produce' },
      { name: 'Ginger-Garlic Paste', amount: '1 tsp', category: 'Pantry' },
      { name: 'Garam Masala', amount: '1 tsp', category: 'Pantry' }
    ],
    instructions: [
      'Roll out rotis from the wheat dough, toast on tawa, and smear with butter; keep warm.',
      'Heat oil in a pan, toss the diced capsicum and onions on high heat for 2 minutes until tender but crunchy; set aside.',
      'In the same pan, heat more oil, sauté ginger-garlic paste, then add pureed tomatoes.',
      'Sauté until oil leaves sides. Add turmeric, coriander powder, chili powder, and garam masala.',
      'Add 1/2 cup water, slide in the sautéed capsicum/onions, and paneer cubes.',
      'Simmer for 5-6 minutes on medium heat until the sauce thickens and coats the paneer.'
    ],
    description: 'A popular restaurant classic made of soft cottage cheese paneer cubes and crunchy bell peppers cooked in a spicy, freshly ground tomato masala sauce, paired with butter-topped rotis.'
  },
  {
    id: 'd6',
    name: 'Easy Chicken Tikka Masala & Paratha',
    type: 'dinner',
    prepTime: 40,
    energyRequired: 5,
    estimatedCost: 190,
    ingredients: [
      { name: 'Chicken', amount: '200g, boneless breast cubed', category: 'Meat & Seafood' },
      { name: 'Atta (Wheat Flour)', amount: '1 cup', category: 'Pantry' },
      { name: 'Onions (Pyaz)', amount: '1 large, finely chopped', category: 'Produce' },
      { name: 'Tomatoes', amount: '2 medium, pureed', category: 'Produce' },
      { name: 'Curd (Dahi)', amount: '3 tbsp', category: 'Dairy & Eggs' },
      { name: 'Ginger-Garlic Paste', amount: '1 tbsp', category: 'Pantry' }
    ],
    instructions: [
      'Marinate chicken cubes with curd, turmeric, chili powder, ginger-garlic paste, and salt for 10 minutes.',
      'Knead atta and make layered crisp pan-fried parathas with ghee.',
      'In a wide skillet, heat ghee/oil. Fry the marinated chicken cubes on high heat for 6-8 minutes until golden brown and cooked; remove from pan.',
      'In the same skillet, add chopped onions and sauté until brown. Add remaining ginger-garlic paste and sauté.',
      'Pour in tomato puree, spice powder, and salt. Cook until oil separates.',
      'Pour in 1/2 cup of water and slide the seared chicken back in. Simmer for 10 minutes until chicken is tender and gravy is thick and delicious.'
    ],
    description: 'Succulent boneless chicken pieces seared and slow-simmered in a luxurious, creamy spiced red onion-tomato gravy, served with golden flaky pan-fried parathas.'
  }
];

export const SUGGESTED_INGREDIENTS = [
  'Poha (Flattened Rice)', 'Paneer (Cottage Cheese)', 'Eggs', 'Potatoes (Aloo)', 
  'Onions (Pyaz)', 'Tomatoes', 'Atta (Wheat Flour)', 'Rice (Chawal)', 'Moong Dal', 
  'Curd (Dahi)', 'Chickpeas (Chole)', 'Oats', 'Garlic', 'Ghee', 'Butter', 'Ginger'
];
