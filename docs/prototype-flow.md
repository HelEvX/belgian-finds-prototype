# Belgian Fossil Finds prototype flow

```mermaid
flowchart TD
    OPEN["Open app"] --> HOME["My specimens
Signed-in home"]

    %% Primary signed-in navigation
    HOME --> ADD["Add a specimen"]
    HOME --> RESUME["Resume a private draft
at its saved stage"]
    HOME --> EXPLORE["Explore specimens"]
    HOME --> SETTINGS["Settings"]

    %% Public exploration
    EXPLORE --> BROWSE["Browse publicly shared specimens"]
    BROWSE --> DETAIL["View specimen detail
Images, context and determination history"]

    %% Direct mobile single-specimen flow
    ADD --> FIRST_TIME{"First time adding
a specimen?"}
    FIRST_TIME -- Yes --> SCOPE["Contribution scope
Belgian finds and documented collections"]
    FIRST_TIME -- No --> PHOTOS["Add specimen photos"]

    SCOPE --> PHOTOS
    PHOTOS --> FIRST_IMAGE["First valid image creates
a private draft"]
    FIRST_IMAGE --> TYPE["What does this appear to be?"]
    TYPE --> PROVENANCE["Provenance
Who originally found or collected it?"]
    PROVENANCE --> CONTEXT["Find location and
collecting context"]
    CONTEXT --> MEASURE["Physical details
Measurements and condition"]
    MEASURE --> DESCRIPTION["Identification and observations
Optional help preference"]
    DESCRIPTION --> PRIVACY["Privacy and sharing preferences"]
    PRIVACY --> READY["Ready for review
Current prototype boundary"]
    READY --> HOME

    %% Save and resume
    FIRST_IMAGE -. "save and finish later" .-> HOME
    TYPE -. "save and finish later" .-> HOME
    PROVENANCE -. "save and finish later" .-> HOME
    CONTEXT -. "save and finish later" .-> HOME
    MEASURE -. "save and finish later" .-> HOME
    DESCRIPTION -. "save and finish later" .-> HOME
    PRIVACY -. "save and finish later" .-> HOME

    %% Next intended product slice
    READY -. "next MVP slice" .-> REVIEW["Review specimen"]
    REVIEW --> SAVE["Save private specimen"]
    SAVE --> HOME

    %% Future sharing and human collaboration
    SAVE -. "later" .-> SHARE["Review and share a selected specimen"]
    SHARE --> DETAIL
    SHARE --> REQUEST["Invite member input
or request verified-specialist help"]
    REQUEST --> RESPONSE["Attributed observation
or determination"]
    RESPONSE --> DETAIL

    DETAIL -. "later" .-> FOLLOW["Follow specimen"]
    FOLLOW -. "later" .-> UPDATES["Updates
Meaningful specimen changes"]
    RESPONSE -. "later" .-> UPDATES

    %% Future desktop-only catalogue import
    ADD -. "later · desktop only" .-> CSV_SETUP["Import an existing catalogue
Choose source catalogue and defaults"]
    CSV_SETUP --> CSV_UPLOAD["Upload one flat CSV
One row = one specimen"]
    CSV_UPLOAD --> CSV_VALIDATE["Validate columns, values and
duplicate catalogue numbers"]
    CSV_VALIDATE --> CSV_DRAFTS["Create private specimen drafts"]
    CSV_DRAFTS --> IMAGE_MATCH["Attach images record by record"]
    IMAGE_MATCH --> REVISION_QUEUE["Complete missing or invalid information"]

    %% Styles
    classDef implemented fill:#d8e9f0,stroke:#10546f,color:#172229,stroke-width:2px;
    classDef decision fill:#fbe5d3,stroke:#d96f2d,color:#172229,stroke-width:2px;
    classDef planned fill:#f3efe7,stroke:#a99c8c,color:#5a6870,stroke-width:1px,stroke-dasharray:5 4,opacity:0.64;
    classDef future fill:#fff8e9,stroke:#c4ad89,color:#465148,stroke-width:1px,stroke-dasharray:4 3,opacity:0.76;

    class OPEN,HOME,ADD,RESUME,EXPLORE,BROWSE,DETAIL,SETTINGS,SCOPE,PHOTOS,FIRST_IMAGE,TYPE,PROVENANCE,CONTEXT,MEASURE,DESCRIPTION,PRIVACY,READY implemented;
    class FIRST_TIME decision;
    class REVIEW,SAVE,SHARE,REQUEST,RESPONSE,FOLLOW,UPDATES planned;
    class CSV_SETUP,CSV_UPLOAD,CSV_VALIDATE,CSV_DRAFTS,IMAGE_MATCH,REVISION_QUEUE future;
```

## Legend

- **Blue, solid:** Implemented in the current interactive prototype.
- **Orange, solid:** Implemented decision point.
- **Faded, dashed:** Agreed next MVP work that is not yet implemented.
- **Warm yellow, dashed:** Future desktop-only catalogue import.

# Current product model

```text
SIGNED-IN HOME
│
├── My specimens
│   ├── Private drafts
│   │   ├── Show a thumbnail and current stage
│   │   └── Resume directly at the saved stage
│   ├── Later: private specimens
│   └── Later: shared specimens
│
├── Explore specimens
│   ├── Browse publicly shared specimens
│   └── View specimen details
│
├── Settings
│   ├── Workflow-guidance preference
│   ├── Image-guidance preference
│   └── Review contribution scope
│
└── Add a specimen
    │
    ├── First contribution only
    │   └── Contribution scope and eligibility guidance
    │
    └── Add specimen photos
        ├── Take a new photograph
        ├── Choose existing photographs
        ├── First valid image creates the private draft
        ├── Further images are added directly to that draft
        ├── Continue directly to specimen type
        └── Save and finish later returns to My specimens
                    │
                    ▼
SPECIMEN DOCUMENTATION
│
├── What does this appear to be?
│   └── Fossil / rock or mineral / collection item / not sure yet
│
├── Provenance
│   └── Original finder, collector, or collection history
│
├── Find location and collecting context
│
├── Physical details
│   └── Measurements and condition
│
├── Identification and observations
│   └── Optional suggested identification and help preference
│
└── Privacy and sharing preferences
    ├── Private by default
    ├── Exact site details remain private
    └── Finish current slice as Ready for review
                    │
                    ▼
MY SPECIMENS
│
└── Ready for review
    └── Later: Review specimen → Save private specimen
```

## Draft creation and image ownership

The mobile single-specimen route remains image-first.

A private draft is created only after the first supported, non-duplicate image is accepted. Opening the photo screen and leaving without an image creates nothing.

After draft creation, `SpecimenDraft.images` is the only owner of the selected files and preview URLs. Returning from specimen type to images edits that same array. Navigation and save-for-later actions do not recreate or transfer preview URLs.

Removing a non-final image removes it from the active draft and revokes only that image’s preview URL. Removing the final image requires confirmation because it discards the private draft and any information entered for it.

## Save and resume behavior

Field changes are written to the active draft as they occur.

**Save and finish later** records the current domain-level stage and returns to My specimens. Selecting a private draft resumes it directly at that stage. It does not require a second queue-selection action.

Opening Settings preserves the active draft and current flow screen. Closing Settings returns to the exact previous screen.

The current prototype stores drafts only in React memory. Refreshing the page loses unfinished drafts, files, preview URLs, and annotations. Only onboarding and guidance preferences use local storage.

## Current endpoint

Completing privacy and sharing choices marks the draft **Ready for review** and returns to My specimens.

This is not yet a completed private specimen. The following transition belongs to the next MVP slice:

```text
Ready for review
→ Review specimen
→ Save private specimen
→ My specimens
```

Publication is a separate later action. Nothing is published from the current privacy screen.

## Legacy prototype routes

The source still contains the earlier batch-image grouping and annotation-queue components. They are preserved temporarily so this refactor does not mix direct-flow work with removal of the legacy prototype.

They are not part of the canonical mobile single-specimen journey.

The arbitrary-thumbnail grouping concept has been superseded by a future desktop-only catalogue-import route:

```text
Choose source catalogue and defaults
→ Upload one flat CSV
→ Validate rows
→ Create one private draft per valid row
→ Attach images record by record
→ Complete missing or invalid information
```

CSV import is not implemented or designed by the current refactor.

## Product boundaries

The prototype deliberately excludes:

- marketplace or sales features;
- valuation requests;
- private messaging;
- reputation points;
- automatic or AI identification;
- a generic social feed;
- institutional data publication;
- production catalogue import;
- advanced moderator tooling.

The project documents fossil specimens connected to Belgium. It does not claim to represent the Belgian fossil community or any geological or palaeontological association.

## Recommended handoff architecture

```text
Frontend responsibility
────────────────────────────────
React PWA
UX and UI
Forms and validation
Responsive behavior
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
Private-location protection
Image permissions
Moderation authority
Audit and security controls
Production deployment
```

## Frontend handoff point

The intended frontend beta includes:

- a complete responsive interface;
- the primary signed-in user journeys;
- realistic loading, empty, success, and error states;
- form validation;
- image preview and upload UX;
- multilingual-ready interface structure;
- accessibility;
- seeded specimen data;
- mock accounts and roles;
- mock determination requests;
- API contracts and TypeScript types;
- a development database or mock API;
- frontend tests;
- documented production-backend expectations.

## Production backend boundary

Production services require review and implementation by a suitably experienced backend developer. They include:

- registration and login security;
- password recovery;
- account deletion;
- authorization and role enforcement;
- specialist verification;
- row-level security policies;
- private exact-location protection;
- secure image access;
- moderation privileges;
- audit logging;
- rate limiting and abuse prevention;
- backups and recovery;
- data deletion and export workflows;
- security testing.
