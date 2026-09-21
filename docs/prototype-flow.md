# Belgian Fossil Finds prototype flow

```mermaid
flowchart TD
    OPEN["Open prototype"] --> ACCESS{"Choose prototype view"}

    %% Guest journey
    ACCESS -- "Browse as guest" --> GUEST["Guest browsing"]
    GUEST --> BROWSE["Browse public specimens"]
    BROWSE --> DETAIL["View specimen detail<br/>Images, visible context and determination history"]
    DETAIL -. "Guest attempts to follow<br/>or contribute" .-> GUEST_SIGNIN["Sign in / create account<br/>Mock access prompt"]
    GUEST_SIGNIN -- "Continue as Helen" --> MEMBER_HOME

    %% Signed-in member mobile workspace
    ACCESS -- "Continue as Helen" --> MEMBER_HOME["My specimens<br/>Signed-in member home"]

    MEMBER_HOME --> ADD["Add one specimen"]
    MEMBER_HOME --> RESUME["Resume incomplete private draft<br/>at its saved documentation stage"]
    MEMBER_HOME --> OPEN_PRIVATE["Open saved private specimen<br/>or reviewable draft"]
    OPEN_PRIVATE --> REVIEW["Review specimen<br/>Check and edit every section"]

    MEMBER_HOME --> BROWSE
    MEMBER_HOME --> ACCOUNT["Account menu"]
    ACCOUNT --> PREFERENCES["Preferences<br/>Guidance and display choices"]
    MEMBER_HOME --> UPDATES_PLACEHOLDER["Updates<br/>Current empty-state placeholder"]

    %% Direct mobile one-specimen route
    ADD --> FIRST_TIME{"First contribution?"}

    FIRST_TIME -- "Yes" --> SCOPE["Contribution scope<br/>Belgian finds and documented collections"]
    FIRST_TIME -- "No" --> PHOTOS["Add specimen photos"]

    SCOPE --> PHOTOS
    PHOTOS --> FIRST_IMAGE["First valid image creates<br/>one private specimen draft"]
    FIRST_IMAGE --> TYPE["What does this appear to be?"]
    TYPE --> PROVENANCE["Provenance<br/>Who originally found or collected it?"]
    PROVENANCE --> CONTEXT["Find location and<br/>collecting context"]
    CONTEXT --> MEASURE["Physical details<br/>Measurements and condition"]
    MEASURE --> DESCRIPTION["Identification and observations<br/>Optional help preference"]
    DESCRIPTION --> PRIVACY["Privacy and future sharing preference"]
    PRIVACY --> REVIEW
    REVIEW --> SAVE["Save private specimen"]
    SAVE --> MEMBER_HOME

    %% Save and resume from the mobile route
    FIRST_IMAGE -. "Save and finish later" .-> MEMBER_HOME
    TYPE -. "Save and finish later" .-> MEMBER_HOME
    PROVENANCE -. "Save and finish later" .-> MEMBER_HOME
    CONTEXT -. "Save and finish later" .-> MEMBER_HOME
    MEASURE -. "Save and finish later" .-> MEMBER_HOME
    DESCRIPTION -. "Save and finish later" .-> MEMBER_HOME
    PRIVACY -. "Save and finish later" .-> MEMBER_HOME

    %% Desktop member workspace and catalogue import
    MEMBER_HOME --> DESKTOP_SWITCH["Switch to desktop workspace"]
    DESKTOP_SWITCH --> DESKTOP_SPECIMENS["Desktop specimen workspace<br/>View specimens and import a catalogue"]
    DESKTOP_SPECIMENS --> OPEN_PRIVATE
    DESKTOP_SPECIMENS --> CSV_LANDING["Import an existing catalogue<br/>Desktop only"]

    CSV_LANDING --> CSV_TEMPLATE["Choose collection template<br/>Fossil template currently available"]
    CSV_TEMPLATE --> CSV_CONTEXT["Choose collecting-context mode<br/>Shared defaults or per-record values"]
    CSV_CONTEXT --> CSV_DOWNLOAD["Download generated CSV template"]
    CSV_DOWNLOAD --> CSV_SPREADSHEET["Complete spreadsheet offline<br/>Excel, Google Sheets or equivalent"]
    CSV_SPREADSHEET --> CSV_UPLOAD["Upload completed CSV"]

    CSV_LANDING --> CSV_UPLOAD
    CSV_UPLOAD --> CSV_VALIDATE["Validate template metadata,<br/>columns, row values and duplicate catalogue numbers"]
    CSV_VALIDATE --> CSV_REVIEW["Review rows, warnings and errors<br/>Paginated desktop review"]

    CSV_REVIEW -. "Correct errors offline" .-> CSV_FIX["Amend spreadsheet<br/>and export CSV again"]
    CSV_FIX -. "Upload revised file" .-> CSV_UPLOAD

    CSV_REVIEW --> CSV_STOP["Valid CSV review complete<br/>Draft creation not connected yet"]

    %% Planned catalogue-record connection
    CSV_STOP -. "Next integration step" .-> CSV_DRAFTS["Create imported specimen drafts<br/>One valid row = one draft"]
    CSV_DRAFTS -. "Later" .-> IMAGE_MATCH["Attach images<br/>record by record"]
    IMAGE_MATCH -. "Later" .-> REVISION_QUEUE["Resolve missing information<br/>and validation gaps"]
    REVISION_QUEUE -. "Later" .-> REVIEW

    %% Planned owner-controlled sharing
    OPEN_PRIVATE -. "Later" .-> SHARE["Prepare to share"]
    SHARE --> SHARE_CHOICES["Choose public visibility,<br/>locality precision and interaction policy"]
    SHARE_CHOICES --> SHARED_RECORD["Shared specimen<br/>Visible to members"]
    SHARED_RECORD -. "Later: appears in" .-> BROWSE

    SHARE_CHOICES -. "Later: owner may choose" .-> REQUEST["Invite member observations<br/>or request verified-specialist help"]
    REQUEST --> RESPONSE["Attributed observation<br/>or determination"]
    RESPONSE --> DETAIL

    %% Planned following and meaningful updates
    DETAIL -. "Later" .-> FOLLOW["Follow specimen"]
    FOLLOW -. "Later: creates" .-> UPDATE_EVENTS["Meaningful specimen updates"]
    RESPONSE -. "Later: creates" .-> UPDATE_EVENTS
    UPDATE_EVENTS -. "Later: shown in" .-> UPDATES_PLACEHOLDER

    %% Visual styles
    classDef implemented fill:#d8e9f0,stroke:#10546f,color:#172229,stroke-width:2px;
    classDef decision fill:#fbe5d3,stroke:#d96f2d,color:#172229,stroke-width:2px;
    classDef planned fill:#f3efe7,stroke:#a99c8c,color:#5a6870,stroke-width:1px,stroke-dasharray:5 4,opacity:0.66;
    classDef future fill:#fff8e9,stroke:#c4ad89,color:#465148,stroke-width:1px,stroke-dasharray:4 3,opacity:0.78;
    classDef external fill:#faf9f6,stroke:#aca397,color:#5c675d,stroke-width:1px,stroke-dasharray:2 3,opacity:0.9;

    %% Implemented interactive prototype routes
    class OPEN,GUEST,GUEST_SIGNIN,MEMBER_HOME,RESUME,OPEN_PRIVATE,BROWSE,DETAIL,ACCOUNT,PREFERENCES,UPDATES_PLACEHOLDER,ADD,SCOPE,PHOTOS,FIRST_IMAGE,TYPE,PROVENANCE,CONTEXT,MEASURE,DESCRIPTION,PRIVACY,REVIEW,SAVE,DESKTOP_SWITCH,DESKTOP_SPECIMENS,CSV_LANDING,CSV_TEMPLATE,CSV_CONTEXT,CSV_DOWNLOAD,CSV_UPLOAD,CSV_VALIDATE,CSV_REVIEW,CSV_STOP implemented;

    %% Implemented decisions
    class ACCESS,FIRST_TIME decision;

    %% External/off-app actions
    class CSV_SPREADSHEET,CSV_FIX external;

    %% Agreed next community-sharing work
    class SHARE,SHARE_CHOICES,SHARED_RECORD,REQUEST,RESPONSE,FOLLOW,UPDATE_EVENTS planned;

    %% Future desktop catalogue-completion work
    class CSV_DRAFTS,IMAGE_MATCH,REVISION_QUEUE future;
```

## Legend

- **Blue, solid:** Implemented and currently interactive in the prototype.
- **Orange, solid:** Implemented choice or entry decision.
- **Grey, dotted:** An action outside the app, such as completing or correcting a spreadsheet.
- **Faded, dashed:** Agreed next MVP work, not yet implemented.
- **Warm yellow, dashed:** Future catalogue-import completion work after CSV review.

# Current product model

```text
SIGNED-IN HOME
│
├── My specimens
│   ├── Needs information
│   │   └── Resume directly at the saved stage
│   ├── Ready for review
│   │   └── Open Review specimen
│   ├── Private specimens
│   │   └── Open Review specimen
│   └── Later: shared specimens
│
├── Explore specimens
│   ├── Browse publicly shared specimens
│   └── View specimen details
│
├── Account menu
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
├── Privacy and sharing preferences
│   ├── Private by default
│   └── Exact site details remain private
│
├── Review specimen
│   ├── Read-only summary of every meaningful section
│   ├── Direct Edit action for each existing screen
│   └── At least one image required for private save
│
└── Save private specimen
                    │
                    ▼
MY SPECIMENS
│
└── Private specimens
    └── Open Review specimen again
```

## Draft creation and image ownership

The mobile single-specimen route remains image-first.

A private draft is created only after the first supported, non-duplicate image is accepted. Opening the photo screen and leaving without an image creates nothing.

After draft creation, `SpecimenDraft.images` is the only owner of the selected files and preview URLs. Returning from specimen type to images edits that same array. Navigation and save-for-later actions do not recreate or transfer preview URLs.

Removing an image removes it from the active draft and revokes only that image’s preview URL. Removing the final image preserves the draft and all entered information, sets its resume stage to Images, and prevents continuation or private save until a replacement image is added. No native confirmation dialog is used.

## Save and resume behavior

Field changes are written to the active draft as they occur.

**Save and finish later** records the current domain-level stage and returns to My specimens. Selecting an incomplete draft resumes it directly at that stage. Selecting an entry that is Ready for review or already saved as a Private specimen opens Review specimen.

Opening Settings preserves the active draft and current flow screen. Closing Settings returns to the exact previous screen.

The current prototype stores drafts only in React memory. Refreshing the page loses unfinished drafts, files, preview URLs, and annotations. Only onboarding and guidance preferences use local storage.

## Review and private save

Completing privacy and sharing choices opens **Review specimen**. The review screen presents a read-only summary of images, type, provenance, find location, physical details, identification and observations, help preference, and privacy settings.

Each section has an Edit action that opens the relevant existing screen. Completing or backing out of that focused edit returns to Review with the same draft data and image ownership.

**Save private specimen** requires at least one image. It changes the local status to Private specimen, updates the modification time, keeps all data and images in local state, and returns to My specimens.

Saving privately does not publish the specimen, apply the future sharing preference, or expose exact locality data. The current prototype still loses all specimen data on browser refresh.

## Archived prototype routes

The earlier arbitrary batch-image grouping, image-route choice, workspace, and annotation-queue components are no longer imported or rendered by the active application.

Their source remains temporarily under `src/obsolete/` for historical reference. Their CSS is not included in the active application bundle.

Selecting several files in the normal specimen-photo screen means:

> These photographs are different views of one physical specimen.

It does not create several specimens and is not a bulk-import feature.

The future catalogue-import workflow is separate:

```text
Import an existing catalogue
→ Choose or describe the source catalogue
→ Upload one flat CSV
→ Validate columns and rows
→ Valid rows are reviewed before private-record creation
→ Attach images specimen by specimen
→ Resolve missing or invalid information
→ My specimens
```

The future catalogue import must not reuse the archived arbitrary-thumbnail grouping model.

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
