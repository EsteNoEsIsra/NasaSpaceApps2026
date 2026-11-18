# HERA — Aerospace Medical Suite
### Autonomous Endocrine & Physiological Triage for Female Astronauts in Deep Space
## 🛰️ Executive Summary

During extended deep-space operations—such as multi-month deployments at the Lunar Gateway or a 3-year Mars Transit—astronauts experience significant microgravity adaptations, fluid redistribution, and altered metabolic baselines.

Historically, aerospace medical models have treated female endocrinology and physiology as operational edge cases. **HERA (Hormonal Evaluation and Regulation in Astronauts)** re-centers space medicine around female physiological baselines. Built with a high-density, editorial-grade UI, HERA functions fully autonomously onboard the spacecraft without requiring active Earth connectivity, bridging a critical gap where communication latencies can reach up to 40 minutes round-trip.

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | React 19 · TypeScript · Vite     |
| Backend    | Node.js · Express 5 · TypeScript |
| Database   | PostgreSQL · Drizzle ORM · Redis |
| Infra      | Docker · docker-compose          |

## 📑 Table of Contents

-   [Mission Problem Statement](https://www.google.com/search?q=%23-mission-problem-statement)
-   [NASA HRP Clinical Alignment](https://www.google.com/search?q=%23-nasa-hrp-clinical-alignment)
-   [Core Innovations](https://www.google.com/search?q=%23-core-innovations)
-   [Simulation Scenarios](https://www.google.com/search?q=%23-simulation-scenarios)
-   [Tech Stack & Architecture](https://www.google.com/search?q=%23-tech-stack--architecture)
-   [Getting Started](https://www.google.com/search?q=%23-getting-started)
-   [NASA Space Apps Pitch Highlights](https://www.google.com/search?q=%23-nasa-space-apps-pitch-highlights)

## 🎯 Mission Problem Statement

Long-duration deep-space exploration involves communication latencies of up to **40 minutes round-trip**. In emergency or physiological drift scenarios, real-time ground guidance is impossible. HERA provides female crew members with autonomous, evidence-based clinical self-reliance.

## 🩺 NASA HRP Clinical Alignment

HERA directly targets high-priority physiological risk factors documented by the **NASA Human Research Program (HRP)**:

-   **👁️ Spaceflight-Associated Neuro-ocular Syndrome (SANS)**
-   -   Differentiates microgravity cephalad fluid shifts and elevated intracranial pressure (ICP) from environmental hypercapnia ($CO\_2$ narcosis) and hormonal headache patterns.
-   **🩸 Venous Thromboembolism (VTE) & Vascular Stasis**
-   -   Monitors blood viscosity and jugular/femoral venous return dynamics under combined exogenous oral contraceptive (OCP) regimens in microgravity.
-   **🦴 Bone Mineral Density (BMD) Resorption**
-   -   Evaluates monthly bone loss rates based on baseline estrogen levels, mechanical loading metrics on the Advanced Resistive Exercise Device (ARED), and total microgravity exposure time.
-   **🔬 Urogenital Microbiome & Immune Shift**
-   -   Secures tracking of vaginal pH variations ($>4.5$) and altered *Lactobacillus* microflora balance under systemic immune suppression and continuous spaceflight stress.

## ✨ Core Innovations

### 1\. Interactive Translucent 3D Digital Twin

-   Powered by a custom **Three.js** rendering engine featuring physical depth shaders.
-   Interactive 3D spatial anchors pinned directly to anatomical risk zones (**Neuro-Ocular, Cardiovascular, Skeletal, Urogenital**).
-   Dynamic camera matrix transitions synced in real-time with telemetry alerts.

### 2\. Autonomous Clinical Triage ("Traffic Light" Engine)

A self-contained three-tier severity matrix operating completely independent of ground telemetry links:

-   🟢 **Nominal**: Baseline equilibrium; routine operational protocols active.
-   🟡 **Warning**: Early clinical deviation detected; targeted self-examination recommended.
-   🔴 **Critical**: Immediate physiological hazard; autonomous emergency protocol initiated.

### 3\. Dynamic Domino-Effect Simulation Engine

-   Models immediate physiological chain reactions triggered by environmental life-support (ECLSS) failures or missed OCP schedules.
-   Supports real-time mission environment toggling (**Lunar Base, Mars Transit 0g, Orbital Station, Pre/Post-EVA Prep**).

### 4\. Privacy-First Intimate Vault

-   Cryptographically isolated personal health log granting astronauts absolute privacy over cyclical logs while relaying anonymized severity states to Flight Surgeons.

## 🪐 Simulation Scenarios

HERA includes an integrated simulation engine designed to test autonomous clinical decision-making under stress:

| Scenario                          | Environmental / Clinical Trigger       | Clinical Domino Chain & Triage Output                                                                                          |
| --------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Nominal Baseline                  | Standard Lunar Gateway Ops             | Balanced biometrics ($36.6^\circ\text{C}$, nominal HRV, $0.41\%\text{ }CO_2$). All systems 🟢.                                 |
| $\text{CO}_2$ Spike + Dehydration | ECLSS Loop Failure & Water Restriction | Ambient $\text{CO}_2$ spike ($0.68\%$), hypercapnic narcosis risk, hemoconcentration $\rightarrow$ 🔴 Critical Vascular Alert. |
| SANS Precursor                    | Microgravity Cephalad Fluid Shift      | Jugular vein engorgement, visual grid blurring, elevated ICP $\rightarrow$ 🟡 Warning SANS Protocol.                           |
| Microbiome / pH Shift             | Spaceflight Immune Suppression         | Vaginal pH elevation ($>4.5$), altered flora $\rightarrow$ 🟡 Warning Microbiome Alert.                                        |

## 🛠️ Tech Stack & Architecture

### Frontend Technology

-   **Framework:** React 19 with TypeScript (`@types/react`, `@types/three`)
-   **3D Visualization:** Three.js with WebGL translucent physical shaders & FBX loader
-   **Design System:** Custom "Acid Soft Future" theme built with Tailwind CSS
-   **Iconography & UI Components:** Lucide React, Radix UI primitives

### Build & Tooling

-   **Build Tool:** Vite 5
-   **Automation:** GNU Make (`Makefile`)
-   **Package Manager:** `pnpm`

## 📦 Getting Started

### Prerequisites

Ensure your development environment meets the following requirements:

-   **Node.js:** `v18.0.0` or higher
-   **Package Manager:** `pnpm` (recommended) or `npm`
-   **Make:** GNU Make installed on your system

### Quick Start with Make

1.  **Clone the Repository:**  
    Bash
    
    git clone https://github.com/EsteNoEsIsra/NasaSpaceApps2026.git  
    cd NasaSpaceApps2026  
    
2.  **Install Dependencies:**  
    Bash
    
    make install  
    
3.  **Launch Development Server:**  
    Bash
    
    make  
    
    *(Note: Running `*make*` directly invokes the `*make dev*` command).*
4.  **Build for Production:**  
    Bash
    
    make build  
    
5.  **Access Application:** Open your web browser and navigate to `http://localhost:5173`.

## 🏆 NASA Space Apps Pitch Highlights

-   **Addressing a Historic Void:** Purpose-built for female astronauts, translating clinical spaceflight endocrinology into intuitive aerospace UI/UX.
-   **Deep-Space Autonomy:** Zero reliance on active ground support—ensures crew safety regardless of light-speed latency or solar flare outages.
-   **Evidence-Based Design:** Grounded thoroughly in peer-reviewed literature from the NASA Human Research Program.
