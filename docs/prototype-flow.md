# Belgian Fossil Finds prototype flow

```mermaid
flowchart TD
    OPEN["Open prototype"] --> ACCESS{"Choose prototype view"}

    %% Guest journey
    ACCESS -- "Browse as guest" --> GUEST["Guest browsing"]
    GUEST --> BROWSE["Browse public specimens"]
    BROWSE --> DETAIL["View specimen detail
Images, visible context and determination history"]
    DETAIL -. "Guest attempts to follow
or contribute" .-> GUEST_SIGNIN["Sign in / create account
Mock access prompt"]
    GUEST_SIGNIN -- "Continue as Helen" --> MEMBER_HOME

    %% Signed-in member mobile workspace
    ACCESS -- "Continue as Helen" --> MEMBER_HOME["My specimens
Signed-in member home"]

    MEMBER_HOME --> ADD["Add one specimen"]
    MEMBER_HOME --> RESUME["Resume incomplete manual draft
at its saved documentation stage"]
    MEMBER_HOME --> OPEN_PRIVATE["Open saved private specimen
or reviewable draft"]

    OPEN_PRIVATE --> REVIEW["Review specimen
Check and edit every section"]

    MEMBER_HOME --> BROWSE
    MEMBER_HOME --> ACCOUNT["Account menu"]
    ACCOUNT --> PREFERENCES["Preferences
Guidance and display choices"]
    MEMBER_HOME --> UPDATES_PLACEHOLDER["Updates
Current empty-state placeholder"]

    %% Direct mobile one-specimen route
    ADD --> FIRST_TIME{"First contribution?"}

    FIRST_TIME -- "Yes" --> SCOPE["Contribution scope
Belgian finds and documented collections"]
    FIRST_TIME -- "No" --> PHOTOS["Add specimen photos"]

    SCOPE --> PHOTOS
    PHOTOS --> FIRST_IMAGE["First valid image creates
one private specimen draft"]
    FIRST_IMAGE --> TYPE["What does this appear to be?"]
    TYPE --> PROVENANCE["Provenance
Who originally found or collected it?"]
    PROVENANCE --> CONTEXT["Find location and
collecting context"]
    CONTEXT --> MEASURE["Physical details
Measurements and condition"]
    MEASURE --> DESCRIPTION["Identification and observations
Optional help preference"]
    DESCRIPTION --> PRIVACY["Privacy and future sharing preference"]
    PRIVACY --> REVIEW
    REVIEW --> SAVE["Save private specimen"]
    SAVE --> MEMBER_HOME

    %% Save and resume from mobile route
    FIRST_IMAGE -. "Save and finish later" .-> MEMBER_HOME
    TYPE -. "Save and finish later" .-> MEMBER_HOME
    PROVENANCE -. "Save and finish later" .-> MEMBER_HOME
    CONTEXT -. "Save and finish later" .-> MEMBER_HOME
    MEASURE -. "Save and finish later" .-> MEMBER_HOME
    DESCRIPTION -. "Save and finish later" .-> MEMBER_HOME
    PRIVACY -. "Save and finish later" .-> MEMBER_HOME

    %% Desktop workspace and catalogue import
    MEMBER_HOME --> DESKTOP_SWITCH["Switch to desktop workspace"]
    DESKTOP_SWITCH --> DESKTOP_SPECIMENS["Desktop specimen workspace
Private specimens and catalogue imports"]
    DESKTOP_SPECIMENS --> OPEN_PRIVATE
    DESKTOP_SPECIMENS --> CSV_LANDING["Import an existing catalogue
Desktop only"]

    %% CSV template route
    CSV_LANDING --> CSV_TEMPLATE["Choose collection template
Fossil template currently available"]
    CSV_TEMPLATE --> CSV_CONTEXT["Choose collecting-context mode
Shared defaults or per-record values"]
    CSV_CONTEXT --> CSV_DOWNLOAD["Download generated CSV template"]
    CSV_DOWNLOAD --> CSV_SPREADSHEET["Complete spreadsheet outside the app
Excel, Google Sheets or equivalent"]
    CSV_SPREADSHEET --> CSV_UPLOAD["Upload completed CSV"]

    %% Direct upload route
    CSV_LANDING --> CSV_UPLOAD
    CSV_UPLOAD --> CSV_VALIDATE["Validate template metadata,
columns, values and duplicate catalogue numbers"]
    CSV_VALIDATE --> CSV_REVIEW["Review rows, warnings and errors
Paginated desktop review"]

    CSV_REVIEW -. "Correct errors offline" .-> CSV_FIX["Amend spreadsheet
and export CSV again"]
    CSV_FIX -. "Upload revised file" .-> CSV_UPLOAD

    %% Implemented session boundary
    CSV_REVIEW --> CREATE_SESSION["Create private desktop
catalogue-import session"]
    CREATE_SESSION --> IMPORT_SESSION["Catalogue import session
Records remain outside My specimens"]
    IMPORT_SESSION --> IMAGE_POOL["Build collection image pool
Choose image files or a folder"]
    IMAGE_POOL --> POOL_READY["Private image pool ready
Previews, duplicate protection and unassigned count"]

    %% Planned desktop import completion
    POOL_READY -. "Next step" .-> MATCH_START["Start image matching"]
    MATCH_START -. "One record at a time" .-> MATCH_RECORD["Serve catalogue record
Select its corresponding images"]
    MATCH_RECORD -. "Exclusive assignment" .-> LOCK_IMAGES["Assigned images become unavailable
for all other records"]
    LOCK_IMAGES -. "Next / previous / skip" .-> MATCH_RECORD
    MATCH_RECORD -. "Continue or pause" .-> MATCH_OVERVIEW["Matching progress and
unassigned-image overview"]

    MATCH_OVERVIEW -. "When matching is complete
or work is paused" .-> GAP_QUEUE["Desktop completion queue
Resolve only remaining information gaps"]
    GAP_QUEUE -. "Ready records only" .-> IMPORT_REVIEW["Import-session review
Ready, unresolved and skipped records"]
    IMPORT_REVIEW -. "Finalise selected records" .-> FINALISE["Create private specimens
from completed import records"]
    FINALISE -. "Completed records appear in" .-> MEMBER_HOME

    %% Planned owner-controlled sharing
    OPEN_PRIVATE -. "Later" .-> SHARE["Prepare to share"]
    SHARE --> SHARE_CHOICES["Choose public visibility,
locality precision and interaction policy"]
    SHARE_CHOICES --> SHARED_RECORD["Shared specimen
Visible to members"]
    SHARED_RECORD -. "Later: appears in" .-> BROWSE

    SHARE_CHOICES -. "Later: owner may choose" .-> REQUEST["Invite member observations
or request verified-specialist help"]
    REQUEST --> RESPONSE["Attributed observation
or determination"]
    RESPONSE --> DETAIL

    %% Planned following and meaningful updates
    DETAIL -. "Later" .-> FOLLOW["Follow specimen"]
    FOLLOW -. "Later: creates" .-> UPDATE_EVENTS["Meaningful specimen updates"]
    RESPONSE -. "Later: creates" .-> UPDATE_EVENTS
    UPDATE_EVENTS -. "Later: shown in" .-> UPDATES_PLACEHOLDER

    %% Visual styles
    classDef implemented fill:#d8e9f0,stroke:#10546f,color:#172229,stroke-width:2px;
    classDef decision fill:#fbe5d3,stroke:#d96f2d,color:#172229,stroke-width:2px;
    classDef external fill:#faf9f6,stroke:#aca397,color:#5c675d,stroke-width:1px,stroke-dasharray:2 3,opacity:0.9;
    classDef importNext fill:#fff8e9,stroke:#c4ad89,color:#465148,stroke-width:1px,stroke-dasharray:4 3,opacity:0.82;
    classDef future fill:#f3efe7,stroke:#a99c8c,color:#5a6870,stroke-width:1px,stroke-dasharray:5 4,opacity:0.66;

    %% Implemented interactive prototype routes
    class OPEN,GUEST,GUEST_SIGNIN,MEMBER_HOME,RESUME,OPEN_PRIVATE,BROWSE,DETAIL,ACCOUNT,PREFERENCES,UPDATES_PLACEHOLDER,ADD,SCOPE,PHOTOS,FIRST_IMAGE,TYPE,PROVENANCE,CONTEXT,MEASURE,DESCRIPTION,PRIVACY,REVIEW,SAVE,DESKTOP_SWITCH,DESKTOP_SPECIMENS,CSV_LANDING,CSV_TEMPLATE,CSV_CONTEXT,CSV_DOWNLOAD,CSV_UPLOAD,CSV_VALIDATE,CSV_REVIEW,CREATE_SESSION,IMPORT_SESSION,IMAGE_POOL,POOL_READY implemented;

    %% Implemented decisions
    class ACCESS,FIRST_TIME decision;

    %% External/off-app actions
    class CSV_SPREADSHEET,CSV_FIX external;

    %% Next desktop catalogue-import work
    class MATCH_START,MATCH_RECORD,LOCK_IMAGES,MATCH_OVERVIEW,GAP_QUEUE,IMPORT_REVIEW,FINALISE importNext;

    %% Future community-sharing work
    class SHARE,SHARE_CHOICES,SHARED_RECORD,REQUEST,RESPONSE,FOLLOW,UPDATE_EVENTS future;

```

## Legend

- **Blue, solid:** Implemented and currently interactive in the prototype.
- **Orange, solid:** Implemented user choice or entry decision.
- **Grey, dotted:** Work completed outside the app, such as editing the CSV.
- **Warm yellow, dashed:** Agreed next catalogue-import work.
- **Faded grey, dashed:** Later public/community features.

# Current product model

```text
SIGNED-IN PRODUCT

├── MOBILE: PERSONAL SPECIMEN WORKSPACE
│   │
│   ├── My specimens
│   │   │
│   │   ├── Manual drafts
│   │   │   └── Resume at their saved documentation stage
│   │   │
│   │   ├── Ready for review
│   │   │   └── Open the complete specimen review
│   │   │
│   │   ├── Saved private specimens
│   │   │   └── Open and edit the private specimen again
│   │   │
│   │   └── Later: finalised catalogue-import specimens
│   │       └── Appear only after desktop import completion
│   │
│   ├── Add one specimen
│   │   │
│   │   ├── First contribution only
│   │   │   └── Contribution scope and eligibility guidance
│   │   │
│   │   └── Mobile specimen capture
│   │       ├── Take a new photograph
│   │       ├── Choose existing device photographs
│   │       ├── First valid image creates one private specimen draft
│   │       ├── Further images belong directly to that draft
│   │       ├── Continue through documentation
│   │       └── Save and finish later returns to My specimens
│   │
│   ├── Explore specimens
│   │   ├── Browse publicly shared specimens
│   │   └── View public specimen details
│   │
│   ├── Updates
│   │   └── Current empty-state placeholder
│   │
│   └── Account menu
│       ├── Workflow-guidance preference
│       ├── Image-guidance preference
│       └── Review contribution scope
│
├── SHARED MOBILE SPECIMEN DOCUMENTATION
│   │
│   ├── What does this appear to be?
│   │   └── Fossil / rock or mineral / collection item / not sure yet
│   │
│   ├── Provenance
│   │   └── Original finder, collector, or collection history
│   │
│   ├── Find location and collecting context
│   │
│   ├── Physical details
│   │   └── Measurements and condition
│   │
│   ├── Identification and observations
│   │   └── Suggested identification, certainty and optional help preference
│   │
│   ├── Privacy and sharing preferences
│   │   ├── Private by default
│   │   └── Exact site details remain private
│   │
│   ├── Review specimen
│   │   ├── Read-only summary of meaningful sections
│   │   ├── Direct Edit action for each section
│   │   └── At least one image required for private save
│   │
│   └── Save private specimen
│
└── DESKTOP: CATALOGUE-IMPORT WORKSPACE
    │
    ├── Import an existing collection
    │   │
    │   ├── Choose or download a fossil CSV template
    │   ├── Choose shared or per-record collecting context
    │   ├── Complete the spreadsheet outside the app
    │   ├── Upload completed CSV
    │   ├── Validate metadata, columns, duplicate catalogue numbers,
    │   │   row errors and warnings
    │   └── Review CSV rows in a paginated desktop table
    │
    ├── Catalogue import session
    │   │
    │   ├── Private work area for one uploaded collection
    │   ├── Owns CSV-derived catalogue records
    │   ├── Owns the collection image pool
    │   ├── Does NOT add unfinished records to My specimens
    │   └── Does NOT make anything public
    │
    ├── Collection image pool
    │   │
    │   ├── Choose all likely collection images at once
    │   ├── Optional desktop folder selection where browser-supported
    │   ├── File and thumbnail previews
    │   ├── Duplicate-file protection
    │   ├── Unassigned-image count
    │   └── No image-to-record assignment yet
    │
    └── NEXT: DESKTOP IMPORT COMPLETION
        │
        ├── Image matching workspace
        │   ├── Serve one catalogue record at a time
        │   ├── Select one or more corresponding images
        │   ├── Assign an image to no more than one record
        │   ├── Disable and grey images already assigned elsewhere
        │   ├── Previous / next / skip / return to session
        │   └── Review all unassigned images
        │
        ├── Missing-information queue
        │   ├── Resolve flagged CSV warnings or decisions
        │   ├── Complete only information genuinely still needed
        │   ├── Keep historical unknowns valid and non-blocking
        │   └── Do not force a species identification
        │
        ├── Import-session review
        │   ├── Ready records
        │   ├── Records needing images
        │   ├── Records needing information
        │   └── Records deliberately skipped for now
        │
        └── Finalise selected records privately
            │
            ├── Creates normal private specimens
            ├── Preserves collection name and catalogue number
            ├── Preserves original CSV metadata and assigned images
            ├── Makes finalised records available in My specimens
            └── Keeps the import session as private provenance/history

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
