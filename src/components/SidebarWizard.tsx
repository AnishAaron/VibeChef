import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Zap, 
  Apple, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  X,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { SUGGESTED_INGREDIENTS } from '../data/mockMeals';

interface SidebarWizardProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
  onApply: () => void;
  onGenerateAI: () => void;
  isGenerating: boolean;
  apiKeyConfigured: boolean;
}

const STEPS = [
  { id: 1, name: 'Time', desc: 'Cooking time', icon: Clock },
  { id: 2, name: 'Energy', desc: 'Your stamina', icon: Zap },
  { id: 3, name: 'Pantry', desc: 'Use up items', icon: Apple },
  { id: 4, name: 'Budget', desc: 'Spending limit', icon: DollarSign },
];

const ENERGY_LABELS = [
  { val: 1, emoji: '🥱', label: 'Bare Minimum', desc: 'Super fast, single-pot, or simple assembly.' },
  { val: 2, emoji: '😌', label: 'Easygoing', desc: 'Minimal chopping, basic stovetop recipes.' },
  { val: 3, emoji: '🙂', label: 'Steady Cook', desc: 'Standard recipes, 2-3 ingredients to prep.' },
  { val: 4, emoji: '💪', label: 'Energetic', desc: 'Happy to roast, fry, and cook multi-component meals.' },
  { val: 5, emoji: '👨‍🍳', label: 'Gourmet Chef', desc: 'Full culinary mode. Multiple pans, rich flavors!' }
];

export default function SidebarWizard({ 
  profile, 
  onChange, 
  onApply, 
  onGenerateAI, 
  isGenerating, 
  apiKeyConfigured 
}: SidebarWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [customIngredient, setCustomIngredient] = useState('');

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  // Helper to update a field in profile
  const updateProfile = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    onChange({
      ...profile,
      [key]: value
    });
  };

  // Toggle ingredient
  const toggleIngredient = (ingredient: string) => {
    const list = [...profile.ingredientsToUse];
    const index = list.indexOf(ingredient);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(ingredient);
    }
    updateProfile('ingredientsToUse', list);
  };

  const handleAddCustomIngredient = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = customIngredient.trim();
    if (trimmed && !profile.ingredientsToUse.includes(trimmed)) {
      updateProfile('ingredientsToUse', [...profile.ingredientsToUse, trimmed]);
      setCustomIngredient('');
    }
  };

  return (
    <div id="sidebar-wizard-container" className="flex flex-col h-full bg-stone-900 text-stone-100 rounded-2xl shadow-xl overflow-hidden border border-stone-800">
      {/* Top Header */}
      <div className="p-6 border-b border-stone-800 bg-stone-950/40">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-sans font-semibold tracking-tight text-stone-50">
            Daily Profile Wizard
          </h2>
        </div>
        <p className="text-xs text-stone-400">
          Customize your profile to dynamically plan your daily meals.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="px-6 py-4 bg-stone-900 border-b border-stone-800/60">
        <div className="flex items-center justify-between relative">
          {/* Progress Connecting Line */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-stone-800 -translate-y-1/2 z-0" />
          <div 
            className="absolute left-0 top-1/2 h-0.5 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />

          {STEPS.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className="relative z-10 flex flex-col items-center focus:outline-none group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/20 scale-110 shadow-lg'
                      : isCompleted
                      ? 'bg-stone-100 text-stone-900'
                      : 'bg-stone-800 text-stone-400 group-hover:bg-stone-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-stone-400'
                }`}>
                  {step.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Form Body */}
      <div className="flex-1 p-6 overflow-y-auto bg-stone-900/60 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {/* STEP 1: TIME AVAILABLE */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Available Time
                  </h3>
                  <p className="text-xs text-stone-300">
                    How much time do you have to cook each meal today?
                  </p>
                </div>

                {/* Breakfast Time */}
                <div className="space-y-2 p-3.5 bg-stone-950/30 rounded-xl border border-stone-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-stone-200">🍳 Breakfast</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {profile.timeBreakfast} mins
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 15, 25, 45].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => updateProfile('timeBreakfast', mins)}
                        className={`py-1.5 px-1 rounded-lg text-xs font-medium transition-all ${
                          profile.timeBreakfast === mins
                            ? 'bg-amber-500 text-stone-950 font-bold shadow'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lunch Time */}
                <div className="space-y-2 p-3.5 bg-stone-950/30 rounded-xl border border-stone-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-stone-200">🥗 Lunch</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {profile.timeLunch} mins
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 15, 25, 45].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => updateProfile('timeLunch', mins)}
                        className={`py-1.5 px-1 rounded-lg text-xs font-medium transition-all ${
                          profile.timeLunch === mins
                            ? 'bg-amber-500 text-stone-950 font-bold shadow'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dinner Time */}
                <div className="space-y-2 p-3.5 bg-stone-950/30 rounded-xl border border-stone-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-stone-200">🍲 Dinner</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {profile.timeDinner} mins
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[15, 20, 35, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => updateProfile('timeDinner', mins)}
                        className={`py-1.5 px-1 rounded-lg text-xs font-medium transition-all ${
                          profile.timeDinner === mins
                            ? 'bg-amber-500 text-stone-950 font-bold shadow'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ENERGY LEVEL */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> Cooking Stamina
                  </h3>
                  <p className="text-xs text-stone-300">
                    What is your physical energy level for cooking today?
                  </p>
                </div>

                {/* Energy Level Slider Container */}
                <div className="py-6 px-4 bg-stone-950/30 rounded-xl border border-stone-800 space-y-6">
                  <div className="flex flex-col items-center justify-center py-4">
                    <span className="text-5xl animate-bounce duration-1000">
                      {ENERGY_LABELS.find(e => e.val === profile.energyLevel)?.emoji}
                    </span>
                    <span className="text-sm font-semibold text-stone-100 mt-3">
                      Level {profile.energyLevel} &mdash; {ENERGY_LABELS.find(e => e.val === profile.energyLevel)?.label}
                    </span>
                    <p className="text-xs text-stone-400 text-center mt-1.5 max-w-[240px]">
                      {ENERGY_LABELS.find(e => e.val === profile.energyLevel)?.desc}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <input
                      id="energy-slider"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={profile.energyLevel}
                      onChange={(e) => updateProfile('energyLevel', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono px-1">
                      <span>1 (Tired)</span>
                      <span>2</span>
                      <span>3 (Steady)</span>
                      <span>4</span>
                      <span>5 (Chef)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-3 text-[11px] text-amber-300">
                  ⚡ <strong>Tip:</strong> Slower meals require energy levels 3 or higher. Tired mode (1-2) automatically favors quick pots, frying, or toast assemblies.
                </div>
              </div>
            )}

            {/* STEP 3: PANTRY / INGREDIENTS TO USE */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Apple className="w-4 h-4" /> Pantry Clearance
                  </h3>
                  <p className="text-xs text-stone-300">
                    Select ingredients you need to use up. We will prioritize these.
                  </p>
                </div>

                {/* Input for Custom Ingredients */}
                <form onSubmit={handleAddCustomIngredient} className="flex gap-1.5">
                  <input
                    id="custom-ingredient-input"
                    type="text"
                    value={customIngredient}
                    onChange={(e) => setCustomIngredient(e.target.value)}
                    placeholder="Add custom ingredient..."
                    className="flex-1 bg-stone-950 text-xs text-stone-100 rounded-lg px-3 py-2 border border-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-amber-500 text-stone-950 rounded-lg hover:bg-amber-400 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>

                {/* Selected Ingredients List */}
                {profile.ingredientsToUse.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                      Ingredients to Clear ({profile.ingredientsToUse.length})
                    </div>
                    <div className="flex flex-wrap gap-1 bg-stone-950/20 p-2.5 rounded-xl border border-stone-800">
                      {profile.ingredientsToUse.map((ing) => (
                        <span
                          key={ing}
                          className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-500/25 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30"
                        >
                          {ing}
                          <button
                            type="button"
                            onClick={() => toggleIngredient(ing)}
                            className="hover:text-amber-100 focus:outline-none"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Common Ingredients */}
                <div className="space-y-1.5 flex-1">
                  <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                    Quick Select Common Items
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {SUGGESTED_INGREDIENTS.map((ing) => {
                      const isSelected = profile.ingredientsToUse.includes(ing);
                      return (
                        <button
                          key={ing}
                          type="button"
                          onClick={() => toggleIngredient(ing)}
                          className={`text-[10px] py-1 px-2.5 rounded-full border transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950 border-amber-400 font-medium'
                              : 'bg-stone-800 text-stone-300 border-stone-700/60 hover:bg-stone-700'
                          }`}
                        >
                          {ing}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: BUDGET SPENDING LIMIT */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> Max Daily Budget
                  </h3>
                  <p className="text-xs text-stone-300">
                    What is the absolute maximum budget for all meals today?
                  </p>
                </div>

                <div className="p-4 bg-stone-950/30 rounded-xl border border-stone-800 space-y-5">
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="text-4xl font-mono font-bold text-amber-400 flex items-center">
                      <span className="text-2xl text-amber-500">$</span>
                      {profile.maxBudget.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider mt-1">
                      Max Spend Allowed
                    </span>
                  </div>

                  {/* Preset Values */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[12, 18, 25, 45].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => updateProfile('maxBudget', val)}
                        className={`py-1.5 px-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          profile.maxBudget === val
                            ? 'bg-amber-500 text-stone-950 shadow'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>

                  {/* Manual Budget Slider */}
                  <div className="space-y-1">
                    <input
                      id="budget-slider"
                      type="range"
                      min="10"
                      max="50"
                      step="1"
                      value={profile.maxBudget}
                      onChange={(e) => updateProfile('maxBudget', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                    />
                    <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                      <span>$10 (Budget-saver)</span>
                      <span>$30</span>
                      <span>$50 (Premium)</span>
                    </div>
                  </div>
                </div>

                {/* Finalizing Guide Box */}
                <div className="bg-stone-950/40 p-3 rounded-xl border border-stone-800/80 space-y-1.5">
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Ready to Apply
                  </div>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Click <strong>Apply Profile</strong> below to compile meal choices, generate the grocery list, and calculate budget compatibility.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Wizard Footer Controls */}
        <div className="pt-4 border-t border-stone-800/80 flex flex-col gap-3 mt-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'text-stone-600 cursor-not-allowed'
                  : 'text-stone-300 hover:text-stone-50 hover:bg-stone-800'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-medium py-2 px-4 rounded-lg transition-colors border border-stone-700"
              >
                Next <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            ) : null}
          </div>

          {currentStep === 4 && (
            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={onGenerateAI}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-extrabold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-amber-500/10 active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-stone-950 animate-pulse" />
                {isGenerating ? 'Generating Bespoke Plan...' : 'Generate Daily Plan (AI)'}
              </button>
              
              <button
                type="button"
                onClick={onApply}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-bold py-2 px-4 rounded-xl transition-all border border-stone-700 shadow-sm active:scale-95 disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                Offline Fast-Match Recipes
              </button>
              
              {!apiKeyConfigured && (
                <span className="text-[10px] text-stone-400 text-center leading-normal mt-1">
                  💡 Setup <strong>GEMINI_API_KEY</strong> secret inside Settings to unlock bespoke AI-generated plans.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
