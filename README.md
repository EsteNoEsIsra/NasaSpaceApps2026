# V.E.N.U.S. 🛰️
### Visual Engine for Neuro-endocrine & Universal Systems
**NASA Space Apps Challenge 2026** — *Health Monitoring Software for Astronauts on Space Missions*

---

## 🚀 Overview & Mission Context

During long-duration space missions (such as the **Artemis Lunar Program** and future **crewed expeditions to Mars**), astronauts are exposed to the **Five Hazards of Human Spaceflight**:
1. **Space Radiation** (endothelial stress & microvascular remodeling)
2. **Isolation and Confinement** (circadian desynchrony & neuro-endocrine strain)
3. **Distance from Earth** (14-22 min communication latency, demanding total clinical edge autonomy)
4. **Gravity Fields / Altered Gravity** (cephalic fluid shifts, SANS, internal jugular vein stasis)
5. **Hostile Closed Environments** (microbiome shifts, ambient CO₂ fluctuations)

### The Real-World Clinical Problem:
In 2019, NASA documented the **first-ever case of Deep Vein Thrombosis (DVT) in the internal jugular vein (IJV)** of an active astronaut aboard the ISS (*New England Journal of Medicine*). 
Over **70% of female astronauts** utilize oral hormonal suppression during spaceflight. Combined with microgravity cephalad fluid stagnation and spaceflight-associated hemoconcentration, this creates a critical triad of thrombosis risk and **Spaceflight-Associated Neuro-ocular Syndrome (SANS)**.

**V.E.N.U.S.** is an autonomous edge-computing medical diagnostic system designed to monitor, triage, and treat neuro-vascular and endocrine conditions with zero latency and zero reliance on Earth mission control.

---

## 🛠️ Architecture & Core Engineering

| Subsystem | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Edge Clinical Engine** | Deterministic FSM (TypeScript) | Eliminates LLM hallucinations and Earth communication latency. Conforms to NASA-STD-8719.13 Class-A auditability. |
| **Interactive Visualization** | Vector Multi-layer Anatomical SVG | Real-time visual wireframe with independent Vascular, Ocular (SANS), and Endocrine sub-system layers. |
| **Hands-Free Control** | Web Speech API + SpeechSynthesis | Touchless voice control designed for microgravity exercise (CEVIS/ARED) or glove operation with audio feedback. |
| **Bulletproof Pitch Fallback** | Dual Physical Keyboard Hotkeys | Guarantees live demonstration resilience in loud hackathon pitch environments (`[P]`, `[V]`, `[Shift+D]`, `[R]`). |
| **Cross-Platform Reproducibility** | Docker + Docker Compose + Makefile | Single-command deployment (`make up` or `make dev`) across macOS, Windows, and Linux. |

---

## ⚡ Quickstart Guide

### Prerequisites
- Node.js (v18+) **OR** Docker & Docker Compose
- `make` utility

### Option 1: Run with Local Node.js
```bash
# 1. Install dependencies
make install

# 2. Run local development server
make dev

# 3. Open in browser at http://localhost:5173
```

### Option 2: Run with Docker Compose (Team Standard)
```bash
# 1. Build and launch container in background
make up

# 2. Watch live logs
make logs

# 3. Stop container
make down
```

---

## 🎯 Live Pitch Demo Guide (Cheat Sheet)

Use these tactical controls during the live presentation:

- **`[P]` or `[Space]`** : Log Daily Cycle Pill (`"VENUS, registrar pastilla"`). Shows hormonal adherence and updates estrogen index.
- **`[V]`** : Cycle Anatomical Layers (`ALL` ➔ `VASCULAR` ➔ `OCULAR` ➔ `ENDOCRINE`).
- **`[Shift + D]`** : **Inject Emergency Incident**! Simulates jugular vein velocity collapse to 1.4 cm/s, spiking VSI to 88% and triggering Level 3 Thrombus Alert.
- **`[R]`** : Reset to Nominal flight baseline.
- **`[Audit Trace]`** (Top Right) : Opens verifiable NASA Class-A audit log showing exact rules and cryptographic proof hashes.
- **`[Action Protocol]`** : Launches interactive treatment walkthroughs (Butterfly iQ Cervical Ultrasound guide, -35 mmHg LBNP vacuum chamber, Enoxaparin dosing, and Saline Electrolyte reconstitution).

---

## 🔬 Mathematical Models

### 1. Vascular Stasis Index (VSI)
$$VSI = \text{Clamp}_{0}^{100}\left( f(v_{\text{IJV}}) + 0.22 \cdot E_{\text{load}} + 0.24 \cdot H_{\text{deficit}} + \text{DurationFactor} \right)$$
Where:
- $v_{\text{IJV}}$ is internal jugular Doppler velocity (cm/s). Velocities $\le 2.0\text{ cm/s}$ trigger acute stasis penalties.
- $E_{\text{load}}$ is the active hormonal pro-thrombotic burden index (0-100).
- $H_{\text{deficit}}$ is the plasma volume dehydration deficit (%).

---

## 📁 Repository Structure

```text
HackathonNasa/
├── Makefile                # Automation targets (make install, make dev, make up, etc.)
├── Dockerfile              # Multi-stage Docker build (Dev HMR + Prod Nginx)
├── docker-compose.yml      # Containerized development configuration
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── types/              # Clinical metrics, telemetry, and triage types
│   ├── engine/             # Deterministic FSM, Stasis calculator, Diagnostic tree, Voice
│   ├── data/               # Astronaut profile, 14-day history, and incident scenarios
│   ├── components/
│   │   ├── avatar/         # Multi-layer SVG interactive anatomical wireframe
│   │   ├── dashboard/      # Tactical HUD, Vitals Monitor, 14-day Trend Chart
│   │   ├── voice/          # Web Speech API & Tactical Hotkeys interface
│   │   ├── protocols/      # Actionable Countermeasures (Ultrasound, LBNP, Pharma)
│   │   └── audit/          # NASA Class-A verifiable audit drawer
│   ├── App.tsx             # Main operational shell
│   └── main.tsx
└── README.md
```

---
*Built with pride for the NASA Space Apps Challenge 2026.*
