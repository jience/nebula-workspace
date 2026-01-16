# Nebula VDI Client

Nebula VDI Client is a modern, high-performance web-based Virtual Desktop Infrastructure (VDI) client interface. It simulates a native application experience for accessing cloud desktops and virtual applications, featuring a sleek UI, dark mode support, internationalization, and an AI-powered support assistant.

![Nebula VDI Client](./preview.png)

## ✨ Features

- **Modern Dashboard**: Clean, grid-based layout to manage Cloud Desktops and Virtual Apps.
- **Simulated VDI Viewer**: A realistic remote desktop session interface with full-screen mode, connection quality indicators, and input configuration simulation.
- **AI Support Assistant**: Integrated chat interface powered by **Google Gemini API** for instant IT support and troubleshooting.
- **Theming System**: Complete support for Light, Dark, and System-preferred color schemes using Tailwind CSS.
- **Internationalization (i18n)**: Built-in support for English, Chinese (Simplified), and Japanese.
- **Comprehensive Settings**: detailed configuration panels for Display, Devices (Audio/Mic/Webcam), and General preferences.
- **User Profile Management**: View and edit user details, status availability (Online/Away/DND), and activity stats.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (with dark mode configuration)
- **Icons**: Lucide React
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **State Management**: React Context API (for Theme and Language)
- **Build/Bundling**: ES Modules (via index.html imports)

## 🚀 Getting Started

### Prerequisites

- A modern web browser.
- A **Google Gemini API Key** is required to use the AI Assistant feature.

### Installation & Setup

1.  **Clone the repository** (if applicable) or download the source code.

2.  **Environment Configuration**:
    The application requires an API Key for the AI features to work. In a standard Node.js environment, you would create a `.env` file.
    
    *Note: In this specific browser-based execution environment, the `API_KEY` is expected to be provided via the `process.env.API_KEY` global variable.*

3.  **Run the Application**:
    Open `index.html` via a local server or your preferred development environment.

## 📂 Project Structure

```text
.
├── components/          # UI Components
│   ├── App.tsx          # Main Application Layout
│   ├── AssistantChat.tsx# AI Chat Widget
│   ├── Dashboard.tsx    # Resource Library View
│   ├── Login.tsx        # Authentication Screen
│   ├── SettingsModal.tsx# Application Settings
│   ├── UserProfileModal.tsx # User Profile & Edit
│   └── VDIViewer.tsx    # Remote Session Simulator
├── contexts/            # React Contexts
│   ├── LanguageContext.tsx # i18n Logic
│   └── ThemeContext.tsx    # Dark/Light Mode Logic
├── services/            # External Services
│   └── geminiService.ts # Google Gemini AI Integration
├── constants.ts         # Mock Data
├── types.ts             # TypeScript Interfaces
├── index.tsx            # Entry Point
├── index.html           # HTML Template & Tailwind Config
└── metadata.json        # Project Metadata
```

## 🤖 AI Features

The **Nebula Support Assistant** utilizes the `gemini-3-flash-preview` model to provide real-time assistance. It is context-aware (via system instructions) and acts as an IT support specialist to help users with:

- Connection latency issues.
- Resetting passwords.
- Understanding VDI resource usage.
- Navigating the interface.

## 🎨 Theming

The application uses a custom Tailwind configuration to support a rich dark mode.
- **Light Mode**: Clean slate/white aesthetic.
- **Dark Mode**: Deep blue/slate (`slate-950`, `slate-900`) specifically tuned for low-light environments.

To toggle themes, go to **Settings > Display & Graphics > Theme**.

## 🌐 Internationalization

Language support is handled via a lightweight Context provider without external heavy libraries.
Supported locales:
- `en-US` (English)
- `zh-CN` (Simplified Chinese)
- `ja-JP` (Japanese)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
