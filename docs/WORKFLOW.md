# OrigineMaroc — Workflow & Roles

> **Reality check (nevaliCosmetics repo):** Narrative still references **OrigineMaroc** as the product archetype. Implemented roles and routes use **nevaliCosmetics** naming (`superadmin`, `partner` under `/artisan`, `buyer` under `/buyer`). Treat workflow diagrams as intent, not a guarantee of every integration (e.g. payments remain off-platform / backlog).

**Plateforme Produits du Terroir** — Certified Moroccan products from verified cooperatives to global buyers.

---

## 1. Platform overview

OrigineMaroc is a two-sided B2B marketplace that connects **Moroccan producers and cooperatives** with **international buyers**. The platform is built around three value pillars:

| Value proposition | Description |
|-------------------|-------------|
| **Accès direct aux marchés internationaux** | Direct access to international markets for local producers. |
| **Contrats B2B et ventes premium** | B2B contracts and premium sales, with quality-audited, export-ready, traceable products. |

High-level actor flow:

```mermaid
flowchart LR
  subgraph Platform["OrigineMaroc Platform"]
    direction TB
    SuperAdmin["SuperAdmin"]
    Partners["Partners / Cooperatives"]
    Buyers["International Buyers"]
  end
  Partners -->|Register, certify, list products| Platform
  SuperAdmin -->|Validate, assign training, oversee| Partners
  Buyers -->|Browse, RFQ, contract| Platform
  Platform -->|Certified products & contracts| Buyers
```

---

## 2. Roles

### Role 1 — SuperAdmin

The **SuperAdmin** is the platform operator. They ensure quality, compliance, and smooth operations.

**Core features:**

| Area | Actions |
|------|--------|
| **User & Partner Management** | Create / edit / deactivate Partner accounts; assign roles & permissions; track partner activity and engagement. |
| **Quality & Certification Management** | Approve or reject uploaded certifications; track compliance and expiry dates. |
| **Analytics & Reporting** | Export dashboards (sales, compliance, quality metrics). |
| **Training & Programs Management** | Create training programs; assign programs to users/partners. |
| **B2B Contract Oversight** *(à vérifier)* | Approve contracts between partners and buyers; calculate platform commissions. |

```mermaid
flowchart TB
  subgraph SuperAdmin["Role 1: SuperAdmin"]
    UM[User & Partner Management]
    QC[Quality & Certification]
    AR[Analytics & Reporting]
    TP[Training & Programs]
    B2B[B2B Contract Oversight]
  end
  UM --> UM1[Create / Edit / Deactivate Partners]
  UM --> UM2[Assign roles & permissions]
  UM --> UM3[Track activity & engagement]
  QC --> QC1[Approve / Reject certifications]
  QC --> QC2[Track compliance & expiry]
  AR --> AR1[Export dashboards]
  TP --> TP1[Create training programs]
  TP --> TP2[Assign programs to partners]
  B2B --> B2B1[Approve Partner-Buyer contracts]
  B2B --> B2B2[Calculate platform commissions]
```

---

### Role 2 — Partner / Cooperative

**Partners** are producers or cooperatives who register, get certified, list products, and receive RFQs/contracts from buyers.

**Core features:**

| Area | Actions |
|------|--------|
| **Company Profile & Verification** | Upload company documents; submit cooperative details (location, production capacity, certifications). |
| **Product Management** | Add / edit products; set MOQ, pricing, capacity; upload quality documents or images. |
| **Analytics & Reporting** | Export dashboards (sales, compliance, quality metrics). |
| **Certification & Quality Compliance** | Submit products for quality validation; track status (Pending / Approved / Rejected); receive feedback and guidance. |
| **Training Programs / Mise à Niveau** | Enroll in programs assigned by SuperAdmin. |

---

## 3. Validation workflow — Quality certification

This is the main flow for getting a product certified and visible to buyers.

```mermaid
sequenceDiagram
  participant Partner as Partner / Cooperative
  participant System as System
  participant SuperAdmin as SuperAdmin
  participant Buyers as Buyers

  Partner->>System: Upload quality documents & product details
  System->>System: Set status → Pending Validation
  System->>SuperAdmin: Notify for review
  SuperAdmin->>SuperAdmin: Review documents

  alt Approve
    SuperAdmin->>System: Approve
    System->>System: Status → Certified
    System->>Buyers: Product visible to buyers
    System->>Partner: Notification: Certified
  else Reject
    SuperAdmin->>System: Reject + feedback
    System->>System: Status → Rejected
    System->>Partner: Feedback & guidance for improvement
  end
```

**States:** `Pending Validation` → `Certified` (visible to buyers) or `Rejected` (partner receives feedback).

---

## 4. Technical & legal support workflow

How partners get help via support tickets.

```mermaid
sequenceDiagram
  participant Partner as Partner / Cooperative
  participant System as System
  participant Support as Support Team (internal/external)

  Partner->>System: Submit support request (ticket)
  System->>Support: Assign ticket to support team
  Support->>System: Update ticket (status, reply)
  System->>Partner: Partner receives updates
  Partner->>System: Optional: reply or close
```

---

## 5. End-to-end flow (simplified)

From partner registration to buyer contract.

```mermaid
flowchart TB
  subgraph Partner["Partner / Cooperative"]
    R[Register & profile]
    V[Submit for validation]
    L[List products]
    RFQ[Receive RFQs]
    C[Contracts]
  end
  subgraph SuperAdmin["SuperAdmin"]
    A[Approve / Reject]
    T[Assign training]
    O[Contract oversight]
  end
  subgraph Buyer["Buyer"]
    B[Browse certified products]
    R2[Submit RFQ]
    N[Negotiate]
    CO[Contract & orders]
  end

  R --> V
  V --> A
  A -->|Approve| L
  A -->|Reject| V
  L --> B
  B --> R2
  R2 --> RFQ
  RFQ --> N
  N --> C
  C --> O
  O --> CO
  T -.-> R
```

---

## 6. File reference

Standalone Mermaid diagrams are in **`docs/workflow.mmd`** for use in other tools (Mermaid Live Editor, Confluence, etc.).

---

*Last updated from platform spec and role slides (SuperAdmin, Partner/Cooperative).*
