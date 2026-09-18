import type { StepNote } from "./types";

export const stepNotes: StepNote[] = [
  {
    label: "Signed-in home",
    title: "My specimens",
    purpose:
      "Give a signed-in contributor a calm personal starting point, focused on specimens that still need information or on adding a first specimen.",
    matters:
      "A returning contributor should not land on a generic welcome page, a promotional hero, or an ambiguous route between browsing and managing their own material.",
    decision:
      "The application opens to My specimens for signed-in members. Public exploration remains available as a separate bottom-navigation destination rather than competing with the member’s own work.",
  },
  {
    label: "Public exploration · Step 1 of 2",
    title: "Explore specimens",
    purpose:
      "Let members browse publicly shared specimens connected to Belgium without implying that the platform represents a single national fossil community.",
    matters:
      "Exploration is valuable for learning and later participation, but it should not distract from the signed-in member’s private specimens when the app first opens.",
    decision:
      "Explore is a dedicated navigation destination. The first real implementation should fetch recently shared specimens by publication date, with manual refresh rather than constant polling.",
  },
  {
    label: "Public exploration · Step 2 of 2",
    title: "Specimen detail",
    purpose:
      "Show one shared specimen in enough detail for another member to understand the contributor’s information and, later, decide whether to follow or contribute where input is invited.",
    matters:
      "The detail page must distinguish the contributor’s original statement from later community or specialist responses.",
    decision:
      "A help request belongs to one specimen, not a generic contact form. Future interaction remains owner-controlled and is outside this prototype step.",
  },
  {
    label: "Contribute · Add material",
    title: "Start with images",
    purpose:
      "Set the platform’s contribution scope and let a contributor choose between adding images for one specimen or importing a batch of existing images.",
    matters:
      "Image intake and later specimen documentation are separate concerns. The contributor should not need to decide a taxonomic type or a collection structure before images are associated with a specimen.",
    decision:
      "Belgian field finds and documented amateur collection material are welcome; commercial souvenirs, stock and valuation requests are outside scope.",
  },
  {
    label: "Contribution onboarding",
    title: "Before you add material",
    purpose: "Introduce the project’s contribution scope once, before a member chooses an image-intake route.",
    matters:
      "The platform needs a clear scientific and ethical boundary, but repeating that boundary during every contribution would become intrusive for experienced users.",
    decision:
      "The onboarding screen is shown only on a contributor’s first visit to Add material. Members can review it again manually from Settings.",
  },

  {
    label: "Specimen annotation · Material type",
    title: "What are you recording?",
    purpose: "Establish a broad material type after images have already been associated with one physical specimen.",
    matters:
      "The image-intake route no longer matters at this point. A one-specimen draft and a batch-imported draft should use the same documentation workflow.",
    decision:
      "A contributor can explicitly choose ‘Something unknown’ rather than being forced to identify the specimen before asking for help.",
  },
  {
    label: "Batch import · Image intake",
    title: "Import a batch of images",
    purpose: "Let contributors select many existing images and group those that depict the same physical specimen.",
    matters:
      "Existing and inherited collections may contain many useful photographs, but imported files do not automatically reveal which images belong to the same specimen.",
    decision:
      "A batch is an image-intake method, not a collection. After grouping, each resulting specimen draft will eventually enter the same annotation queue as a one-specimen draft.",
  },
  {
    label: "One specimen · Images",
    title: "Add images for one specimen",
    purpose:
      "Associate one or more new or existing images with a single physical specimen before its detailed documentation begins.",
    matters: "New finds benefit from guided photography, while existing and inherited material must remain welcome.",
    decision:
      "One image is sufficient to create a specimen draft, three useful views are recommended, and five is the prototype maximum.",
  },
  {
    label: "Specimen annotation · Provenance",
    title: "Who originally found it?",
    purpose:
      "Record the original field collector or collection history separately from the current owner or custodian.",
    matters:
      "A specimen’s locality and collecting history often contribute more scientific meaning than its appearance alone.",
    decision:
      "The flow does not offer a generic purchase route. Uncertainty remains available for inherited or older collections whose documentation is incomplete.",
  },
  {
    label: "Specimen annotation · Location and context",
    title: "Where was it found?",
    purpose: "Record the best available Belgian find location and any surviving geological or collecting context.",
    matters:
      "Locality, geological layer and collecting documentation can give an otherwise ordinary specimen scientific meaning.",
    decision:
      "The wording adapts to provenance. Individual fields remain optional, but the contributor explicitly marks the location as known, partial or unknown.",
  },
  {
    label: "Specimen annotation · Physical details",
    title: "Measure the specimen",
    purpose: "Capture dimensions, weight and condition that give the associated images a useful sense of scale.",
    matters: "Even simple measurements can make comparison and later human determination more reliable.",
    decision:
      "Measurements are encouraged rather than required. Contributors distinguish measured dimensions, estimates and information that is not yet available.",
  },
  {
    label: "Contributor area · My workspace",
    title: "My workspace",
    purpose:
      "Give returning contributors one clear home for specimen drafts, the future annotation queue and saved records.",
    matters:
      "The platform must support gradual documentation. A contributor may add images now and complete contextual information later.",
    decision:
      "The workspace is mocked locally in this phase. It establishes the correct product structure before accounts, persistent drafts or a database are introduced.",
  },
  {
    label: "Contributor area · Annotation queue",
    title: "Specimen drafts ready to document",
    purpose:
      "Hold image-associated specimen drafts until the contributor is ready to document each individual specimen.",
    matters:
      "A specimen created from one image sequence and a specimen created through batch grouping need the same annotation workflow once their images are correctly associated.",
    decision:
      "Selecting a draft opens the shared type, provenance, locality and physical-details sequence. Draft data remains in local browser state for this prototype.",
  },
  {
    label: "Specimen annotation · Description",
    title: "Observations and help preference",
    purpose:
      "Capture the contributor’s own observations, an optional suggested identification and an optional preference for human input.",
    matters:
      "A contributor who knows a specimen can record a useful scientific name, while an uncertain contributor can still document observable evidence and ask for help.",
    decision:
      "Suggested identifications remain free text and are explicitly separated from later community suggestions or verified determinations. A large taxonomic index or autocomplete service is outside this MVP.",
  },
  {
    label: "Contributor area · Settings",
    title: "Guidance preferences",
    purpose:
      "Let experienced contributors reduce optional workflow and image guidance without removing important labels, validation or record status.",
    matters:
      "Collectors may document dozens or hundreds of specimens. Guidance should help beginners without slowing down repeat contributors.",
    decision:
      "Guidance preferences are stored locally in this prototype. A production version would attach them to the member account.",
  },
  {
    label: "Specimen annotation · Privacy and sharing",
    title: "Choose record and locality visibility",
    purpose:
      "Let the contributor keep a record private or prepare it for later community sharing, while controlling the maximum locality detail visible to other members.",
    matters:
      "Find locations may be scientifically valuable but can also be sensitive. Private documentation and public disclosure need to be separate decisions.",
    decision:
      "Exact site details always remain private in the MVP. Community sharing is only a preference at this stage; a later review screen will be required before publication.",
  },
];
