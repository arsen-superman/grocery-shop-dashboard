# Grocery Shop Dashboard

This repository contains the **Grocery Shop Dashboard** project, consisting of:
- **Backend:** ASP.NET Core 8 API (in `/backend`)
- **Frontend:** Angular 20 application (in `/web/grocery-shop-dashboard-ui`)

Both services can be launched together using Visual Studio Code tasks for a seamless development experience.

---

## 🚀 Prerequisites

Before you start, make sure the following tools are installed:

| Tool | Version | Description |
|------|----------|-------------|
| [.NET SDK](https://dotnet.microsoft.com/en-us/download) | 8.x | Required to run the backend API |
| [Node.js](https://nodejs.org/en/download) | LTS (>=22.x) | Required to run the Angular frontend |
| [Visual Studio Code](https://code.visualstudio.com/) | latest | Used to run tasks and debug both apps |

---

## 🧰 Project Structure

├─ backend/ # .NET
│ └─ GroceryShop.Dashboard.API/
│ └─ GroceryShop.Dashboard.API.csproj
└─ web/
└─ grocery-shop-dashboard-ui/ # Angular

---

## ▶️ Running the Project

1. Open the grocery-shop-dashboard-ui folder in **VS Code**.  
2. Open the **Command Palette** (`Ctrl + Shift + P` or `Cmd + Shift + P` on macOS).  
3. Choose **Tasks: Run Task → run dev**  
   - This will start both:
     - The .NET backend (`dotnet watch run`)
     - The Angular frontend (`npx ng serve`)  
4. Wait until both are compiled and running.

Once running, open your browser at:

👉 **http://localhost:4200/**

---

## 🛑 Stopping the Project

You can stop the running tasks in one of two ways:

- Run the **`stop dev`** task (if defined in your `.vscode/tasks.json`)  
- or simply **close the terminal** (VS Code will terminate both backend and frontend automatically)

---

## 💡 Notes

- The first time you run the project, it may take a few minutes to restore dependencies.  
- Both apps will automatically reload when you make code changes (thanks to `dotnet watch` and Angular live reload).  
- You don’t need Visual Studio — **VS Code + tasks.json** is enough.

---

## 🧑‍💻 Development Workflow

- **Frontend only:** run `npx ng serve` inside `/web/grocery-shop-dashboard-ui`
- **Backend only:** run `dotnet watch run --project backend/GroceryShop.Dashboard.API/GroceryShop.Dashboard.API.csproj`
- **Both together:** use the `run dev` VS Code task (recommended)
