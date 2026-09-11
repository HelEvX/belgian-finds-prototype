import type { RecordKindOption } from "./types";

export const recordKinds: RecordKindOption[] = [
  {
    id: "fossil",
    symbol: "◉",
    title: "A fossil",
    description: "A fossil you found, acquired or inherited.",
  },
  {
    id: "rock-mineral",
    symbol: "◆",
    title: "A rock or mineral",
    description: "Geological material that may need more context.",
  },
  {
    id: "collection-item",
    symbol: "▣",
    title: "An item from a collection",
    description: "A specimen with an existing label or collection history.",
  },
  {
    id: "unknown",
    symbol: "?",
    title: "Something unknown",
    description: "You are not yet sure what kind of object it is.",
  },
];
