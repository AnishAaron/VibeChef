import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  Zap, 
  ChefHat, 
  RefreshCw, 
  ClipboardList, 
  AlertTriangle,
  AlertCircle,
  ThumbsUp,
  Flame,
  UtensilsCrossed,
  Info,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { UserProfile, Meal, GroceryItem, CookingStep, DailyPlanResponse, GeneratedMeal, HistoryRecord } from '../types';
import { ALL_MEALS } from '../data/mockMeals';

interface MealPlannerProps {
  profile: UserProfile;
  currentPlan: DailyPlanResponse | null;
  onClearPlan?: () => void;
  isGenerating?: boolean;
}

export default function MealPlanner({ profile, currentPlan, onClearPlan, isGenerating }: MealPlannerProps) {
  // Map of category/type to selected offline meal ID
  const [selectedMealIds, setSelectedMealIds] = useState<{ breakfast: string; lunch: string; dinner: string }>({
    breakfast: '',
    lunch: '',
    dinner: ''
  });

  // Track checked groceries (by unique key: category-name)
  const [checkedGroceries, setCheckedGroceries] = useState<Record<string, boolean>>({});
  // Track completed cooking steps (by unique key: mealId-index or step-index)
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  // Track swapped/cheaper alternative ingredients
  const [swappedIngredients, setSwappedIngredients] = useState<Record<string, { name: string; price: number }>>({});
  // Currently expanded meal card for viewing details/steps
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);

  // Score and recommend offline meals based on user profile
  const scoredMeals = useMemo(() => {
    return ALL_MEALS.map(meal => {
      let score = 0;
      
      // 1. Time compatibility
      const targetTime = meal.type === 'breakfast' 
        ? profile.timeBreakfast 
        : meal.type === 'lunch' 
        ? profile.timeLunch 
        : profile.timeDinner;
        
      if (meal.prepTime <= targetTime) {
        score += 8; // High weight for fitting in time
      } else if (meal.prepTime <= targetTime + 10) {
        score += 2; // Moderate weight for slightly over
      } else {
        score -= 5; // Heavy penalty for taking too long
      }

      // 2. Energy compatibility
      if (meal.energyRequired <= profile.energyLevel) {
        score += 6; // Fits energy level
      } else {
        score -= (meal.energyRequired - profile.energyLevel) * 4; // Penalty grows with gap
      }

      // 3. Pantry matches (using up ingredients)
      let matchesCount = 0;
      meal.ingredients.forEach(ing => {
        const matchingPantry = profile.ingredientsToUse.some(pantryIng => 
          ing.name.toLowerCase().includes(pantryIng.toLowerCase()) ||
          pantryIng.toLowerCase().includes(ing.name.toLowerCase())
        );
        if (matchingPantry) {
          score += 5; // Bonus for utilizing pantry item
          matchesCount++;
        }
      });

      // 4. Budget fit helper (so it favors cheaper if budget is tight, else doesn't penalize much)
      if (profile.maxBudget < 250) {
        if (meal.estimatedCost > 100) score -= 8;
        else if (meal.estimatedCost < 50) score += 4;
      }

      return { meal, score, matchesCount };
    });
  }, [profile]);

  // Apply default recommendations on profile change or init
  useEffect(() => {
    const defaultBreakfasts = scoredMeals.filter(sm => sm.meal.type === 'breakfast').sort((a, b) => b.score - a.score);
    const defaultLunches = scoredMeals.filter(sm => sm.meal.type === 'lunch').sort((a, b) => b.score - a.score);
    const defaultDinners = scoredMeals.filter(sm => sm.meal.type === 'dinner').sort((a, b) => b.score - a.score);

    setSelectedMealIds({
      breakfast: defaultBreakfasts[0]?.meal.id || 'b1',
      lunch: defaultLunches[0]?.meal.id || 'l1',
      dinner: defaultDinners[0]?.meal.id || 'd1'
    });
    
    // Reset checked items to make it clean on new plans
    setCheckedGroceries({});
    setCompletedSteps({});
    setSwappedIngredients({});
  }, [profile, scoredMeals, currentPlan]);

  // Extract selected meals for standard/offline mode
  const selectedOfflineMeals = useMemo(() => {
    return {
      breakfast: ALL_MEALS.find(m => m.id === selectedMealIds.breakfast) || ALL_MEALS[0],
      lunch: ALL_MEALS.find(m => m.id === selectedMealIds.lunch) || ALL_MEALS[4],
      dinner: ALL_MEALS.find(m => m.id === selectedMealIds.dinner) || ALL_MEALS[8]
    };
  }, [selectedMealIds]);

  // Swap meals logic (cycles through compatible meals in that category) for standard/offline mode
  const handleSwapMeal = (type: 'breakfast' | 'lunch' | 'dinner') => {
    const candidates = scoredMeals
      .filter(sm => sm.meal.type === type)
      .sort((a, b) => b.score - a.score)
      .map(sm => sm.meal);

    const currentId = selectedMealIds[type];
    const currentIndex = candidates.findIndex(m => m.id === currentId);
    const nextIndex = (currentIndex + 1) % candidates.length;
    const nextMeal = candidates[nextIndex];

    if (nextMeal) {
      setSelectedMealIds(prev => ({
        ...prev,
        [type]: nextMeal.id
      }));
    }
  };

  // Compile Grocery List dynamically (standard or AI plan)
  const compiledGroceryList = useMemo(() => {
    if (currentPlan) {
      // AI plan grocery list (pre-categorized from server payload)
      return currentPlan.groceryList.map(category => ({
        category: category.category,
        items: category.items.map(item => {
          const lowerName = item.name.toLowerCase();
          const swap = swappedIngredients[lowerName] || swappedIngredients[item.name.toLowerCase().replace(/ \(.+?\)/g, '')] || null;
          return {
            name: swap ? swap.name : item.name,
            amount: item.amount,
            estimatedPrice: swap ? swap.price : item.estimatedPrice,
            substitution: item.substitution,
            isCompleted: checkedGroceries[`ai-${category.category}-${item.name}`] || false,
            isSwapped: !!swap,
            originalName: item.name,
            originalPrice: item.estimatedPrice
          };
        })
      }));
    }

    // Standard/Offline mode compile
    const itemsMap: Record<string, { name: string; amount: string; estimatedPrice: number; isOwned: boolean; substitution: string }[]> = {};
    const mealList = [selectedOfflineMeals.breakfast, selectedOfflineMeals.lunch, selectedOfflineMeals.dinner];

    mealList.forEach(meal => {
      meal.ingredients.forEach(ing => {
        const isOwned = profile.ingredientsToUse.some(pantryIng => 
          ing.name.toLowerCase().includes(pantryIng.toLowerCase()) ||
          pantryIng.toLowerCase().includes(ing.name.toLowerCase())
        );

        const category = ing.category || 'Pantry';
        if (!itemsMap[category]) {
          itemsMap[category] = [];
        }

        const existing = itemsMap[category].find(item => item.name.toLowerCase() === ing.name.toLowerCase());
        if (existing) {
          if (!existing.amount.includes(ing.amount)) {
            existing.amount = `${existing.amount} + ${ing.amount}`;
          }
        } else {
          // Mock simple estimated price and substitution
          const estPrice = Math.floor(10 + Math.random() * 60);
          itemsMap[category].push({
            name: ing.name,
            amount: ing.amount,
            estimatedPrice: estPrice,
            isOwned,
            substitution: `Organic ${ing.name}`
          });
        }
      });
    });

    return Object.keys(itemsMap).map(category => ({
      category,
      items: itemsMap[category].map(item => {
        const lowerName = item.name.toLowerCase();
        const swap = swappedIngredients[lowerName] || swappedIngredients[item.name.toLowerCase().replace(/ \(.+?\)/g, '')] || null;
        return {
          ...item,
          name: swap ? swap.name : item.name,
          estimatedPrice: swap ? swap.price : item.estimatedPrice,
          isCompleted: checkedGroceries[`std-${category}-${item.name}`] || false,
          isSwapped: !!swap,
          originalName: item.name,
          originalPrice: item.estimatedPrice
        };
      })
    }));
  }, [currentPlan, selectedOfflineMeals, profile.ingredientsToUse, checkedGroceries, swappedIngredients]);

  // Compile sequenced To-Do list / Cooking Steps
  const compiledCookingSteps = useMemo(() => {
    if (currentPlan) {
      // AI plan chronological steps
      return currentPlan.cookingTodoList.map((step, idx) => ({
        id: `ai-step-${idx}`,
        time: step.time,
        mealType: step.mealType,
        instruction: step.instruction,
        isCompleted: completedSteps[`ai-step-${idx}`] || false
      }));
    }

    // Standard/Offline chronological steps
    const steps: { id: string; time: string; mealType: 'breakfast' | 'lunch' | 'dinner'; instruction: string; isCompleted: boolean }[] = [];
    const types: ('breakfast' | 'lunch' | 'dinner')[] = ['breakfast', 'lunch', 'dinner'];

    types.forEach(type => {
      const meal = selectedOfflineMeals[type];
      meal.instructions.forEach((inst, index) => {
        const id = `${meal.id}-${index}`;
        // Map to standard mock timing representation
        const timing = type === 'breakfast' 
          ? `08:${String(0 + index * 5).padStart(2, '0')} AM` 
          : type === 'lunch' 
          ? `01:${String(15 + index * 5).padStart(2, '0')} PM` 
          : `06:${String(30 + index * 5).padStart(2, '0')} PM`;

        steps.push({
          id,
          time: timing,
          mealType: type,
          instruction: inst,
          isCompleted: completedSteps[id] || false
        });
      });
    });

    return steps;
  }, [currentPlan, selectedOfflineMeals, completedSteps]);

  // Total calculated cost of the grocery list
  const totalGroceryCost = useMemo(() => {
    return compiledGroceryList.reduce((acc, cat) => {
      return acc + cat.items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
    }, 0);
  }, [compiledGroceryList]);

  // Total daily cost of active plan
  const totalCost = useMemo(() => {
    return totalGroceryCost;
  }, [totalGroceryCost]);

  // Total grocery item count
  const totalGroceryItems = useMemo(() => {
    return compiledGroceryList.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [compiledGroceryList]);

  // Completed grocery item count
  const completedGroceryItemsCount = useMemo(() => {
    return compiledGroceryList.reduce((acc, cat) => acc + cat.items.filter(i => i.isCompleted).length, 0);
  }, [compiledGroceryList]);

  // Checkbox togglers
  const toggleGroceryItem = (category: string, name: string) => {
    const key = currentPlan ? `ai-${category}-${name}` : `std-${category}-${name}`;
    setCheckedGroceries(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleCookingStep = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  // Budget calculations
  const budgetDifference = profile.maxBudget - totalCost;
  const budgetRatio = totalCost / profile.maxBudget;
  const isOverBudget = budgetDifference < 0;
  
  let budgetColorClass = "text-emerald-600 bg-emerald-50 border-emerald-100";
  let budgetProgressColor = "bg-emerald-500";
  let budgetBadgeText = "Well Within Budget";
  let budgetIcon = <ThumbsUp className="w-5 h-5 text-emerald-600" />;

  if (budgetRatio > 1.0) {
    budgetColorClass = "text-red-700 bg-red-50 border-red-200";
    budgetProgressColor = "bg-red-500";
    budgetBadgeText = "Over Budget Spending";
    budgetIcon = <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />;
  } else if (budgetRatio > 0.85) {
    budgetColorClass = "text-amber-600 bg-amber-50 border-amber-100";
    budgetProgressColor = "bg-amber-500";
    budgetBadgeText = "Approaching Budget Cap";
    budgetIcon = <AlertCircle className="w-5 h-5 text-amber-600" />;
  }

  // Count matches in ingredients (offline mode helper)
  const getMatchesCount = (meal: Meal) => {
    return meal.ingredients.filter(ing => 
      profile.ingredientsToUse.some(pantryIng => 
        ing.name.toLowerCase().includes(pantryIng.toLowerCase()) ||
        pantryIng.toLowerCase().includes(ing.name.toLowerCase())
      )
    ).length;
  };

  // Helper for budget swap-out to low-cost Indian alternatives
  const getCheapAlternative = (originalName: string, originalPrice: number) => {
    const nameLower = originalName.toLowerCase();
    if (nameLower.includes('paneer') || nameLower.includes('cheese')) {
      return { name: 'Soya Chunks (Protein Rich)', price: Math.max(10, Math.floor(originalPrice * 0.25)) };
    }
    if (nameLower.includes('chicken') || nameLower.includes('meat') || nameLower.includes('seafood')) {
      return { name: 'Potatoes (Aloo)', price: Math.max(15, Math.floor(originalPrice * 0.2)) };
    }
    if (nameLower.includes('ghee') || nameLower.includes('butter')) {
      return { name: 'Refined Vegetable Oil', price: Math.max(10, Math.floor(originalPrice * 0.3)) };
    }
    if (nameLower.includes('curd') || nameLower.includes('dahi') || nameLower.includes('cream')) {
      return { name: 'Water / Lemon juice mix', price: 5 };
    }
    if (nameLower.includes('almond') || nameLower.includes('cashew') || nameLower.includes('nuts')) {
      return { name: 'Peanuts (Moongfali)', price: Math.max(10, Math.floor(originalPrice * 0.25)) };
    }
    return {
      name: `Local Brand ${originalName}`,
      price: Math.max(8, Math.floor(originalPrice * 0.5))
    };
  };

  // Identify non-swapped expensive items that can be optimized
  const expensiveItems = useMemo(() => {
    const allItems: { name: string; category: string; estimatedPrice: number; originalName: string; isSwapped: boolean }[] = [];
    compiledGroceryList.forEach(cat => {
      cat.items.forEach(item => {
        if (!item.isSwapped) {
          allItems.push({
            name: item.name,
            category: cat.category,
            estimatedPrice: item.estimatedPrice,
            originalName: item.originalName,
            isSwapped: item.isSwapped
          });
        }
      });
    });
    // Sort descending by price to find the ones causing the overage
    return allItems.sort((a, b) => b.estimatedPrice - a.estimatedPrice);
  }, [compiledGroceryList]);

  const handleSwapIngredients = (itemsToSwap: { name: string; originalName: string; estimatedPrice: number }[]) => {
    const updates: Record<string, { name: string; price: number }> = {};
    itemsToSwap.forEach(item => {
      const lowerOriginal = item.originalName.toLowerCase();
      const alt = getCheapAlternative(item.originalName, item.estimatedPrice);
      updates[lowerOriginal] = alt;
    });

    setSwappedIngredients(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Cooking progress calculation
  const totalStepsCount = compiledCookingSteps.length;
  const completedStepsCount = compiledCookingSteps.filter(s => s.isCompleted).length;
  const stepsCompletionPercentage = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  if (isGenerating) {
    return (
      <div id="ai-loading-container" className="bg-white rounded-2xl border border-stone-200 p-8 shadow-md flex flex-col items-center justify-center min-h-[450px] text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin" />
          <ChefHat className="w-7 h-7 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-lg font-bold text-stone-900 tracking-tight flex items-center justify-center gap-1.5">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> Consulting Personal AI Chef...
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed">
            Gemini is engineering your bespoke culinary blueprint! We are balancing preparation times, physical stamina loads, pantry clearance matching, and strict daily budget limits.
          </p>
        </div>
        <div className="w-full max-w-xs bg-stone-100 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className="bg-amber-500 h-full rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '90%' }}
            transition={{ duration: 8, ease: 'easeOut' }}
          />
        </div>
        <div className="text-[10px] text-stone-400 font-medium">
          Formatting custom ingredients, categories, alternatives, and chronological timeline...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Plan Header Block */}
      <div className="bg-white rounded-2xl border border-stone-150 p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-400 flex items-center gap-1.5">
              {currentPlan ? (
                <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 px-2 py-0.5 rounded-md border border-amber-300/30 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" /> AI Smart-Plan Loaded
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200 text-[10px] font-bold">
                  Offline Recommendations Matcher
                </span>
              )}
            </h3>
            {currentPlan && onClearPlan && (
              <button 
                onClick={onClearPlan}
                className="text-[10px] text-stone-400 hover:text-stone-600 font-semibold underline cursor-pointer"
              >
                Clear AI Plan
              </button>
            )}
          </div>
          <h2 className="text-lg font-bold tracking-tight text-stone-900">
            {currentPlan ? "Bespoke Daily Culinary Blueprint" : "Optimal Fast-Match Recommendations"}
          </h2>
          <p className="text-xs text-stone-500">
            {currentPlan 
              ? "This plan is generated purely for you, leveraging your exact budget, pantry, and energy constraints."
              : "Cycling through top-tier recipes matching your active profile parameters instantly."}
          </p>
        </div>

        {/* Profile Tag summary */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center text-[10px] bg-stone-100 text-stone-700 font-semibold px-2 py-1 rounded-md border border-stone-200">
            ⌛ B:{profile.timeBreakfast}m | L:{profile.timeLunch}m | D:{profile.timeDinner}m
          </span>
          <span className="inline-flex items-center text-[10px] bg-stone-100 text-stone-700 font-semibold px-2 py-1 rounded-md border border-stone-200">
            ⚡ Stamina: {profile.energyLevel}/5
          </span>
          {profile.ingredientsToUse.length > 0 && (
            <span className="inline-flex items-center text-[10px] bg-amber-50 text-amber-800 font-semibold px-2 py-1 rounded-md border border-amber-100">
              🥕 Pantry: {profile.ingredientsToUse.length} items
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Profile Active Tags & Budget Feasibility Indicator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Dynamic prompt summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-150 p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400 flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-stone-500" /> Plan Overview
            </h4>
            {currentPlan ? (
              <div className="p-3 bg-amber-50/40 border border-amber-100/50 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Chef Note:
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  These custom-calculated meals utilize your ingredients <strong>{profile.ingredientsToUse.join(", ")}</strong> and mathematically fit your max budget of <strong>₹{profile.maxBudget}</strong>. Substitutions are provided for key items.
                </p>
              </div>
            ) : (
              <p className="text-xs text-stone-600 leading-relaxed">
                Using our local sandbox database of Indian favorites to pair Kanda Poha, Aloo Paratha, Upma, Dal Khichdi, or Paneer Sabzi based on your time constraints. Select <strong>Generate Daily Plan</strong> in the wizard to activate bespoke AI recommendations.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-stone-400" />
              Checkboxes persist locally so you can cook throughout the day.
            </span>
          </div>
        </div>

        {/* Budget Feasibility Indicator Card */}
        <div className={`rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all duration-300 ${budgetColorClass}`}>
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest block opacity-75">
                  Budget Feasibility
                </span>
                <h4 className="text-base font-bold tracking-tight mt-0.5">
                  {budgetBadgeText}
                </h4>
              </div>
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                {budgetIcon}
              </div>
            </div>

            {/* Budget Visual Meter */}
            <div className="my-3.5 space-y-1.5">
              <div className="flex justify-between items-end text-xs font-mono">
                <span className="opacity-80">Daily Cost: <strong className="font-bold">₹{totalCost}</strong></span>
                <span className="font-bold">{Math.round(budgetRatio * 100)}% of max</span>
              </div>
              <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${budgetProgressColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budgetRatio * 100, 100)}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="text-xs font-medium leading-normal opacity-90 mb-1">
              {isOverBudget ? (
                <p>⚠️ Over limit by <span className="font-bold">₹{Math.abs(budgetDifference)}</span>. Try adjusting your profile limits or budget setting.</p>
              ) : (
                <p>🎉 Saving <span className="font-bold">₹{budgetDifference}</span> today! You are perfectly within your daily spending range.</p>
              )}
            </div>
          </div>

          {isOverBudget && expensiveItems.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-red-200/30 text-xs space-y-2.5">
              <p className="font-semibold text-red-900 bg-red-100/80 px-2 py-1 rounded border border-red-200/50">
                🚨 Budget overage driven by these premium ingredients:
              </p>
              <div className="space-y-1.5 max-h-[85px] overflow-y-auto pl-1">
                {expensiveItems.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] font-medium text-red-950">
                    <span>• {item.name}</span>
                    <span>₹{item.estimatedPrice}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleSwapIngredients(expensiveItems.slice(0, 3))}
                className="w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] py-1.5 px-2 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> Auto-Swap for Cheap Alternatives
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Daily Completion Progress Bar */}
      {compiledCookingSteps.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 rounded-2xl border border-amber-500/20 p-4.5 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
            <div className="space-y-0.5">
              <h4 className="text-xs uppercase font-bold tracking-wider text-stone-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Daily Cooking Tasks Progress
              </h4>
              <p className="text-[11px] text-stone-500">
                Tick off instructions on the Daily Prep To-Do List to track cooking progress.
              </p>
            </div>
            <div className="text-right flex items-baseline gap-1">
              <span className="text-lg font-mono font-black text-emerald-700">{stepsCompletionPercentage}%</span>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Completed</span>
            </div>
          </div>
          
          <div className="relative w-full h-3 bg-stone-200/60 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stepsCompletionPercentage}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          
          {stepsCompletionPercentage === 100 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1 bg-emerald-50 py-1 rounded-md border border-emerald-100"
            >
              🎉 Fantastic! You have completed all cooking tasks for today. Enjoy your delicious Indian meals!
            </motion.div>
          )}
        </div>
      )}

      {/* Main Grid: Left Column (Meal Cards), Right Column (Shopping & To-Do List) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MEAL PLANS COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-sans font-semibold text-stone-950 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-amber-500" /> Daily Cooking Plans
            </h2>
            <span className="text-xs text-stone-500 font-medium hidden xs:inline">Click "View Recipe" to reveal step-by-step checklist</span>
          </div>

          <div className="space-y-4">
            {(['breakfast', 'lunch', 'dinner'] as const).map((type) => {
              // Extract active meal representation
              const mealName = currentPlan ? currentPlan.mealPlan[type].name : selectedOfflineMeals[type].name;
              const mealPrep = currentPlan ? currentPlan.mealPlan[type].prepTime : selectedOfflineMeals[type].prepTime;
              const mealEnergy = currentPlan ? currentPlan.mealPlan[type].energyScore : selectedOfflineMeals[type].energyRequired;
              const mealCost = currentPlan ? currentPlan.mealPlan[type].cost : selectedOfflineMeals[type].estimatedCost;
              const mealDesc = currentPlan ? currentPlan.mealPlan[type].description : selectedOfflineMeals[type].description;
              const mealId = currentPlan ? `ai-${type}` : selectedOfflineMeals[type].id;
              
              const isExpanded = expandedMealId === mealId;

              // Ingredient items list
              const ingredientsList = currentPlan 
                ? currentPlan.mealPlan[type].ingredients 
                : selectedOfflineMeals[type].ingredients;

              // Instructions instructions list
              const instructionsList = currentPlan 
                ? currentPlan.mealPlan[type].instructions 
                : selectedOfflineMeals[type].instructions;

              return (
                <motion.div
                  id={`meal-card-${type}`}
                  key={type}
                  layout="position"
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded 
                      ? 'border-amber-400 shadow-md ring-1 ring-amber-400/20' 
                      : 'border-stone-150 hover:border-stone-300 shadow-sm'
                  }`}
                >
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          type === 'breakfast' 
                            ? 'bg-amber-100 text-amber-800' 
                            : type === 'lunch' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {type}
                        </span>
                        
                        <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-medium">
                          <Clock className="w-3 h-3" /> {mealPrep}m
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-medium">
                          <Zap className="w-3 h-3 text-amber-500" /> Stamina: {mealEnergy}/5
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900 tracking-tight leading-snug">
                        {mealName}
                      </h3>
                      
                      <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                        {mealDesc}
                      </p>
                    </div>

                    {/* Cost and Actions */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3.5 md:pt-0 border-stone-100 gap-2 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">Est. Cost</span>
                        <span className="text-base font-mono font-bold text-stone-900">₹{mealCost}</span>
                      </div>

                      <div className="flex gap-1.5">
                        {!currentPlan && (
                          <button
                            type="button"
                            onClick={() => handleSwapMeal(type)}
                            className="flex items-center gap-1 text-xs font-semibold py-1.5 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg transition-colors"
                            title="Cycle through other compatible meals"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Swap
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => setExpandedMealId(isExpanded ? null : mealId)}
                          className={`text-xs font-semibold py-1.5 px-3 rounded-lg border transition-all ${
                            isExpanded 
                              ? 'bg-amber-500 border-amber-500 text-stone-950 hover:bg-amber-400' 
                              : 'bg-stone-900 border-stone-900 text-white hover:bg-stone-800'
                          }`}
                        >
                          {isExpanded ? 'Hide Details' : 'View Recipe'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Section: Recipe Details (Pantry matches, Grocery details, & Cooking To-Do Steps) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-stone-100 bg-stone-50/50 overflow-hidden"
                      >
                        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                          {/* Ingredients List */}
                          <div className="md:col-span-5 space-y-2.5">
                            <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider flex items-center gap-1">
                              🛒 Recipe Ingredients
                            </h4>
                            <div className="space-y-1.5">
                              {ingredientsList.map((ing, i) => {
                                const isOwned = profile.ingredientsToUse.some(pantryIng => 
                                  ing.name.toLowerCase().includes(pantryIng.toLowerCase()) ||
                                  pantryIng.toLowerCase().includes(ing.name.toLowerCase())
                                );
                                return (
                                  <div key={i} className="flex justify-between items-center bg-white border border-stone-100 rounded-lg p-2 shadow-xs">
                                    <span className="font-medium text-stone-900">
                                      {ing.name}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-stone-500 font-mono text-[11px]">({ing.amount})</span>
                                      {isOwned && (
                                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                          Pantry
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Interactive Steps List */}
                          <div className="md:col-span-7 space-y-2.5">
                            <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider flex items-center gap-1">
                              🍳 Cooking Instructions Checklist
                            </h4>
                            <div className="space-y-2">
                              {instructionsList.map((inst, index) => {
                                const stepKey = `${mealId}-${index}`;
                                const isDone = completedSteps[stepKey] || false;
                                return (
                                  <button
                                    key={index}
                                    onClick={() => toggleCookingStep(stepKey)}
                                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 group cursor-pointer ${
                                      isDone 
                                        ? 'bg-stone-100 border-stone-200 text-stone-400 line-through' 
                                        : 'bg-white border-stone-150 hover:border-stone-300 text-stone-700 shadow-xs'
                                    }`}
                                  >
                                    <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                                      isDone 
                                        ? 'bg-amber-500 border-amber-500 text-stone-950' 
                                        : 'border-stone-300 group-hover:border-amber-400 bg-white'
                                    }`}>
                                      {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span className="leading-relaxed">
                                      {index + 1}. {inst}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* GROCERY CHECKLIST & GENERAL TO-DO COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* GROCERY CHECKLIST */}
          <div className="bg-white rounded-2xl border border-stone-150 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-stone-50 border-b border-stone-150 flex items-center justify-between">
              <h3 className="text-sm font-sans font-semibold text-stone-900 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-stone-600" /> Compiled Grocery List
              </h3>
              <span className="text-[10px] bg-stone-200 text-stone-800 font-bold px-2 py-0.5 rounded-full">
                {completedGroceryItemsCount}/{totalGroceryItems} Checked
              </span>
            </div>

            <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto">
              {compiledGroceryList.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">
                  Select some meals or generate an AI plan to compile your dynamic shopping checklist.
                </p>
              ) : (
                compiledGroceryList.map(category => (
                  <div key={category.category} className="space-y-2">
                    <div className="text-[9px] uppercase font-bold text-stone-400 tracking-widest pl-1">
                      {category.category}
                    </div>
                    <div className="space-y-1.5">
                      {category.items.map((item) => (
                        <div
                          key={item.name}
                          className={`w-full p-2.5 rounded-lg border transition-all ${
                            item.isCompleted 
                              ? 'bg-stone-50 border-stone-200 text-stone-400' 
                              : 'bg-white border-stone-100 hover:border-stone-150 text-stone-800 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => toggleGroceryItem(category.category, item.name)}
                              className="flex items-center gap-2 cursor-pointer text-left focus:outline-none"
                            >
                              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                item.isCompleted 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'border-stone-300 bg-white hover:border-amber-500'
                              }`}>
                                {item.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-xs font-semibold ${item.isCompleted ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                                  {item.name}
                                </span>
                                {item.isSwapped && (
                                  <span className="text-[9px] text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                                    ✨ Cheaper Swap
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const lowerOriginal = item.originalName.toLowerCase();
                                        setSwappedIngredients(prev => {
                                          const next = { ...prev };
                                          delete next[lowerOriginal];
                                          return next;
                                        });
                                      }}
                                      className="text-stone-400 hover:text-red-500 underline ml-1 cursor-pointer font-bold"
                                      title="Restore original ingredient and price"
                                    >
                                      (Undo)
                                    </button>
                                  </span>
                                )}
                              </div>
                            </button>

                            <div className="flex items-center gap-2 font-mono text-[10px]">
                              <span className="text-stone-500 font-bold">{item.amount}</span>
                              <span className="text-emerald-700 font-semibold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100/50">
                                ₹{item.estimatedPrice}
                              </span>
                            </div>
                          </div>

                          {/* Alternative substitution suggestion - requested explicitly */}
                          {item.substitution && !item.isCompleted && (
                            <div className="mt-1.5 pt-1.5 border-t border-stone-100/80 pl-6 flex items-center gap-1.5 text-[10px] text-stone-500">
                              <span className="font-semibold text-[9px] uppercase bg-amber-50 text-amber-800 border border-amber-100/50 px-1 rounded">
                                Alt:
                              </span>
                              <span>{item.substitution}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-stone-50/50 p-3 border-t border-stone-100 text-[10px] text-stone-500 leading-normal">
              🛡️ Prices are estimated and custom substitution options are suggested if an ingredient is out of stock.
            </div>
          </div>

          {/* DYNAMIC COMBINED COOKING TO-DO STEPS */}
          <div className="bg-white rounded-2xl border border-stone-150 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-stone-50 border-b border-stone-150 flex items-center justify-between">
              <h3 className="text-sm font-sans font-semibold text-stone-900 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-stone-600" /> Daily Prep To-Do List
              </h3>
              <span className="text-[10px] bg-stone-200 text-stone-800 font-bold px-2 py-0.5 rounded-full">
                {compiledCookingSteps.filter(s => s.isCompleted).length}/{compiledCookingSteps.length} Finished
              </span>
            </div>

            <div className="p-4 space-y-3 max-h-[350px] overflow-y-auto">
              {compiledCookingSteps.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">
                  Apply your profile selections to compile chronological steps.
                </p>
              ) : (
                compiledCookingSteps.map((step) => {
                  return (
                    <div 
                      key={step.id} 
                      className={`p-3 rounded-xl border transition-all ${
                        step.isCompleted 
                          ? 'bg-stone-50 border-stone-200 text-stone-400' 
                          : 'bg-white border-stone-150 text-stone-700 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggleCookingStep(step.id)}
                          className={`w-4.5 h-4.5 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                            step.isCompleted 
                              ? 'bg-amber-500 border-amber-500 text-stone-950' 
                              : 'border-stone-300 hover:border-amber-500 bg-white'
                          }`}
                        >
                          {step.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${
                              step.mealType === 'breakfast' 
                                ? 'text-amber-600' 
                                : step.mealType === 'lunch' 
                                ? 'text-emerald-600' 
                                : 'text-indigo-600'
                            }`}>
                              {step.mealType} plan
                            </span>
                            <span className="text-[10px] text-stone-500 font-mono font-bold bg-stone-100 px-1 rounded">
                              ⏰ {step.time}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed ${step.isCompleted ? 'line-through opacity-75 text-stone-400' : 'text-stone-700 font-medium'}`}>
                            {step.instruction}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="bg-stone-50/50 p-3 border-t border-stone-100 text-[10px] text-stone-400 text-center">
              Chronologically ordered tasks structured in prep phases for standard flow control.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
