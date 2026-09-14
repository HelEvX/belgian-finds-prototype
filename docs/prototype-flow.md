```mermaid
flowchart TD
    OPEN["Open app"] --> EXPLORE["Welcome / Explore"]

    EXPLORE --> BROWSE["Browse public Belgian-connected records"]
    BROWSE --> DETAIL["View specimen record
images, context and determination history"]

    EXPLORE --> WORKSPACE["My workspace"]
    WORKSPACE --> ADD["Add material
Mission and eligibility guidance"]

    ADD --> ONE["Add one specimen"]
    ADD --> BATCH["Import a batch of existing images"]

    ONE --> ONE_IMAGES["Take new photos
or choose existing images"]
    ONE_IMAGES --> ONE_DRAFT["Create one specimen draft"]

    BATCH --> BATCH_IMAGES["Select existing images"]
    BATCH_IMAGES --> GROUP["Group images by specimen"]
    GROUP --> BATCH_DRAFTS["Review grouped specimen drafts"]

    ONE_DRAFT --> QUEUE["Annotation queue"]
    BATCH_DRAFTS --> QUEUE

    QUEUE --> RECORD_TYPE["Broad material type"]
    RECORD_TYPE --> PROVENANCE["Provenance"]
    PROVENANCE --> CONTEXT["Locality, date and geological context"]
    CONTEXT --> MEASURE["Optional measurements and condition"]
    MEASURE --> DESCRIPTION["Description and optional help request"]
    DESCRIPTION --> PRIVACY["Visibility and locality privacy"]
    PRIVACY --> REVIEW["Review and save private draft"]
    REVIEW --> WORKSPACE

    WORKSPACE --> PUBLISH["Publish a suitable record"]
    PUBLISH --> DETAIL

    PUBLISH --> HELP["Request community or verified-specialist help"]
    HELP --> RESPONSE["Attributed response or determination"]
    RESPONSE --> DETAIL

    OPTIONAL_REF["Optional: add your own catalogue reference
from Trilobase, labels, a notebook or a spreadsheet"] -.-> QUEUE
    CSV_LATER["Later: spreadsheet import for experienced users"] -.-> QUEUE

    classDef core fill:#d8e9f0,stroke:#10546f,color:#172229,stroke-width:2px;
    classDef planned fill:#f3efe7,stroke:#a99c8c,color:#5a6870,stroke-width:1px,stroke-dasharray:5 4,opacity:0.64;
    classDef future fill:#fff8e9,stroke:#c4ad89,color:#465148,stroke-width:1px,stroke-dasharray:4 3;

    class OPEN,EXPLORE,BROWSE,DETAIL,ONE_IMAGES,BATCH_IMAGES,GROUP core;
    class WORKSPACE,ADD,ONE,BATCH,ONE_DRAFT,BATCH_DRAFTS,QUEUE,RECORD_TYPE,PROVENANCE,CONTEXT,MEASURE,DESCRIPTION,PRIVACY,REVIEW,PUBLISH,HELP,RESPONSE planned;
    class OPTIONAL_REF,CSV_LATER future;

```

## Legend

- Blue, solid: implemented in the interactive prototype
- Orange, solid: implemented decision point
- Faded, dashed: planned for the frontend MVP

# Model

```text
ENTRY METHOD
│
├── Record one find
│   ├── Create one specimen draft
│   └── Take new photos or use existing photos
│
└── Batch import
    ├── Describe or choose a collection
    ├── Select existing images
    ├── Group images by specimen
    └── Review specimen drafts
                │
                ▼
SHARED SPECIMEN COMPLETION
│
├── Record type, where not known
├── Provenance
├── Find location and collecting context
├── Physical details
├── Description / request help
├── Privacy and visibility
├── Review
└── Save as draft

```

## Note

The diagram deliberately stops before:

- marketplace or sales;
- private messaging;
- reputation points;
- automatic identification;
- elaborate social feeds;
- institutional data publishing;
- collection CSV imports;
- advanced moderator tooling.

Those would expand the prototype beyond its purpose.

## Recommended handoff architecture

```text
My (frontend) responsibility
────────────────────────────────
React PWA
UX/UI
Forms and validation
Responsive behaviour
Accessibility
Frontend state
Mock service layer
API contracts
User-testing beta

Integration boundary
────────────────────────────────
findsService
authService
mediaService
determinationsService

Backend specialist responsibility
────────────────────────────────
Authentication
Database schema review
Access-control policies
Private location protection
Image permissions
Moderation authority
Audit and security controls
Production deployment
```

## Handoff point

This is a **frontend beta** with a replaceable data-service layer:

- complete responsive UI;
- all primary user journeys;
- realistic loading, empty, success and error states;
- form validation;
- image preview and upload UX;
- multilingual-ready interface structure;
- accessibility;
- seeded catalogue data;
- mock accounts and user roles;
- mock determination requests;
- API contracts and TypeScript types;
- a development database or mock API;
- frontend tests;
- documented expectations for the production backend.

## Backend implementation

I can deliver the complete frontend product experience and a realistic data-integrated testing environment.

**Production services** such as production identity, authorisation, privacy controls and backend security will require review and implementation by a suitably experienced backend developer.

- registration and login security;
- password recovery;
- account deletion;
- authorisation and role enforcement;
- scientist verification;
- Row Level Security policies;
- private exact-location protection;
- secure image access;
- moderation privileges;
- audit logging;
- rate limiting and abuse prevention;
- backups and recovery;
- GDPR-related deletion and data-export workflows;
- security testing.
