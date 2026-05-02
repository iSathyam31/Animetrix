<div align="center">
  <h1>✨ ANIMETRIX</h1>
  <p><strong>Your All-in-One AI Anime Intelligence Platform</strong></p>
  <p>Animetrix is a full-stack, AI-powered companion for anime enthusiasts. It leverages the latest Large Language Models (Azure OpenAI GPT-4) and Vision AI (Google Gemini) to provide hyper-personalized recommendations, instantly identify characters from images, compare shows head-to-head, and let you explore a massive anime database.</p>
</div>

<br />

## 🌟 Key Features

Animetrix is divided into four powerful, distinct modules:

1. 💬 **Chibi Chat (AI Assistant)**
   - Talk to your personal AI anime expert. Describe your mood, name a few favorite genres, or mention a show you loved, and Chibi will curate highly personalized anime picks just for you.
2. 🔍 **Vision Detect (Character Recognition)**
   - Have a screenshot or piece of fan-art but don't know who the character is? Upload the image, and our Google Gemini Vision integration will instantly identify the character, their origin show, and their visual traits.
3. ⚔️ **Anime Battle (Head-to-Head Comparison)**
   - Pit any two anime against each other. Our AI evaluates them across multiple dimensions (Story, Animation, Characters, Sound, and Enjoyment) to declare the ultimate winner.
4. 📚 **Encyclopedia Search (Database)**
   - Search a comprehensive database of over 24,000 anime titles (powered by the AniList GraphQL API). Browse synopses, cast, staff, community scores, and trailers.

---

## 🛠️ Technology Stack

**Frontend:**
- [Next.js 16](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations & Modals)
- `lucide-react` (Icons)

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) (High-performance Python web framework)
- [Uvicorn](https://www.uvicorn.org/) (ASGI Server)
- [LangChain](https://www.langchain.com/) & [LangGraph](https://langchain-ai.github.io/langgraph/) (AI orchestration and workflows)
- `uv` (Fast Python dependency manager)

**AI & Machine Learning:**
- **Azure OpenAI:** `gpt-4.1` for conversational AI, `text-embedding-3-small` for vector embeddings.
- **Google Cloud Vertex AI:** Gemini Vision model for image-to-text character recognition.

**Databases & Integrations:**
- **MongoDB:** Stores persistent chat histories.
- **FAISS:** Local vector database for embedding retrieval.
- **AniList GraphQL API:** Official API for live anime metadata, searches, and comparisons.
- **AniList MCP Server:** Contextual user list operations.

---

## 📁 Project Structure

```text
Animetrix/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── core/             # Configuration, Settings, Logging
│   │   ├── routes/           # API Endpoints (chat, character, comparison, anime)
│   │   ├── services/         # Core business logic (LangChain pipelines, Vision)
│   │   └── main.py           # FastAPI application entry point
│   ├── pyproject.toml        # Python dependencies (managed by uv)
│   └── requirements.txt
├── frontend/                 # Next.js React frontend
│   ├── src/
│   │   ├── app/              # Next.js App Router pages (chat, detect, compare, search)
│   │   ├── components/       # Reusable UI components (Navbar, InfoModal, Cards)
│   │   └── lib/              # Utility functions, API clients (api.ts)
│   ├── tailwind.config.ts    # Tailwind CSS configuration
│   └── package.json          # Node.js dependencies
├── .env                      # Global environment variables
└── README.md
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **uv** (Python package manager)
- **MongoDB** (Running locally on default port `27017` or accessible via URI)

---

## 🔑 Environment Variables

The project uses a single, unified `.env` file located in the **root** of the repository (`Animetrix/.env`). 

Create a `.env` file in the root directory and configure the following keys:

```ini
# App Settings
APP_NAME="Anime AI Platform"
APP_VERSION="0.1.0"
DEBUG=True

# Azure OpenAI (Chat & Embeddings)
AZURE_OPENAI_API_KEY="your_azure_openai_api_key_here"
AZURE_OPENAI_ENDPOINT="https://your-endpoint.openai.azure.com/"

# Google Cloud Vertex AI (For Character Detection)
# Make sure to place your vertex_key.json in the root folder alongside this .env file
GOOGLE_CLOUD_PROJECT="your-google-project-id"
GOOGLE_CLOUD_LOCATION="us-central1"
GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/Animetrix/vertex_key.json"

# MongoDB (For Chat History)
MONGODB_URI="mongodb://localhost:27017"

# AniList MCP (Optional)
ANILIST_TOKEN="your_anilist_token_here"
```

> **Note:** The backend is configured to automatically trace back to the root directory to load these variables using `python-dotenv`.

---

## 🚀 Installation & Running Locally

> [!WARNING]
> **Bring Your Own Keys (BYOK):** Due to the high costs associated with cloud AI services, the live demonstration of this application may have certain features (such as Azure OpenAI chat or Google Vertex Character Detection) rate-limited or disabled. To run this project locally, you **must** supply your own API keys and credentials in the `.env` file as shown above.

### 1. Start the Backend (FastAPI)

Open a terminal and navigate to the `backend` folder:

```bash
cd Animetrix/backend

# Install dependencies using uv
uv pip install -r requirements.txt

# Start the development server
uvicorn app.main:app --reload --port 8000
```
The backend API will be running at `http://127.0.0.1:8000`. You can view the interactive Swagger docs at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend (Next.js)

Open a new terminal window and navigate to the `frontend` folder:

```bash
cd Animetrix/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend application will be running at `http://localhost:3000`. Open this in your browser to interact with Animetrix!

---

## 🎨 UI/UX Design Note

Animetrix features a premium dark-mode aesthetic utilizing the **Geist Sans** font family. It implements a clean, "Bento Box" layout on the landing page, removing redundant CTAs and providing a seamless, immersive user experience. Modals and transitions are powered by Framer Motion for smooth, native-feeling interactions.

---

<div align="center">
  <p>Built with ❤️ for the Anime Community.</p>
</div>