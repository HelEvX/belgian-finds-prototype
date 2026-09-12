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
    label: "Add material · Choose a path",
    title: "How would you like to begin?",
    purpose: "Let contributors choose between documenting one specimen and importing an existing collection.",
    matters:
      "A guided mobile flow is useful for a new find, but forcing an established collector through it hundreds of times would be frustrating.",
    decision:
      "Single-record entry and collection import are separate workflows that can share the same underlying record structure.",
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
    label: "Collection import · Overview",
    title: "Import an existing collection",
    purpose:
      "Show how collectors could add many existing photographs without creating every record through the mobile wizard.",
    matters:
      "Established and inherited collections may already contain hundreds of images, labels and catalogue references.",
    decision:
      "Bulk imports create draft specimen records for review. They do not publish hundreds of records automatically.",
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
];
