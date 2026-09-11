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
    label: "Record a find · Step 1 of 2",
    title: "Before you begin",
    purpose: "Prepare the contributor for the information and photographs that make a find useful to other people.",
    matters:
      "A short introduction can improve submission quality without turning the recording process into a long scientific form.",
    decision:
      "The platform explains what helps, but does not require contributors to already know what they have found.",
  },
  {
    label: "Record a find · Step 2 of 2",
    title: "Choose a record type",
    purpose: "Establish what the contributor is recording before asking for photographs and contextual information.",
    matters:
      "The same platform should accommodate personal finds, inherited collection material and unidentified objects.",
    decision:
      "The contributor can explicitly choose ‘Something unknown’ instead of being forced to make an identification.",
  },
];
