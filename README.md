# VibeChef: AI-Powered Indian Meal Planner & Prep Optimizer

VibeChef is a high-performance, single-screen responsive web application designed to help households plan healthy, budget-friendly daily Indian meals. It empowers users to optimize their kitchen prep time, coordinate meals around active physical stamina/energy levels, and maximize their current pantry inventory.

The application features a hybrid full-stack architecture with two powerful planner modes:
1. **AI Personal Chef (Bespoke Gemini Mode):** Curates custom meals mathematically aligned to your ingredients and time parameters.
2. **Offline Fast-Match Mode:** Leverages a robust local database of beloved Indian comfort food blueprints (e.g., Kanda Poha, Upma, Besan Chilla, Aloo Paratha, Dal Khichdi, Paneer Sabzi, etc.) to calculate instantly without server constraints.

---

## 🌟 Core Features

### 1. Intuitive Single-Screen Dashboard
*   **Aesthetic Typography & Modern Design:** Designed with a clean "Warm Kitchen Slate" aesthetic using modern Inter and JetBrains Mono typography pairings.
*   **Decoupled View Architecture:** A clean separation of the **Profile Form Wizard** and the active **Meal Planner Dashboard** allows users to easily toggle views without interface clutter.

### 2. Intelligent Budget Feasibility Engine
*   **Real-Time Price Calculation:** Dynamically sums up estimated daily costs in Indian Rupees (₹) across breakfast, lunch, and dinner.
*   **Visual Budget Progress Indicators:** Highly visual progress bars with reactive state classes (`green` for savings, `amber` for tight margin, and `red` for over budget).
*   **Automatic High-Cost Detection:** Pinpoints exactly which ingredients (such as paneer, premium meat, or ghee) are causing you to exceed your daily limit.
*   **One-Click Auto-Swap Optimizer:** Instant, interactive option to swap out premium items for affordable, protein-rich alternatives (e.g., swapping Paneer for Soya Chunks, Ghee for Vegetable Oil, or Cashews/Almonds for Peanuts) to immediately save money.

### 3. Smart Interactive Checklist Engine
*   **Live Shopping List:** Automatically categorizes ingredients (Produce, Grains, Dairy, Spices, Pantry) with smart "Cheaper Swap" indicators and easy rollback options.
*   **Sequential Daily Prep Tasks:** Converts your meal blueprints into an organized, step-by-step cooking to-do list.
*   **Dynamic Cooking Progress Bar:** Checking off steps instantly updates a beautifully-animated progress bar at the top with a celebratory message upon 100% completion.

### 4. Database Persistence & History
*   **Time-Travel Timeline:** Automatically saves successful AI-generated plans to a clean chronological list so you can re-load past profiles or manage entries.

---

## 🛠️ Technology Stack

*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS (Modern `@import "tailwindcss";` setup)
*   **Animations:** Framer Motion (`motion/react`) for fluid transitions, layout morphing, and progress loaders
*   **Icons:** Lucide React
*   **Server/API Hosting:** Express Server proxying Google's `@google/genai` SDK safely for server-side operations, or direct serverless integration with the Gemini API via the browser.

---

## 🚀 How to Run Locally

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/AnishAaron/VibeChef.git
    cd VibeChef
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment (Choose one):**
    *   **Backend Server Mode**: Create a `.env` file in the root directory:
        ```env
        GEMINI_API_KEY=your_actual_api_key_here
        ```
    *   **Browser Serverless Mode**: Run the app and click the **"Set Gemini Key"** button in the top-right header to configure it directly in your browser.

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    This launches the Express server proxying the Vite frontend on [http://localhost:3000](http://localhost:3000).

5.  **Build and Start in Production:**
    ```bash
    npm run build
    ```
    To start the production server (in PowerShell):
    ```powershell
    $env:NODE_ENV="production"; npm run start
    ```

---

## 🌐 Deploying to GitHub Pages

VibeChef supports serverless client-side execution out-of-the-box, allowing you to host the frontend on GitHub Pages for free while keeping your API key secure in your local storage.

1.  **Deploy static build to GitHub Pages:**
    ```bash
    npm run deploy
    ```
2.  **Configure Pages settings on GitHub:**
    *   Go to your repository **Settings > Pages**.
    *   Set **Branch** to `gh-pages` and folder to `/ (root)`.
    *   Click **Save**.
3.  **Enter your API Key**: Open your live `github.io` URL, click **"Set Gemini Key"** in the top header, and paste your Gemini API Key. Your settings and timeline history will persist safely in your browser!
