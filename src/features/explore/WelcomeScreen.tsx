import { useState } from "react";
import { getSpecimenDisplayTitle } from "../record-find/getSpecimenDisplayTitle";
import {
  getSpecimenWorkspaceContext,
  isCatalogueImportAwaitingImages,
} from "../record-find/getSpecimenWorkspaceMetadata";
import type { SpecimenDraft, SpecimenDraftStep } from "../record-find/types";

type WelcomeScreenProps = {
  drafts: SpecimenDraft[];
  onResumeSpecimen: (draftId: string) => void;
  onAddSpecimen: () => void;
};

type SpecimenFilter = "needs-images" | "needs-information" | "ready-for-review" | "private-specimens";

type SpecimenGroupProps = {
  title: string;
  drafts: SpecimenDraft[];
  emptyMessage: string;
  onOpenSpecimen: (draftId: string) => void;
};

type SpecimenFilterOption = {
  id: SpecimenFilter;
  label: string;
  count: number;
};

const resumeStepLabels: Record<SpecimenDraftStep, string> = {
  images: "Adding images",
  type: "Choosing specimen type",
  provenance: "Adding provenance",
  "find-location": "Adding find location",
  "physical-details": "Adding physical details",
  "identification-observations": "Adding identification and observations",
  privacy: "Choosing privacy and sharing",
};

function getProgressLabel(draft: SpecimenDraft) {
  if (draft.status === "private-specimen") {
    return "Saved privately";
  }

  if (draft.status === "ready-for-review") {
    return "Review before saving privately";
  }

  if (isCatalogueImportAwaitingImages(draft)) {
    return "Attach at least one image";
  }

  return resumeStepLabels[draft.resumeStep];
}

function getDefaultFilter(
  needsImages: SpecimenDraft[],
  needsInformation: SpecimenDraft[],
  readyForReview: SpecimenDraft[],
  privateSpecimens: SpecimenDraft[],
): SpecimenFilter {
  if (needsImages.length > 0) {
    return "needs-images";
  }

  if (needsInformation.length > 0) {
    return "needs-information";
  }

  if (readyForReview.length > 0) {
    return "ready-for-review";
  }

  if (privateSpecimens.length > 0) {
    return "private-specimens";
  }

  return "needs-images";
}

function getFilterTitle(filter: SpecimenFilter) {
  switch (filter) {
    case "needs-images":
      return "Records needing images";

    case "needs-information":
      return "Records needing information";

    case "ready-for-review":
      return "Records ready for review";

    case "private-specimens":
      return "Private specimens";
  }
}

function getEmptyFilterMessage(filter: SpecimenFilter) {
  switch (filter) {
    case "needs-images":
      return "No imported catalogue records currently need images.";

    case "needs-information":
      return "No specimens currently need extra information.";

    case "ready-for-review":
      return "No specimens are ready for review yet.";

    case "private-specimens":
      return "No private specimens have been saved yet.";
  }
}

function SpecimenGroup({ title, drafts, emptyMessage, onOpenSpecimen }: SpecimenGroupProps) {
  return (
    <section className="mobile-section member-specimen-group">
      <div className="section-heading">
        <h3>{title}</h3>
      </div>

      {drafts.length === 0 ? (
        <div className="member-empty-filter">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="member-draft-list">
          {drafts.map((draft) => {
            const firstImage = draft.images[0];

            const title = getSpecimenDisplayTitle(draft);

            const context = getSpecimenWorkspaceContext(draft);

            const isPrivateSpecimen = draft.status === "private-specimen";

            return (
              <button
                className={`member-draft-card ${isPrivateSpecimen ? "member-draft-card-private" : ""}`}
                type="button"
                key={draft.id}
                aria-label={`Open ${title}`}
                onClick={() => onOpenSpecimen(draft.id)}>
                {firstImage ? (
                  <img className="member-draft-thumbnail" src={firstImage.previewUrl} alt="" />
                ) : (
                  <span className="member-draft-thumbnail member-draft-thumbnail-empty" aria-hidden="true">
                    No image
                  </span>
                )}

                <span className="member-draft-copy">
                  <strong>{title}</strong>

                  {context && <span className="member-draft-context">{context}</span>}

                  <small className="member-draft-next-action">
                    {getProgressLabel(draft)}
                    {" · "}
                    {draft.images.length} {draft.images.length === 1 ? "image" : "images"}
                  </small>
                </span>

                <span className="member-draft-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function WelcomeScreen({ drafts, onResumeSpecimen, onAddSpecimen }: WelcomeScreenProps) {
  const hasSpecimens = drafts.length > 0;

  const sortedDrafts = [...drafts].sort((firstDraft, secondDraft) =>
    secondDraft.updatedAt.localeCompare(firstDraft.updatedAt),
  );

  const needsImages = sortedDrafts.filter(isCatalogueImportAwaitingImages);

  const needsInformation = sortedDrafts.filter(
    (draft) =>
      (draft.status === "ready-to-annotate" || draft.status === "annotation-in-progress") &&
      !isCatalogueImportAwaitingImages(draft),
  );

  const readyForReview = sortedDrafts.filter((draft) => draft.status === "ready-for-review");

  const privateSpecimens = sortedDrafts.filter((draft) => draft.status === "private-specimen");

  const [activeFilter, setActiveFilter] = useState<SpecimenFilter>(() =>
    getDefaultFilter(needsImages, needsInformation, readyForReview, privateSpecimens),
  );

  const summaryParts = [
    needsImages.length > 0 ? `${needsImages.length} need images` : null,
    needsInformation.length > 0 ? `${needsInformation.length} need information` : null,
    readyForReview.length > 0 ? `${readyForReview.length} ready for review` : null,
    privateSpecimens.length > 0 ? `${privateSpecimens.length} saved privately` : null,
  ].filter(Boolean);

  const filterOptions: SpecimenFilterOption[] = [
    {
      id: "needs-images",
      label: "Needs images",
      count: needsImages.length,
    },
    {
      id: "needs-information",
      label: "Needs information",
      count: needsInformation.length,
    },
    {
      id: "ready-for-review",
      label: "Ready for review",
      count: readyForReview.length,
    },
    {
      id: "private-specimens",
      label: "Private specimens",
      count: privateSpecimens.length,
    },
  ];

  const visibleDrafts =
    activeFilter === "needs-images"
      ? needsImages
      : activeFilter === "needs-information"
        ? needsInformation
        : activeFilter === "ready-for-review"
          ? readyForReview
          : privateSpecimens;

  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Belgian Fossil Finds</p>

          <h2>My specimens</h2>
        </div>

        {/* <div className="member-identity" aria-label="Signed in as Helen Deleuze">
          <span>Helen</span>

          <span className="member-avatar" aria-hidden="true">
            HD
          </span>
        </div> */}
      </header>

      <section className="member-summary-card">
        <p className="card-kicker">{hasSpecimens ? "Your specimens" : "Your private area"}</p>

        <h3>
          {hasSpecimens ? `${drafts.length} ${drafts.length === 1 ? "specimen" : "specimens"}` : "No specimens yet"}
        </h3>

        <p>
          {hasSpecimens
            ? `${summaryParts.join(" · ")}. Nothing is shared automatically.`
            : "Start with one specimen, its photographs, and whatever context you know. Nothing is shared automatically."}
        </p>
      </section>

      {!hasSpecimens && (
        <div className="mobile-actions">
          <button className="primary-button" type="button" onClick={onAddSpecimen}>
            Add a specimen
          </button>
        </div>
      )}

      {hasSpecimens && (
        <>
          <label className="member-filter-control">
            <span>Show specimens</span>

            <select
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.currentTarget.value as SpecimenFilter)}>
              {filterOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </label>

          <SpecimenGroup
            title={getFilterTitle(activeFilter)}
            drafts={visibleDrafts}
            emptyMessage={getEmptyFilterMessage(activeFilter)}
            onOpenSpecimen={onResumeSpecimen}
          />
        </>
      )}
    </>
  );
}
