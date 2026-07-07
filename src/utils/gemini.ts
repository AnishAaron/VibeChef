import { UserProfile, DailyPlanResponse } from '../types';

export async function generatePlanDirectlyFromBrowser(apiKey: string, profile: UserProfile): Promise<DailyPlanResponse> {
  const {
    timeBreakfast,
    timeLunch,
    timeDinner,
    energyLevel,
    ingredientsToUse,
    maxBudget,
  } = profile;

  const pantryStr = ingredientsToUse && ingredientsToUse.length > 0 
    ? ingredientsToUse.join(", ") 
    : "none specified";

  const systemInstruction = `You are an elite personal chef specializing in authentic Indian home cooking and meal planning algorithms.
Your goal is to build a highly customized, exact Indian meal plan comprising Breakfast, Lunch, and Dinner.
Focus on traditional Indian comfort foods and ingredients (e.g., Poha, Upma, Idli, Dosa, Roti-Sabji, Dal, Khichdi, Chole, Paneer, Egg Bhurji, Paratha, Pulav, Biryani, etc.). Avoid western processed ingredients like heavy cheese, cream cheese, avocado, bacon unless explicitly mentioned in the pantry items to use.
The meal plan must STRICTLY fit within the following physical and financial user constraints:
- Breakfast Cooking Time: max ${timeBreakfast} minutes.
- Lunch Cooking Time: max ${timeLunch} minutes.
- Dinner Cooking Time: max ${timeDinner} minutes.
- Physical Energy/Stamina Level required to cook: maximum ${energyLevel} on a scale of 1 to 5.
- Pantry ingredients to clear and use up: ${pantryStr}. Always prioritize using these in the meals if possible!
- Maximum Daily Cost of all ingredients combined: ₹${maxBudget} INR (Indian Rupees). The cumulative cost of Breakfast + Lunch + Dinner MUST NOT exceed this budget!

Provide the following in your JSON response structure:
1. "mealPlan": An object with "breakfast", "lunch", and "dinner". Each meal has:
   - "name": Aesthetic, appetizing title (e.g., "Aromatic Jeera Rice with Tadka Dal").
   - "prepTime": Number in minutes (must be <= allowed time limit).
   - "energyScore": Number 1-5 (must be <= active stamina ${energyLevel}).
   - "cost": Number in INR representing ingredients cost.
   - "description": Enticing description detailing flavor notes, spices, and why it fits their constraints.
   - "ingredients": Array of ingredients, each with "name", "amount", and "category" (e.g. "Produce", "Dairy & Eggs", "Meat & Seafood", "Pantry", "Grains & Lentils").
   - "instructions": Chronological recipe instructions.
2. "cookingTodoList": A combined, chronological cooking task list of instructions for the entire day with actionable timestamps.
3. "groceryList": Categorized list of grocery items needed that are NOT already in the pantry. Group items by supermarket category. Each grocery item must have a name, amount, estimatedPrice (in INR), and a "substitution" (a smart Indian alternative ingredient if the store is out of stock).

Do not produce generic responses. Craft real, mouthwatering, practical Indian recipes that match their criteria. Ensure all constraints are mathematically satisfied!`;

  const prompt = `Generate a strict JSON Indian meal plan satisfying:
Time constraints: Breakfast: ${timeBreakfast} mins, Lunch: ${timeLunch} mins, Dinner: ${timeDinner} mins.
Energy rating: max ${energyLevel}/5.
Maximize clearance of these pantry items: ${pantryStr}.
Total budget limit: ₹${maxBudget} INR (Indian Rupees).`;

  const responseSchema = {
    type: "OBJECT",
    properties: {
      mealPlan: {
        type: "OBJECT",
        properties: {
          breakfast: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              prepTime: { type: "INTEGER", description: "Total cooking and prep time in minutes" },
              energyScore: { type: "INTEGER", description: "Energy/complexity rating from 1 to 5" },
              cost: { type: "NUMBER", description: "Estimated cost in Indian Rupees (INR/₹)" },
              description: { type: "STRING" },
              ingredients: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    amount: { type: "STRING" },
                    category: { type: "STRING" }
                  },
                  required: ["name", "amount", "category"]
                }
              },
              instructions: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            },
            required: ["name", "prepTime", "energyScore", "cost", "description", "ingredients", "instructions"]
          },
          lunch: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              prepTime: { type: "INTEGER", description: "Total cooking and prep time in minutes" },
              energyScore: { type: "INTEGER", description: "Energy/complexity rating from 1 to 5" },
              cost: { type: "NUMBER", description: "Estimated cost in Indian Rupees (INR/₹)" },
              description: { type: "STRING" },
              ingredients: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    amount: { type: "STRING" },
                    category: { type: "STRING" }
                  },
                  required: ["name", "amount", "category"]
                }
              },
              instructions: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            },
            required: ["name", "prepTime", "energyScore", "cost", "description", "ingredients", "instructions"]
          },
          dinner: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              prepTime: { type: "INTEGER", description: "Total cooking and prep time in minutes" },
              energyScore: { type: "INTEGER", description: "Energy/complexity rating from 1 to 5" },
              cost: { type: "NUMBER", description: "Estimated cost in Indian Rupees (INR/₹)" },
              description: { type: "STRING" },
              ingredients: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    amount: { type: "STRING" },
                    category: { type: "STRING" }
                  },
                  required: ["name", "amount", "category"]
                }
              },
              instructions: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            },
            required: ["name", "prepTime", "energyScore", "cost", "description", "ingredients", "instructions"]
          }
        },
        required: ["breakfast", "lunch", "dinner"]
      },
      cookingTodoList: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            time: { type: "STRING", description: "Actionable clock time or prep phase label, e.g., '08:00 AM' or 'Step 1: Prep'" },
            mealType: { type: "STRING", description: "Must be breakfast, lunch, or dinner" },
            instruction: { type: "STRING" }
          },
          required: ["time", "mealType", "instruction"]
        }
      },
      groceryList: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            category: { type: "STRING", description: "Produce, Dairy & Eggs, Meat & Seafood, Pantry, Bakery, etc." },
            items: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  amount: { type: "STRING" },
                  estimatedPrice: { type: "NUMBER", description: "Estimated cost of this grocery item in Indian Rupees (INR/₹)" },
                  substitution: { type: "STRING", description: "An alternative ingredient if out of stock" }
                },
                required: ["name", "amount", "estimatedPrice", "substitution"]
              }
            }
          },
          required: ["category", "items"]
        }
      }
    },
    required: ["mealPlan", "cookingTodoList", "groceryList"]
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      systemInstruction: {
        parts: [
          {
            text: systemInstruction
          }
        ]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "Failed to communicate with Gemini API.";
    try {
      const errJson = JSON.parse(errorText);
      errorMessage = errJson.error?.message || errorMessage;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response received from Gemini.");
  }

  return JSON.parse(text.trim());
}
