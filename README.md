# 💰 goCa$h – Purpose

**goCa$h** is a cross-platform desktop application designed to handle **transactions** and manage **bank accounts**. It addresses key issues found with **joint accounts**, providing a secure and seamless experience. The application aims to make personal and joint account management simpler, more transparent, and more accessible to users.

---

## 🦀 Tauri + React – Why We Chose These Technologies

**Tauri** was chosen for its lightweight and secure backend capabilities, leveraging **Rust** for safe, high-performance system-level operations. It enables seamless communication with the operating system while keeping the app cross-platform.

**React** powers the frontend, offering a dynamic and interactive user experience with reusable components, hooks, and efficient state management.

---

## 📦 Prerequisites

Make sure your system has the following tools installed:

- [Node.js](https://nodejs.org/) (comes with `npm`)
- [pnpm](https://pnpm.io/installation) – recommended package manager  
  Install via:
  ```sh
  npm install -g pnpm
  ```
- [Rust & Cargo](https://www.rust-lang.org/tools/install)
- Tauri CLI  
  Install via:
  ```sh
  cargo install tauri-cli
  ```
- OpenSSL (with environment variables set – see below)
- WebView2 Runtime (Windows only):  
  [Download here](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
- Xcode Command Line Tools (macOS only)

---

## 🔧 OpenSSL & Platform Setup

### Windows

1. Download and install OpenSSL from:  
   https://slproweb.com/products/Win32OpenSSL.html

2. Set environment variables in Command Prompt or System Environment:

   ```sh
   set OPENSSL_DIR=C:\Program Files\OpenSSL-Win64
   set OPENSSL_LIB_DIR=%OPENSSL_DIR%\lib
   set OPENSSL_INCLUDE_DIR=%OPENSSL_DIR%\include
   ```

3. Install [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### Additional Notes (Windows)

- Run PowerShell or CMD **as Administrator** when installing dependencies.
- If the GUI doesn’t launch (blank screen), make sure WebView2 is installed.
- Consider using [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701) for better experience.

### macOS

1. Install OpenSSL via Homebrew:

   ```sh
   brew install openssl
   ```

2. Add these to your shell profile (`.zshrc`, `.bash_profile`, etc.):

   ```sh
   export OPENSSL_DIR=$(brew --prefix openssl)
   export OPENSSL_LIB_DIR=$OPENSSL_DIR/lib
   export OPENSSL_INCLUDE_DIR=$OPENSSL_DIR/include
   ```

3. Install Xcode Command Line Tools:

   ```sh
   xcode-select --install
   ```

---

## ▶️ Run the App

1. Open a terminal and navigate to the project directory:

   ```sh
   cd your-project-folder
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Start the development server:

   ```sh
   pnpm tauri dev
   ```

A native Tauri window should appear and your app will launch.

---

## 👥 Team Members

- **Shravya Kudlu** – Backend Development (Rust), Project Architecture, Database & Environment Setup
- **Nithin Krishna** – Frontend Development (React), UI/UX Design, Windows Integration, Real-Time Features

---

## 👨‍💻 Developer Contributions

### Shravya Kudlu

- Designed the overall project architecture
- Developed backend in Rust using Tauri
- Handled asynchronous logic, command registration, and secure backend endpoints
- Integrated MySQL with appropriate schema design for account and transaction data
- Configured `.env` variables and helped with SSL/WebSocket environment setup
- Assisted in frontend-backend integration and IPC logic coordination

### Nithin Krishna

- Developed the React frontend with reusable components and custom hooks
- Designed UI for login, dashboard, deposit, withdrawal, and transaction history
- Implemented WebSocket listeners for real-time updates
- Built `useTransaction` and `useWebSocket` hooks for IPC and live sync
- Focused on Windows compatibility, GUI consistency, and WebView troubleshooting

---

## 🧩 Technical Challenges & Fixes

### Inter-Process Communication (IPC)
- **Issue**: Frontend-to-backend function calls caused performance issues
- **Fix**: Split logic into distinct commands and limited IPC exposure

### WebSocket, SSL, and Env Setup
- **Issue**: SSL certs not verifying, failed secure Pub/Sub connections
- **Fix**: Configured certs and standardized environment variables

### GUI Inconsistencies (Windows/Linux)
- **Issue**: App wouldn’t load properly on Windows
- **Fix**: Installed WebView2 and tested across platforms

### Styling Differences Between OSes
- **Issue**: Layouts and fonts inconsistent across platforms
- **Fix**: Used Tailwind CSS and tested on both OSes with responsive tweaks

### Frontend IPC Failures
- **Issue**: `invoke` calls didn’t always return, causing UI delays
- **Fix**: Added error handling and UI loading indicators

### Real-Time Update Lag
- **Issue**: UI didn’t refresh on new data
- **Fix**: Subscribed to WebSocket events using `useEffect` for live sync

---

## 📚 Project Reflections

This project was a collaborative effort between two developers with distinct roles. 

- **Shravya** architected and implemented the Rust backend and handled secure communication, async execution, and database handling. Her backend design ensured stability and efficiency across platforms.

- **Nithin** focused on building a responsive and clean frontend interface with React, navigating platform-specific challenges, and integrating real-time features via WebSocket and IPC. His contributions ensured a seamless user experience.

Together, we learned not only about cross-platform development using Tauri and React, but also gained a deeper understanding of how system-level operations, IPC, and frontend-backend sync shape real-world application behavior.

---

## ⚠️ Side Note

We’ve used environment variables in the project, but they will expire by the end of the semester.  
For continued use:

1. Set up [MySQL in Aiven](https://aiven.io/mysql).
2. Set up [WebSockets from Ably](https://www.ably.io).
3. Fetch your respective keys and paste them in the `.env` file.

---