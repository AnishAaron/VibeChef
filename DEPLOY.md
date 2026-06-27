# 🚀 Deploying to GitHub Pages (`github.io`)

Because GitHub Pages hosts only **static frontend files**, any custom Express backend server (`server.ts`) or server-side environment variables will not run directly on GitHub Pages. 

However, **RasoiCraft** is built to be resilient! The custom client-side SPA mode works beautifully on GitHub Pages, featuring:
*   The entire local Indian recipes database (Kanda Poha, Upma, Besan Chilla, Aloo Paratha, Dal Khichdi, Paneer Sabzi).
*   Interactive budget feasibility meters, real-time total costs in ₹, and high-cost detection.
*   One-click interactive ingredient auto-swap options (Paneer ➡️ Soya Chunks, Ghee ➡️ Vegetable Oil).
*   Live cooking checklists, progress bar animations, and custom saving rules.

---

## 🛠️ Step 1: Assets Base URL Fixed!
When deploying a Vite application to GitHub Pages, the browser normally searches for compiled assets (like CSS and JS files) at the root server level (`/assets/`), resulting in a blank screen (404 error). 

**We have already configured this for you!** We modified your `vite.config.ts` to include:
```ts
base: './'
```
This forces all asset paths to resolve **relatively**, meaning your app will render perfectly regardless of your repository name or directory structure.

---

## 📦 Step 2: Choose Your Deployment Method

Here are the two easiest ways to deploy your connected repository to GitHub Pages.

### Method A: Automated GitHub Actions (Recommended)
This method lets GitHub build and deploy your site automatically every time you push code to the `main` branch.

1. In your GitHub Repository, go to the **Settings** tab.
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment** ➡️ **Source**, select **GitHub Actions** from the dropdown list.
4. Create a folder in your project named `.github/workflows/` (if it doesn't exist) and create a file inside called `deploy.yml` with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # or master

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22  # Avoids Node 20 deprecation warnings

      - name: Install Dependencies
        run: npm install  # Uses npm install instead of npm ci for resilience if package-lock.json is missing

      - name: Build Application
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload Build Artifacts
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
5. Commit and push this file. GitHub will automatically build your React app and launch it on your `.github.io` page!

---

### Method B: Quick CLI Deploy (The `gh-pages` Package)
If you prefer deploying manually via terminal scripts:

1. Install the deployment helper package:
   ```bash
   npm install gh-pages --save-dev
   ```
2. Open your `package.json` and add these two scripts inside the `"scripts"` block:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Run the deployment command from your terminal:
   ```bash
   npm run deploy
   ```
This automatically builds your project and publishes the compiled static files from the `dist` folder to a special branch named `gh-pages`. GitHub Pages will host your app directly from that branch!
