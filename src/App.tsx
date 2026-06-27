import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  ClipboardCheck, 
  Sparkles, 
  RefreshCw, 
  User, 
  ClipboardList, 
  History, 
  Trash2, 
  ArrowRight, 
  CalendarDays,
  Activity,
  DollarSign,
  AlertCircle,
  FolderSync
} from 'lucide-react';
import { UserProfile, DailyPlanResponse, HistoryRecord } from './types';
import SidebarWizard from './components/SidebarWizard';
import MealPlanner from './components/MealPlanner';

const DEFAULT_PROFILE: UserProfile = {
  timeBreakfast: 15,
  timeLunch: 25,
  timeDinner: 35,
  energyLevel: 3,
  ingredientsToUse: ['Eggs', 'Potatoes (Aloo)', 'Onions (Pyaz)'],
  maxBudget: 300
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cooking_todo_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'planner' | 'history'>('planner');
  const [showApplyNotification, setShowApplyNotification] = useState(false);
  
  // New State variables for AI integration and DB history
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [currentPlan, setCurrentPlan] = useState<DailyPlanResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Sync profile changes to localStorage
  useEffect(() => {
    localStorage.setItem('cooking_todo_profile', JSON.stringify(profile));
  }, [profile]);

  // Load health check and timeline database on mount
  useEffect(() => {
    // 1. Verify if Gemini API Key is loaded on the backend
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        setApiKeyConfigured(data.apiKeyConfigured);
      })
      .catch(err => console.error("Error verifying health API:", err));

    // 2. Fetch all user saved timeline records
    fetchHistory();

    // 3. Look for active cached generated plan in browser
    const savedActivePlan = localStorage.getItem("cooking_todo_active_plan");
    if (savedActivePlan) {
      try {
        setCurrentPlan(JSON.parse(savedActivePlan));
      } catch (e) {
        console.error("Error reading cached active plan:", e);
      }
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Error loading historical plans:", err);
    }
  };

  // Click on "Generate Daily Plan" in the sidebar wizard step 4
  const handleGenerateAIPlan = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setActiveTab('planner');

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate meal plan. Try configuring your secret API Key.");
      }

      // Success! Update active plan and persist to browser cache
      setCurrentPlan(data);
      localStorage.setItem("cooking_todo_active_plan", JSON.stringify(data));

      // Save to server-side timeline database
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, plan: data }),
      });

      // Reload fresh database list
      fetchHistory();

      // Show toast
      setShowApplyNotification(true);
      setTimeout(() => {
        setShowApplyNotification(false);
      }, 4000);

      // Smooth scroll
      const element = document.getElementById('planner-results-title');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "An error occurred while calling the AI Chef. Verify your setup and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Standard/Offline Apply Profile
  const handleApplyProfileOffline = () => {
    // Clear active AI plan so we switch cleanly back to standard matching mode
    setCurrentPlan(null);
    localStorage.removeItem("cooking_todo_active_plan");
    setGenerationError(null);

    setShowApplyNotification(true);
    setActiveTab('planner');
    
    setTimeout(() => {
      setShowApplyNotification(false);
    }, 3200);

    const element = document.getElementById('planner-results-title');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearActivePlan = () => {
    setCurrentPlan(null);
    localStorage.removeItem("cooking_todo_active_plan");
  };

  // Restore/Load historical plan from database timeline
  const handleRestoreHistoricalPlan = (record: HistoryRecord) => {
    setCurrentPlan(record.plan);
    setProfile(record.profile);
    localStorage.setItem("cooking_todo_active_plan", JSON.stringify(record.plan));
    setActiveTab('planner');

    // Smooth scroll
    const element = document.getElementById('planner-results-title');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Delete historical record from database
  const handleDeleteHistoryRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent loading plan when clicking delete button
    if (window.confirm("Delete this plan from your user history timeline?")) {
      try {
        const res = await fetch(`/api/history/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setHistory(prev => prev.filter(item => item.id !== id));
        }
      } catch (err) {
        console.error("Error deleting record:", err);
      }
    }
  };

  const handleResetProfile = () => {
    if (window.confirm('Reset your profile, pantry items, and limits to defaults?')) {
      setProfile(DEFAULT_PROFILE);
      setCurrentPlan(null);
      localStorage.removeItem('cooking_todo_profile');
      localStorage.removeItem('cooking_todo_active_plan');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Header */}
      <header id="main-header" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-4 py-3.5 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center text-stone-50 shadow-sm">
              <ChefHat className="w-5 h-5 text-amber-400 stroke-[1.8]" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-stone-900 flex items-center gap-1.5">
                Cooking To-Do & Planner
              </h1>
              <p className="text-[10px] text-stone-500 font-medium hidden sm:block">
                Custom meal blueprints engineered around your available time, physical energy, pantry, and budget
              </p>
            </div>
          </div>

          {/* Action Header Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetProfile}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 px-3 py-1.5 rounded-lg transition cursor-pointer"
              title="Reset profile settings to default"
            >
              <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden xs:inline">Reset All</span>
            </button>
            
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border ${
              apiKeyConfigured 
                ? "bg-amber-50 text-amber-800 border-amber-100" 
                : "bg-emerald-50 text-emerald-800 border-emerald-100"
            }`}>
              {apiKeyConfigured ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  AI Smart Mode Enabled
                </>
              ) : (
                <>
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Local Matcher Enabled
                </>
              )}
            </span>
          </div>

        </div>
      </header>

      {/* Floating Notifications */}
      <AnimatePresence>
        {showApplyNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-stone-50 text-xs font-medium px-4 py-3 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2 max-w-[90vw]"
          >
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ★
            </div>
            <span>
              {currentPlan 
                ? <strong>Bespoke AI Plan generated!</strong> 
                : <strong>Profile applied offline!</strong>
              } Added to your active checklist and history.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        
        {/* Navigation Tabs - Mobile & Desktop */}
        <div className="w-full bg-white p-1 rounded-xl border border-stone-200 flex shadow-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <User className="w-4 h-4" /> 1. Edit Profile Wizard
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'planner'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <ClipboardList className="w-4 h-4" /> 2. View Meal Planner
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'history'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <History className="w-4 h-4" /> 3. Saved Plans Timeline
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {history.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab content renderer - fully decoupled and separate views */}
        <div id="planner-results-title" className="w-full space-y-6">
          
          {/* TAB CONTENT: PROFILE FORM WIZARD */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl mx-auto w-full">
              <SidebarWizard 
                profile={profile} 
                onChange={setProfile} 
                onApply={handleApplyProfileOffline} 
                onGenerateAI={handleGenerateAIPlan}
                isGenerating={isGenerating}
                apiKeyConfigured={apiKeyConfigured}
              />
            </div>
          )}

          {/* TAB CONTENT: ACTIVE MEAL PLANNER */}
          {activeTab === 'planner' && (
            <div className="w-full space-y-6">
              {/* Show Alert Box for Generation Errors */}
              {generationError && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-rose-900">AI Personal Chef Error</h4>
                    <p className="text-xs text-rose-700 leading-relaxed">{generationError}</p>
                    <p className="text-[10px] text-rose-600">
                      You can still use the <strong>Offline Fast-Match Recipes</strong> mode below to plan meals without an active API key!
                    </p>
                    <button
                      onClick={handleApplyProfileOffline}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition"
                    >
                      Switch to Offline Mode
                    </button>
                  </div>
                </div>
              )}

              <MealPlanner 
                profile={profile} 
                currentPlan={currentPlan}
                onClearPlan={handleClearActivePlan}
                isGenerating={isGenerating}
                onEditProfile={() => setActiveTab('profile')}
              />
            </div>
          )}

          {/* TAB CONTENT: HISTORICAL TIMELINE DATABASE */}
          {activeTab === 'history' && (
            <div className="w-full space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold tracking-tight text-stone-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-amber-500" /> User History Timeline
                  </h2>
                  <p className="text-xs text-stone-500">
                    Explore your timeline of saved meal blueprints. Re-load historical profiles or delete entries.
                  </p>
                </div>
                <span className="text-xs text-stone-400 font-mono font-bold bg-white px-2.5 py-1 rounded-md border border-stone-200">
                  SCHEMA: Table (history)
                </span>
              </div>

              {history.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-150 p-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
                    <FolderSync className="w-6 h-6 text-stone-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-stone-900">Timeline Database Empty</h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                      When you successfully generate a bespoke custom plan via the AI Personal Chef, it will automatically save right here into your history timeline.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-950 bg-amber-400 hover:bg-amber-500 px-4 py-2 rounded-xl transition shadow-md shadow-amber-500/10 cursor-pointer"
                  >
                    Configure Profile Wizard
                  </button>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {history.map((record, index) => {
                    const dateObj = new Date(record.createdAt);
                    const displayDate = dateObj.toLocaleDateString(undefined, { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    });
                    const displayTime = dateObj.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    const { breakfast, lunch, dinner } = record.plan.mealPlan;
                    const totalHistoricalCost = breakfast.cost + lunch.cost + dinner.cost;

                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative bg-white rounded-2xl border border-stone-150 p-5 shadow-sm hover:border-stone-300 transition-all flex flex-col md:flex-row justify-between gap-4 cursor-pointer group"
                        onClick={() => handleRestoreHistoricalPlan(record)}
                      >
                        {/* Timeline dot */}
                        <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 rounded-full border-4 border-white bg-amber-500 shadow-sm group-hover:scale-110 transition-transform" />

                        {/* Historical snapshot details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {displayDate} at {displayTime}
                            </span>
                            
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              level {record.profile.energyLevel} Stamina
                            </span>

                            <span className="text-stone-400">|</span>
                            
                            <span className="text-[10px] text-stone-500 font-mono">
                              Limit: ₹{record.profile.maxBudget} INR
                            </span>
                          </div>

                          {/* Meals loaded summary */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-stone-100">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 block">🍳 Breakfast</span>
                              <span className="text-xs font-bold text-stone-800 line-clamp-1">{breakfast.name}</span>
                              <span className="text-[10px] text-stone-400 font-mono">₹{breakfast.cost} | {breakfast.prepTime}m</span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 block">🥗 Lunch</span>
                              <span className="text-xs font-bold text-stone-800 line-clamp-1">{lunch.name}</span>
                              <span className="text-[10px] text-stone-400 font-mono">₹{lunch.cost} | {lunch.prepTime}m</span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 block">🍲 Dinner</span>
                              <span className="text-xs font-bold text-stone-800 line-clamp-1">{dinner.name}</span>
                              <span className="text-[10px] text-stone-400 font-mono">₹{dinner.cost} | {dinner.prepTime}m</span>
                            </div>
                          </div>
                        </div>

                        {/* Cost and timeline operations */}
                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100 gap-3">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">Plan Total Cost</span>
                            <span className="text-base font-mono font-extrabold text-stone-900">₹{totalHistoricalCost}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteHistoryRecord(record.id, e)}
                              className="p-2 text-stone-400 hover:text-rose-600 bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-100 rounded-lg transition"
                              title="Delete historical plan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white py-1.5 px-3 rounded-lg transition"
                            >
                              Load Plan <ArrowRight className="w-3 h-3 text-amber-400" />
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

      </main>

      {/* Footer Details */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 text-sm">✦</span>
            <span>Crafted with responsive, stateful react components & Tailwind CSS.</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] text-stone-400">
            <span>Database Schema Active</span>
            <span className="text-stone-300">|</span>
            <span>Port 3000 Ingress Secure</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
