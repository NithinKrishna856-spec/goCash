# 💰 goCa$h – Purpose

**goCa$h** is a cross-platform desktop application designed to handle **transactions** and manage **bank accounts**. It addresses key issues found with **joint accounts**, providing a secure and seamless experience. The application aims to make personal and joint account management simpler, more transparent, and more accessible to users.

## 🦀 Tauri + React – Why We Chose These Technologies??

**Tauri** is used for the native backend of the goCa$h app. It ensures that the app is lightweight and performs with maximum security. Tauri allows for full control over system resources while providing a high-performance, memory-safe environment using **Rust**.

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

---

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

3. Install Xcode Command Line Tools (if not already installed):
   ```sh
   xcode-select --install
   ```

---

## ▶️ Run the App

Once everything is set up:

1. Unzip the project folder (if zipped)

2. Open a terminal and navigate to the project directory:

   ```sh
   cd your-project-folder
   ```

3. Install dependencies:

   ```sh
   pnpm install
   ```

4. Start the development server:
   ```sh
   pnpm tauri dev
   ```

A native Tauri window should appear and your app will launch.

---

## 🧠 Notes

- You can use `npm` or `yarn` if `pnpm` is not available, though `pnpm` is preferred.
- Ensure all OpenSSL-related environment variables are set **before** running the dev server.
- If you encounter issues, revisit the OpenSSL or platform setup steps.

---

## ⚠️ Side Note

I have used environment variables in the project, but they will expire by the end of the semester.  
For continued use:

1. Set up [MySQL in Aiven](https://aiven.io/mysql).
2. Set up [WebSockets from Ably](https://www.ably.io).
3. Fetch your respective keys and paste them in the `.env` file.

---

Happy Exploring! 🚀
