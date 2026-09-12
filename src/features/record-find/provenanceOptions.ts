import type { ProvenanceOption } from "./types";

export const provenanceOptions: ProvenanceOption[] = [
  {
    id: "self-found",
    symbol: "⌖",
    title: "I found it",
    description: "I collected this specimen in the field.",
  },
  {
    id: "known-collector",
    symbol: "◎",
    title: "Someone I know found it",
    description: "A family member, friend or association member collected it.",
  },
  {
    id: "inherited",
    symbol: "◇",
    title: "It comes from an inherited collection",
    description: "I am documenting a collection created by someone else.",
  },
  {
    id: "documented-collection",
    symbol: "▤",
    title: "It comes from an older documented collection",
    description: "It has a label, catalogue number or notes, even if I do not know the collector personally.",
  },
  {
    id: "uncertain",
    symbol: "?",
    title: "I am not sure",
    description: "The original collector or history is incomplete, but some context may still be recoverable.",
  },
];
