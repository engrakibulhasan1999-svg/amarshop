# BuildEst — Building Estimation & BOQ Software

A professional, production-ready web app for civil engineering **Bill of Quantities (BOQ)**
and **cost estimation**, styled like a modern construction ERP admin panel.

> Built with React + Vite, Tailwind CSS, ShadCN-style UI, Zustand, Chart.js and Framer Motion.

## ✨ Features

- **Dashboard** — overview cards (total cost, material, labor, active projects), cost
  distribution doughnut chart, monthly progress bar chart and a recent-projects list.
- **Project Management** — create / edit / delete projects (name, location, client,
  start & end dates, status) with search.
- **BOQ Module** — editable dynamic table with auto amount calculation, running total,
  category & unit selectors, and **drag-and-drop row reordering** (`@dnd-kit`).
- **Material Estimation** — cement / sand / aggregate from concrete dimensions & mix ratio,
  and steel weight (`d²/162`) estimation. Results can be pushed straight into the BOQ.
- **Cost Calculation** — material (from BOQ) + labor + misc, with profit % and VAT %,
  live subtotal and grand-total breakdown.
- **Reports** — export a professional **PDF** (`jsPDF` + AutoTable) and **Excel** (`xlsx`).
- **Quick Estimate Calculator** — order-of-magnitude cost from built-up area & construction grade.
- **Auth UI** — login / register pages with form validation (`react-hook-form` + `zod`).
- **UX** — sidebar navigation, fully responsive, **light/dark mode**, smooth Framer Motion
  animations, toast notifications and Lucide icons.
- **i18n** — English + **Bangla (বাংলা)**, plus **BDT / USD** currency toggle.
- **Persistence** — everything is saved in **LocalStorage** (Zustand `persist`), seeded with
  realistic sample data.

## 🧱 Tech Stack

| Area | Library |
| --- | --- |
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + ShadCN-style primitives (Radix UI) |
| State | Zustand (with `persist`) |
| Charts | Chart.js + react-chartjs-2 |
| Animation | Framer Motion |
| Forms | react-hook-form + zod |
| Drag & drop | @dnd-kit |
| Export | jsPDF + jspdf-autotable, xlsx |
| Icons | lucide-react |
| i18n | i18next + react-i18next |

## 🚀 Getting Started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # lint
```

The app opens on the **Login** page — it is a demo, so any email/password (min 6 chars)
logs you in.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/          # ShadCN-style primitives (button, card, dialog, table, …)
│   ├── layout/      # Sidebar, Topbar, AppLayout, nav config
│   ├── charts/      # Chart.js wrappers
│   ├── boq/         # BOQ table + sortable rows
│   ├── projects/    # Project create/edit dialog
│   ├── auth/        # Auth shell
│   └── shared/      # PageHeader, StatCard, EmptyState, ConfirmDialog, …
├── pages/           # Dashboard, Projects, Boq, Materials, Cost, Reports, QuickEstimate, Settings, Login, Register
├── store/           # Zustand stores (projects, settings, auth, toasts)
├── hooks/           # useCurrency, useActiveProject
├── lib/             # calc (estimation math), format (currency), exporters (PDF/Excel), utils
├── i18n/            # en / bn translations
└── data/            # seed sample data
```

## 📝 Notes

- All monetary values are stored in **BDT** and converted on the fly for display / export.
- The estimation formulas (dry volume factor `1.54`, cement density `1440 kg/m³`,
  steel unit weight `d²/162`) follow common civil-engineering rules of thumb and are
  intended for quick estimates.
