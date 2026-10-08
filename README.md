# 🍳 PinRecipe Scale Engine (v4.0)

> **Autonomous 5-in-1 Automated Recipe Pipeline, Editorial Magazine Generator & Pinterest Bulk Scheduler.**

---

## 🌟 Key Features

1. **5-in-1 Autonomous Pipeline:**
   - Programmatic keyword ingestion across 5 top culinary niches.
   - Deep culinary intelligence (prep/cook timings, macros, ingredients, steps, and chef secrets).
   - High-definition natural food photography.
   - Clean white editorial magazine article generation.
   - Direct WordPress synchronization with JSON-LD Schema.
   - Pinterest bulk scheduling CSV generation.

2. **📖 Full Editorial Magazine Reader:**
   - Clean white reading layout.
   - Prominent **"Download Recipe"** top button for instant printable cards.
   - Step-by-step masterclass with pro chef secrets and FAQs.
   - Direct web view at `/api/article/:id`.

3. **WordPress Bridge Integration:**
   - High-performance REST API bridge plugin (`pinrecipe-scale-unified-bridge.zip`).
   - Built-in `template_include` override to guarantee full single recipe display on any theme.

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional Gemini API key for live generation)
cp .env.example .env

# 3. Start development server
npm run dev
```

Open **[http://localhost:3001](http://localhost:3001)** in your browser.

---

## 🌐 Deploying to the Cloud

### Option 1: Deploy to Render (Recommended)
1. Fork or push to your GitHub: `https://github.com/Aymen07171/PinRecipe-Scale-`
2. Go to [Render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository `PinRecipe-Scale-`.
4. Render will auto-detect `render.yaml`:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Click **Create Web Service**.

### Option 2: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import `Aymen07171/PinRecipe-Scale-`.
3. Vercel automatically detects `vercel.json` and the Vite build.
4. Click **Deploy**.

### Option 3: Deploy with Docker / Railway
```bash
docker build -t pinrecipe-scale-engine .
docker run -p 3001:3001 pinrecipe-scale-engine
```

---

## 🔌 WordPress Bridge Plugin Setup

1. Locate `pinrecipe-scale-unified-bridge.zip` in this repository.
2. In your WordPress Admin (`/wp-admin`):
   - Go to **Plugins → Add New Plugin → Upload Plugin**.
   - Select `pinrecipe-scale-unified-bridge.zip` and click **Install Now → Activate**.
3. Go to **WP Admin → PinRecipe Scale Bridge** to copy your **Connection Token**.
4. In the PinRecipe app's **WordPress Publishing** tab, paste the token and click **Save Settings**.
