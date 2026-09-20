import type { StepNote } from "./types";

export const stepNotes: StepNote[] = [
  {
    label: "Signed-in home",
    title: "My specimens",
    purpose:
      "Give a signed-in contributor a personal starting point for adding specimens and resuming unfinished private drafts.",
    matters:
      "A contributor should be able to continue a specific specimen directly rather than entering an annotation queue and selecting it again.",
    decision:
      "My specimens groups entries that need information, are ready for review, or have been saved as private specimens. Drafts resume at their saved stage; reviewable and private specimens open Review.",
  },
  {
    label: "Public exploration · Step 1 of 2",
    title: "Explore specimens",
    purpose: "Let members browse publicly shared specimens connected to Belgium.",
    matters: "Exploration remains separate from the signed-in contributor’s private specimens and unfinished work.",
    decision:
      "Explore is a dedicated navigation destination. It does not claim to represent a Belgian fossil community or any association.",
  },
  {
    label: "Public exploration · Step 2 of 2",
    title: "Specimen detail",
    purpose:
      "Show one shared specimen in enough detail for another member to understand its images, context, and determination history.",
    matters:
      "The detail page must distinguish the contributor’s original statement from later attributed observations or verified determinations.",
    decision: "Future interaction remains controlled by the specimen owner and is outside this prototype step.",
  },
  {
    label: "Legacy prototype route",
    title: "Image-intake route choice",
    purpose:
      "Preserve access to the older single-image and batch-grouping prototype while its remaining behavior is reviewed separately.",
    matters:
      "The active mobile single-specimen journey no longer asks the contributor to choose an intake architecture.",
    decision:
      "Normal mobile Add navigation bypasses this screen and opens specimen photos directly. Future catalogue import will be a separate desktop-only route.",
  },
  {
    label: "First contribution only",
    title: "Before you add a specimen",
    purpose: "Introduce the project’s contribution scope once before a member adds their first specimen.",
    matters:
      "The project needs a clear scientific and ethical boundary without repeating it during every contribution.",
    decision:
      "After the first-time introduction, the contributor continues directly to specimen photos. The introduction remains available from Settings.",
  },
  {
    label: "Specimen details · Type",
    title: "What does this appear to be?",
    purpose: "Capture a broad apparent specimen type after at least one image has created the private draft.",
    matters:
      "A contributor should not need a confident identification before documenting a specimen or asking for later human input.",
    decision:
      "The contributor continues directly from images to type. Back returns to the same draft-owned images without recreating preview URLs.",
  },
  {
    label: "Legacy prototype route",
    title: "Batch image grouping",
    purpose:
      "Retain the existing batch-image grouping prototype without treating it as part of the current mobile product flow.",
    matters:
      "Arbitrary image grouping has been superseded conceptually by a future desktop-only catalogue-import workflow.",
    decision:
      "This screen remains isolated for now. It must not influence the state model or copy of the direct single-specimen journey.",
  },
  {
    label: "Add a specimen · Photos",
    title: "Add specimen photos",
    purpose: "Associate one or more photographs with one physical specimen before collecting detailed information.",
    matters:
      "Images provide a natural mobile starting point and allow a contributor to begin without knowing the specimen’s type or history.",
    decision:
      "The first accepted image creates the private draft. Later images belong directly to that draft. Continue opens specimen type, while Save and finish later returns to My specimens.",
  },
  {
    label: "Specimen details · Provenance",
    title: "Who originally found it?",
    purpose:
      "Record the original finder, collector, or collection history separately from the current owner or custodian.",
    matters: "Provenance and find location may contribute more scientific meaning than appearance alone.",
    decision: "Uncertainty remains available for inherited or older specimens whose collecting history is incomplete.",
  },
  {
    label: "Specimen details · Find location",
    title: "Find location and collecting context",
    purpose: "Record the best available Belgian find location and any surviving geological or collecting context.",
    matters:
      "A locality, geological layer, label, or collecting note can give an otherwise ordinary specimen scientific meaning.",
    decision:
      "The contributor explicitly marks the location as known, partial, or unknown. Individual context fields remain optional.",
  },
  {
    label: "Specimen details · Physical details",
    title: "Physical details",
    purpose: "Capture dimensions, weight, and condition that give the photographs a useful sense of scale.",
    matters: "Simple measurements can make later comparison and human identification more reliable.",
    decision:
      "Measurements are encouraged rather than required. Contributors distinguish measured values, estimates, and details not yet recorded.",
  },
  {
    label: "Legacy prototype route",
    title: "Previous workspace screen",
    purpose: "Document a superseded contributor-area screen retained in the source for reference.",
    matters: "The active signed-in home is My specimens, not a separate workspace.",
    decision:
      "Do not route the direct single-specimen journey through this screen. Remove it only during a separate verified cleanup.",
  },
  {
    label: "Legacy batch route",
    title: "Annotation queue",
    purpose: "Retain the existing queue used by the older batch-image prototype.",
    matters: "The queue exposes implementation architecture and adds unnecessary selection steps for one specimen.",
    decision:
      "New mobile single-specimen drafts resume directly from My specimens. The queue is not part of that journey.",
  },
  {
    label: "Specimen details · Identification",
    title: "Identification and observations",
    purpose:
      "Capture the contributor’s observations, optional suggested identification, confidence, and preference for later human input.",
    matters: "A contributor can document visible evidence even when the specimen’s exact identity is unknown.",
    decision:
      "A suggested identification remains the contributor’s own statement. It does not create a verified determination.",
  },
  {
    label: "Account · Preferences",
    title: "Guidance preferences",
    purpose: "Let experienced contributors reduce optional workflow and image guidance from their account menu.",
    matters: "Guidance should support beginners without slowing down people documenting many specimens.",
    decision:
      "Preferences are available through the persistent account control. Opening Preferences preserves the exact current flow screen and active draft; Done returns to that screen.",
  },
  {
    label: "Specimen details · Privacy",
    title: "Privacy and sharing",
    purpose:
      "Record whether the contributor intends to keep the specimen private or prepare it for later sharing, while limiting visible location detail.",
    matters:
      "Private documentation and public disclosure are separate decisions. Find locations may be scientifically useful and sensitive.",
    decision:
      "Exact site details remain private. The primary action continues to Review specimen and does not publish or save the specimen yet.",
  },
  {
    label: "Specimen completion",
    title: "Review specimen",
    purpose:
      "Let the contributor check every meaningful section, correct mistakes directly, and save the result as a private specimen.",
    matters:
      "Review separates a completed private specimen from an unfinished draft and makes the privacy boundary explicit before save.",
    decision:
      "Each section links back to its existing editor and then returns to Review. Saving requires at least one image, creates a private specimen in local state, and never publishes anything.",
  },
  {
    label: "Review and save · Reserved next slice",
    title: "Review specimen",
    purpose:
      "Reserve the next route for reviewing completed private-draft information before saving a private specimen.",
    matters:
      "Review and saving must be separate from future publication. The contributor needs a precise place to correct information before the entry is treated as complete.",
    decision:
      "Step 16 is reserved for the Review specimen implementation so it does not collide with guest-access or account-navigation work.",
  },
  {
    label: "Member activity",
    title: "Updates",
    purpose:
      "Reserve one calm place for meaningful changes to specimens the member owns, follows, or later contributes to.",
    matters:
      "The project should not create an unbounded social feed or notify members about every public change across the platform.",
    decision:
      "Updates is an intentionally empty placeholder in this prototype. Future notifications will be limited to owned, followed, or contributed-to specimens.",
  },
  {
    label: "Prototype entry",
    title: "Guest or member view",
    purpose:
      "Show the different public and member-access boundaries without pretending that authentication is already implemented.",
    matters:
      "A future developer needs to understand that guests can browse public specimens, while private drafts and interaction require a member account.",
    decision:
      "The selector changes only local prototype state. Continuing as Helen is not a real sign-in and creates no account.",
  },
];
