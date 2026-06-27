export interface UserProfile {
  timeBreakfast: number; // in minutes
  timeLunch: number; // in minutes
  timeDinner: number; // in minutes
  energyLevel: number; // 1 to 5
  ingredientsToUse: string[];
  maxBudget: number; // in dollars
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  prepTime: number; // in minutes
  energyRequired: number; // 1 to 5
  estimatedCost: number; // in dollars
  ingredients: { name: string; amount: string; category: string }[];
  instructions: string[];
  description: string;
  image?: string;
}

export interface GroceryItem {
  name: string;
  amount: string;
  category: string;
  isOwned: boolean;
  isCompleted: boolean;
}

export interface CookingStep {
  mealId: string;
  mealName: string;
  text: string;
  isCompleted: boolean;
}

export interface GeneratedMeal {
  name: string;
  prepTime: number;
  energyScore: number;
  cost: number;
  description: string;
  ingredients: { name: string; amount: string; category: string }[];
  instructions: string[];
}

export interface GeneratedMealPlan {
  breakfast: GeneratedMeal;
  lunch: GeneratedMeal;
  dinner: GeneratedMeal;
}

export interface GeneratedTodoItem {
  time: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  instruction: string;
  isCompleted?: boolean;
}

export interface GeneratedGroceryItem {
  name: string;
  amount: string;
  estimatedPrice: number;
  substitution: string;
  isCompleted?: boolean;
}

export interface GeneratedGroceryCategory {
  category: string;
  items: GeneratedGroceryItem[];
}

export interface DailyPlanResponse {
  mealPlan: GeneratedMealPlan;
  cookingTodoList: GeneratedTodoItem[];
  groceryList: GeneratedGroceryCategory[];
}

export interface HistoryRecord {
  id: string;
  createdAt: string; // ISO string
  profile: UserProfile;
  plan: DailyPlanResponse;
}

