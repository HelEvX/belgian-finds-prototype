```mermaid
flowchart TD
    START["Open app"] --> HOME["Explore / welcome"]

    %% Explore journey
    HOME --> BROWSE["Browse finds"]
    BROWSE --> DETAIL["View find detail"]
    HOME --> ADD["Add material"]

    %% Add journey
    ADD --> METHOD{"Choose a path"}

    METHOD --> SINGLE_INTRO["Single find introduction"]
    SINGLE_INTRO --> RECORD_TYPE["Choose record type"]

    METHOD --> COLLECTION_INTRO["Collection import overview"]
    COLLECTION_INTRO --> BULK_MODAL["Open bulk image importer"]
    BULK_MODAL --> LOCAL_IMAGES["Select and preview local images"]
    LOCAL_IMAGES --> BATCH_READY["Draft workspace ready"]

    %% Planned single-find flow
    RECORD_TYPE --> PHOTOS["Add photos
    Camera or existing files"]
    PHOTOS --> CONTEXT["Add provenance and location"]
    PHOTOS --> PROVENANCE["Who originally found it?"]
    PROVENANCE --> CONTEXT["Add find location and collecting context"]
    CONTEXT --> DETAILS["Add size and geological context"]
    DETAILS --> QUESTION["Describe find / ask for help"]
    QUESTION --> PRIVACY["Choose visibility and location privacy"]
    PRIVACY --> REVIEW["Review record"]
    REVIEW --> SAVE_DRAFT["Save find as draft"]

    %% Planned collection flow
    BATCH_READY --> COLLECTION_META["Create or choose collection"]
    COLLECTION_META --> GROUP_IMAGES["Group images by specimen"]
    GROUP_IMAGES --> REVIEW_BATCH["Review specimen drafts"]
    REVIEW_BATCH --> SAVE_BATCH["Save private draft records"]

    %% Planned personal collection area
    SAVE_DRAFT --> MY_FINDS["My finds"]
    SAVE_BATCH --> MY_FINDS
    MY_FINDS --> EDIT_FIND["View or edit a draft"]
    EDIT_FIND --> PUBLISH["Publish or request community help"]

    %% Planned human determination flow
    PUBLISH --> HELP_REQUEST["Open help request"]
    HELP_REQUEST --> HELP_QUEUE["Community / specialist help queue"]
    HELP_QUEUE --> RESPONSE["Add attributed determination"]
    RESPONSE --> UPDATED_FIND["Updated find with determination history"]
    UPDATED_FIND --> DETAIL

    %% Implemented styles
    classDef done fill:#d8e9f0,stroke:#10546f,color:#172229,stroke-width:2px;
    classDef doneDecision fill:#fbe5d3,stroke:#d96f2d,color:#172229,stroke-width:2px;

    %% Planned styles
    classDef planned fill:#f3efe7,stroke:#a99c8c,color:#5a6870,stroke-width:1px,stroke-dasharray:5 4,opacity:0.58;

    class START,HOME,BROWSE,DETAIL,ADD,SINGLE_INTRO,RECORD_TYPE,COLLECTION_INTRO,BULK_MODAL,LOCAL_IMAGES,BATCH_READY,GROUP_IMAGES,REVIEW_BATCH,PHOTOS,CONTEXT,PROVENANCE,DETAILS done;
    class METHOD doneDecision;
    class COLLECTION_META,QUESTION,PRIVACY,REVIEW,SAVE_DRAFT,SAVE_BATCH,MY_FINDS,EDIT_FIND,PUBLISH,HELP_REQUEST,HELP_QUEUE,RESPONSE,UPDATED_FIND planned;
```

## Legend

- Blue, solid: implemented in the interactive prototype
- Orange, solid: implemented decision point
- Faded, dashed: planned for the frontend MVP

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
