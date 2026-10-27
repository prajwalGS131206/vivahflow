# VivahFlow — Smart Wedding Management Platform

VivahFlow is a web application designed to help Indian weddings manage guest invitations, RSVPs, actual attendance, catering requirements, food waste, and event budgets from one dashboard.

The goal is to make wedding planning more organized, reduce unnecessary food preparation, and give organizers better visibility into guest attendance and expenses.

## ✨ Features

### Currently implemented

- **Wedding Dashboard** — Overview of wedding details and guest statistics.
- **Guest Management** — View, search, and filter the guest list.
- **Household Registration** — Add guest households through the interface.
- **RSVP Tracking** — Update guest response statuses.
- **Attendance Check-in** — Manually record guest arrivals.
- **Food & Budget Dashboard** — View demo catering estimates and budget information.
- **Responsive Interface** — Designed to work across desktop and smaller screens.

### Planned features

- Persistent database for guests, events, RSVPs, and attendance.
- Unique QR codes for invitations and faster check-in.
- WhatsApp and SMS invitation integrations.
- Expected-versus-actual attendance analytics.
- Catering quantity recommendations based on confirmed attendance.
- Food waste estimation and reporting.
- Per-event and overall budget tracking.
- Secure organizer accounts and role-based access.
- Exportable guest lists and event reports.

> **Current status:** Early-stage prototype. Guest data and changes are currently held in application memory and may reset when the page is refreshed. Database persistence and the planned integrations are not implemented yet.

## 🛠️ Tech Stack

- **Frontend:** React
- **Language:** TypeScript
- **Build tool:** Vite
- **Icons:** Lucide React
- **Styling:** CSS
- **Version control:** Git and GitHub

## 🚀 Getting Started

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/) — includes npm
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/prajwalGS131206/vivahflow.git
   ```

2. Enter the project directory:

   ```bash
   cd vivahflow
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in the terminal. Vite commonly uses:

   `http://localhost:5173/`

### Production build

To check the project and generate production files, run:

```bash
npm run build
```

The generated production files are placed in the `dist/` directory.

## 📁 Project Structure

```text
vivahflow/
├── src/
│   ├── App.tsx          # Main application and dashboard
│   ├── main.tsx         # Application entry point
│   ├── styles.css       # Application styling
│   └── vite-env.d.ts    # Vite TypeScript declarations
├── .env.example         # Example environment configuration
├── .gitignore          # Files excluded from Git