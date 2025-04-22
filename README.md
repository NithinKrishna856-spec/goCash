# 💰 goCa$h – Cross-Platform Banking App

**goCa$h** is a cross-platform desktop application built to simulate banking operations, with a focus on joint accounts. The project implements real-world concurrency issues and Operating System concepts including IPC (Inter-Process Communication), thread synchronization, memory management, and process isolation.

This ReadMe provides complete setup instructions for running the application on a fresh machine.

---

## 🧰 Tech Stack

- **Frontend:** React + Tailwind CSS  
- **Backend:** Rust (Tauri framework)  
- **Database:** MySQL  
- **Communication:** Tauri IPC, WebSockets  
- **Target Platforms:** Windows & Linux

---

## 📦 Dependencies & Installation

### ✅ Common Requirements

1. **Node.js & npm**  
   Download from https://nodejs.org  
   _(npm comes bundled with Node.js)_

2. **pnpm (Package Manager)**  
   Install via npm:  
   `npm install -g pnpm`

3. **Rust & Cargo**  
   Install via rustup:  
   https://rustup.rs

4. **Tauri CLI**  
   Install using Cargo:  
   `cargo install tauri-cli`

---

## 🪟 Windows-Specific Setup

1. **OpenSSL (Required by Rust)**  
   Download and install from:  
   https://slproweb.com/products/Win32OpenSSL.html

2. **Set Environment Variables in Command Prompt (Admin):**
   ```cmd
   set OPENSSL_DIR=C:\Program Files\OpenSSL-Win64
   set OPENSSL_LIB_DIR=%OPENSSL_DIR%\lib
   set OPENSSL_INCLUDE_DIR=%OPENSSL_DIR%\include
   ```

3. **Install Microsoft WebView2 Runtime:**  
   https://developer.microsoft.com/en-us/microsoft-edge/webview2/

---

## 🍎 macOS-Specific Setup

1. **Install OpenSSL using Homebrew:**  
   `brew install openssl`

2. **Add the following to your shell config (.zshrc / .bash_profile):**
   ```bash
   export OPENSSL_DIR=$(brew --prefix openssl)
   export OPENSSL_LIB_DIR=$OPENSSL_DIR/lib
   export OPENSSL_INCLUDE_DIR=$OPENSSL_DIR/include
   ```

3. **Install Xcode Command Line Tools (if not installed):**  
   `xcode-select --install`

---

## 📄 Environment Setup

Create a file named `.env` in the root of the project and add:

```
MYSQL_URL=your_mysql_connection_string
ABLY_KEY=your_ably_realtime_key
```

These are required for database access and WebSocket communication.

---

## 📥 Clone the Repository

```bash
git clone https://github.com/ShravyaKudlu/gocash.git
cd gocash
```



---

## ▶️ Running the Application

1. Install all dependencies:  
   `pnpm install`

2. Start the app in development mode:  
   `pnpm tauri dev`

✅ A native window should launch after a few seconds.

---

## 🔧 Configuration Notes

- Ensure MySQL service is running and reachable.
- Use an Ably account for real-time messaging (optional for demo).
- If facing SSL issues, verify OpenSSL installation and environment variables.
- Always run terminal with elevated permissions (Admin on Windows).

---

## 🛠️ Troubleshooting

- **IPC delay or unresponsive UI:**  
  Ensure backend handlers are correctly defined in `tauri.conf.json`.

- **WebSocket/SSL errors:**  
  Verify `.env` is correctly configured with valid credentials.

- **App doesn’t launch:**  
  Confirm that WebView2 (Windows) or Xcode tools (macOS) are installed.

---

## 📦 Build for Production

```bash
pnpm tauri build
```

---

## ⚠️ Note

Environment variables used for DB and Ably access may expire after the semester. You can continue using the app by:

- Setting up a new MySQL instance (e.g., on PlanetScale or Aiven)  
- Creating an Ably app for WebSockets  
- Updating the `.env` file with your new credentials

---

✅ This completes the setup instructions for **goCa$h**.
