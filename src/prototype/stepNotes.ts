import type { StepNote } from "./types";

export const stepNotes: StepNote[] = [
  {
    label: "Explore journey · Step 1 of 3",
    title: "Welcome",
    purpose:
      "Introduce the platform as a place to explore Belgian-connected fossil finds and connect with other people.",
    matters: "A visitor should understand the purpose before being asked to register or contribute.",
    decision: "Browsing remains available to visitors. Registration is not required just to look around.",
  },
  {
    label: "Explore journey · Step 2 of 3",
    title: "Browse finds",
    purpose: "Give visitors a simple way to explore records from the wider Belgian fossil community.",
    matters: "The public catalogue is the entry point for people who are curious but are not ready to submit a find.",
    decision: "The first filters are intentionally broad: location, identification status and type of material.",
  },
  {
    label: "Explore journey · Step 3 of 3",
    title: "Find detail",
    purpose: "Show one record in enough detail for another person to understand it and offer useful input.",
    matters:
      "The detail page must distinguish the collector’s original statement from later community or specialist responses.",
    decision: "A help request is attached to a specific find rather than handled through a general contact form.",
  },
  {
    label: "Contribute · Add material",
    title: "Start with images",
    purpose:
      "Set the platform’s contribution scope and let a contributor choose between adding images for one specimen or importing a batch of existing images.",
    matters:
      "Image intake and later specimen documentation are separate concerns. The contributor should not need to decide a taxonomic type or a collection structure before images are associated with a specimen.",
    decision:
      "The eligibility boundary applies to both intake routes: Belgian field finds and documented amateur collection material are welcome; commercial souvenirs, stock and valuation requests are outside scope.",
  },
  {
    label: "Single find · Introduction",
    title: "Before you begin",
    purpose: "Briefly prepare the contributor for the information that will make their record useful to other people.",
    matters: "Contributors should feel welcome even when they do not know what they have found.",
    decision:
      "Detailed instructions are shown progressively while the user creates the record, rather than presented all at once.",
  },
  {
    label: "Single find · About the item",
    title: "Choose a record type",
    purpose: "Establish what the contributor is recording before asking for photographs and contextual information.",
    matters:
      "The same platform should accommodate personal finds, inherited collection material and unidentified objects.",
    decision:
      "The contributor can explicitly choose ‘Something unknown’ instead of being forced to make an identification.",
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
    label: "Single find · Photographs",
    title: "Add photographs",
    purpose: "Let a contributor add new camera images, existing files or a combination of both to one find record.",
    matters: "New finds benefit from guided photography, while existing and inherited collections must remain welcome.",
    decision:
      "One photograph is sufficient to continue, three useful views are recommended, and five is the prototype maximum.",
  },
  {
    label: "Single find · Provenance",
    title: "Who originally found it?",
    purpose:
      "Record the original field collector or collection history separately from the current owner or custodian.",
    matters:
      "A specimen’s locality and collecting history often contribute more scientific meaning than its appearance alone.",
    decision:
      "The flow does not offer a generic purchase route. Uncertainty remains available for inherited or older collections whose documentation is incomplete.",
  },
  {
    label: "Single find · Location and context",
    title: "Where was it found?",
    purpose: "Record the best available Belgian find location and any surviving geological or collecting context.",
    matters:
      "Locality, geological layer and collecting documentation can give an otherwise ordinary specimen scientific meaning.",
    decision:
      "The wording adapts to the selected provenance. Individual fields remain optional, but the contributor explicitly marks the location as known, partial or unknown.",
  },
  {
    label: "Single find · Physical details",
    title: "Measure the specimen",
    purpose: "Capture the physical dimensions, weight and condition that give photographs a useful sense of scale.",
    matters:
      "Even simple measurements can make comparison and later determination more reliable, especially when the specimen is incomplete or photographed without a scale.",
    decision:
      "Measurements are encouraged rather than required. Contributors explicitly distinguish measured dimensions, estimates and information that is not yet available.",
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
];
