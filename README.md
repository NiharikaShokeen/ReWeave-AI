# ReWeave AI

A circular recovery decision-support prototype for small garment workshops, tailoring units, and boutiques.

---

## 1. Problem
Small tailoring units, boutiques, and localized garment workshops generate irregular fabric scraps during production. These remnants vary widely in fiber type, dimensions, cleanliness, and weave form. Without accessible material guidance, workshop operators often struggle to determine whether a given batch is viable for direct product reuse, suitable for mechanical fiber recycling, or requires physical verification. As a result, usable textiles are frequently discarded into municipal solid waste.

---

## 2. Target Users
* Small tailoring units
* Boutiques and custom fashion studios
* Local garment cutting workshops
* Small textile craft businesses
* Workshop owners and tailoring workers

*(Note: This application is designed for localized small-batch production, not large-scale industrial textile mills).*

---

## 3. Proposed Solution
The **Textile Scrap Reuse Advisor** is a focused single-screen decision-support tool. By evaluating observable remnant characteristics (apparent fiber, piece size, physical form, cleanliness, and descriptive workshop notes), the tool routes each scrap batch into one of three clear recovery pathways:
* **`REUSE`**: Direct product remanufacturing (facings, pockets, patchwork, accessories) preserving embodied weaving energy.
* **`RECYCLE`**: Mechanical fiber recovery (garnetting, shoddy regeneration, insulation, stuffing) for clean mono-materials.
* **`FURTHER CHECK`**: Physical verification (flame/burn tests, tag lookup, laundering) when information is insufficient or contaminated.

---

## 4. Why AI is Useful
Textile remnant evaluation requires synthesizing multiple inter-dependent attributes simultaneously:
* A rule table might see "Cotton" and suggest reuse, but fail to account for fragmented 3 cm offcuts or machine oil contamination.
* AI combines structured fields with unstructured workshop descriptions (e.g., *"remnants from linen-blend trouser production, oily spots near hem"*), interpreting the context holistically.
* It communicates uncertainty transparently rather than forcing a simplistic guess when evidence is ambiguous.

---

## 5. Workflow
```
SCRAP INTAKE FORM
(Material, Physical Form, Condition, Notes, Optional Image)
        ↓
ASSESS SCRAP ACTION
        ↓
ASSESSMENT SERVICE (assessScrap)
├── Cloud LLM (Google Gemini API if key configured)
└── Local Fallback Engine (Rule-assisted heuristic evaluator)
        ↓
STRUCTURED WORKSHOP RESULT
├── Material Assessment
├── Recovery Potential: HIGH | MEDIUM | LOW
├── Recommended Pathway: REUSE | RECYCLE | FURTHER CHECK
├── Suggested Uses & Workshop Actions
├── Why This Recommendation?
├── Decision Confidence: HIGH | MEDIUM | LOW
└── Limitations & Uncertainty Warnings
```

---

## 6. Technology Used
* **Frontend:** React 18, Vite
* **Styling:** Modular CSS design system with tactile material-inspired tokens (`IBM Plex Sans` & `IBM Plex Mono`)
* **Architecture:** Decoupled service facade (`src/services/assessmentService.js`) separating the UI from evaluation engines
* **Cloud AI Engine:** Google Gemini API (`gemini-2.5-flash`) with structured JSON schema enforcement
* **Offline Fallback Engine:** Deterministic rule-assisted heuristic evaluator (non-ML)

---

## 7. SDG Alignment
* **Primary SDG:** **SDG 12 – Responsible Consumption and Production**  
  Directly aligns with **Target 12.5**: Substantially reduce waste generation through prevention, reduction, recycling, and reuse within small-scale textile production loops.
* **Secondary SDG:** **SDG 13 – Climate Action (indirect contribution)**  
  Indirect potential greenhouse gas mitigation achieved by diverting post-cutting remnants from municipal landfill decomposition and incineration.

---

## 8. Responsible AI
* **Advisory Status:** AI assessment is strictly advisory decision support; it does not replace operational regulations or worker safety requirements.
* **Visual Limitations:** Exact textile fiber composition cannot be confirmed from an ordinary photograph alone. Visual cues provide surface context only.
* **Error Acknowledgment:** AI models can make mistakes, especially with blended or chemically finished textiles.
* **Human-in-the-Loop:** Workshop operators must apply human judgement and conduct physical tests (such as burn tests) before committing batches to commercial recycling or bulk cutting.
* **Uncertainty by Design:** The engine will not force a recommendation when evidence is lacking; ambiguous batches are routed to `FURTHER CHECK`.
* **Zero Fabricated Impact:** The prototype contains no invented environmental statistics, fake CO2 savings numbers, or fabricated metrics.

---

## 9. Validation & Limitations
* **Validation Methodology:** Prototype validation is performed using representative manual test cases (e.g., clean cotton panels, tiny clipping shreds, contaminated cutting floor sweeps, and mystery blended bins) to verify pathway routing and schema compliance.
* **Not a Trained ML Model:** The local fallback provider is a rule-assisted heuristic system, not a trained machine learning model.
* **Chemical Purity:** The tool does not perform laboratory chemical spectroscopy and cannot certify fiber purity (e.g., "100% Cotton").

---

## 10. How to Run the Project

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or higher)
* [npm](https://www.npmjs.com/) (version 9 or higher)

### Setup & Execution
1. Navigate to the project directory:
   ```bash
   cd textile-scrap-advisor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure Gemini API Key:
   Create a `.env` file in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(If omitted, the application automatically uses the local fallback engine).*

4. Launch the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. Build for production:
   ```bash
   npm run build
   ```
