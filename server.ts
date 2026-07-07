import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HISTORY_FILE = path.join(__dirname, "src", "data", "history.json");

// Ensure data folder exists
const dataDir = path.join(__dirname, "src", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure history.json file exists with empty array if missing
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2), "utf-8");
}

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper to read history
function readHistory(): any[] {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const content = fs.readFileSync(HISTORY_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error reading history file:", error);
  }
  return [];
}

// Helper to write history
function writeHistory(data: any[]) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing history file:", error);
  }
}

// --- API ROUTES ---

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", apiKeyConfigured: !!process.env.GEMINI_API_KEY });
});

// GET user history timeline
app.get("/api/history", (req, res) => {
  const history = readHistory();
  res.json(history);
});

// POST to save a plan directly to history
app.post("/api/history", (req, res) => {
  const { profile, plan } = req.body;
  if (!profile || !plan) {
    return res.status(400).json({ error: "Profile and generated plan are required" });
  }

  const history = readHistory();
  const newRecord = {
    id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    profile,
    plan,
  };

  history.unshift(newRecord); // newest first
  writeHistory(history);
  res.status(201).json(newRecord);
});

// DELETE a historical plan from the timeline
app.delete("/api/history/:id", (req, res) => {
  const { id } = req.params;
  const history = readHistory();
  const updatedHistory = history.filter((item) => item.id !== id);
  writeHistory(updatedHistory);
  res.json({ success: true, message: `Record ${id} deleted successfully.` });
});

// POST to generate a new customized Daily Plan via structured Gemini AI
app.post("/api/generate-plan", async (req, res) => {
  const { profile } = req.body;
  if (!profile) {
    return res.status(400).json({ error: "User profile data is required" });
  }

  const {
    timeBreakfast,
    timeLunch,
    timeDinner,
    energyLevel,
    ingredientsToUse,
    maxBudget,
  } = profile;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({
      error: "Gemini API Key is not configured. Please add your GEMINI_API_KEY inside the Settings > Secrets menu to activate generation.",
    });
  }

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

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mealPlan: {
              type: Type.OBJECT,
              properties: {
                breakfast: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    prepTime: { type: Type.INTEGER, description: "Total cooking and prep time in minutes" },
                    energyScore: { type: Type.INTEGER, description: "Energy/complexity rating from 1 to 5" },
                    cost: { type: Type.NUMBER, description: "Estimated cost in Indian Rupees (INR/₹)" },
                    description: { type: Type.STRING },
                    ingredients: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          amount: { type: Type.STRING },
                          category: { type: Type.STRING }
                        },
                        required: ["name", "amount", "category"]
                      }
                    },
                    instructions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["name", "prepTime", "energyScore", "cost", "description", "ingredients", "instructions"]
                },
                lunch: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    prepTime: { type: Type.INTEGER, description: "Total cooking and prep time in minutes" },
                    energyScore: { type: Type.INTEGER, description: "Energy/complexity rating from 1 to 5" },
                    cost: { type: Type.NUMBER, description: "Estimated cost in Indian Rupees (INR/₹)" },
                    description: { type: Type.STRING },
                    ingredients: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          amount: { type: Type.STRING },
                          category: { type: Type.STRING }
                        },
                        required: ["name", "amount", "category"]
                      }
                    },
                    instructions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["name", "prepTime", "energyScore", "cost", "description", "ingredients", "instructions"]
                },
                dinner: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    prepTime: { type: Type.INTEGER, description: "Total cooking and prep time in minutes" },
                    energyScore: { type: Type.INTEGER, description: "Energy/complexity rating from 1 to 5" },
                    cost: { type: Type.NUMBER, description: "Estimated cost in Indian Rupees (INR/₹)" },
                    description: { type: Type.STRING },
                    ingredients: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          amount: { type: Type.STRING },
                          category: { type: Type.STRING }
                        },
                        required: ["name", "amount", "category"]
                      }
                    },
                    instructions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["name", "prepTime", "energyScore", "cost", "description", "ingredients", "instructions"]
                }
              },
              required: ["breakfast", "lunch", "dinner"]
            },
            cookingTodoList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING, description: "Actionable clock time or prep phase label, e.g., '08:00 AM' or 'Step 1: Prep'" },
                  mealType: { type: Type.STRING, description: "Must be breakfast, lunch, or dinner" },
                  instruction: { type: Type.STRING }
                },
                required: ["time", "mealType", "instruction"]
              }
            },
            groceryList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "Produce, Dairy & Eggs, Meat & Seafood, Pantry, Bakery, etc." },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        amount: { type: Type.STRING },
                        estimatedPrice: { type: Type.NUMBER, description: "Estimated cost of this grocery item in Indian Rupees (INR/₹)" },
                        substitution: { type: Type.STRING, description: "An alternative ingredient if out of stock" }
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
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini.");
    }

    const parsedPlan = JSON.parse(text.trim());
    res.json(parsedPlan);
  } catch (err: any) {
    console.error("Gemini Generation Error:", err);
    res.status(500).json({
      error: "Failed to generate plan via Gemini. Ensure your key is correct and try again.",
      details: err.message,
    });
  }
});

// --- VITE MIDDLEWARE CONFIG ---

async function startViteServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use("/VibeChef", express.static(distPath));
    app.get("/", (req, res) => {
      res.redirect("/VibeChef/");
    });
    app.get("/VibeChef/*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startViteServer();
