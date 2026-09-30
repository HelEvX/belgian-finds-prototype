import { useMemo, useState } from "react";

import type { CatalogueImportImage, CatalogueImportRecord, CatalogueImportSession } from "./catalogueImportTypes";

const MATCHING_GUIDE_STORAGE_KEY = "belgian-finds.has-seen-catalogue-image-matching-guide";

type CatalogueImageMatchingScreenProps = {
  session: CatalogueImportSession;
  showWorkflowGuidance: boolean;
  onBack: () => void;
  onFinishMatching: () => void;
  onSetRecordImageAssignments: (recordId: string, imageIds: string[]) => void;
  onMarkRecordSkipped: (recordId: string) => void;
};

type RecordImageMatcherProps = {
  record: CatalogueImportRecord;
  images: CatalogueImportImage[];
  recordById: Map<string, CatalogueImportRecord>;
  isFirstRecord: boolean;
  isLastRecord: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFinishMatching: () => void;
  onSetRecordImageAssignments: (recordId: string, imageIds: string[]) => void;
  onSkipAndContinue: (recordId: string) => void;
};

function hasSeenMatchingGuide() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(MATCHING_GUIDE_STORAGE_KEY) === "true";
}

function formatImageCount(count: number) {
  return `${count} image${count === 1 ? "" : "s"}`;
}

function getRecordDisplayTitle(record: CatalogueImportRecord) {
  return record.specimenData.identification.trim() || "Identification not provided";
}

function getRecordContext(record: CatalogueImportRecord) {
  return [
    record.specimenData.anatomicalElement,
    record.specimenData.formation || record.specimenData.member,
    record.specimenData.geologicalAge,
  ]
    .filter(Boolean)
    .join(" · ");
}

function sameImageIds(first: string[], second: string[]) {
  if (first.length !== second.length) {
    return false;
  }

  const secondIdSet = new Set(second);

  return first.every((imageId) => secondIdSet.has(imageId));
}

function getImageStateLabel(
  isSelected: boolean,
  isMarkedForRemoval: boolean,
  owner: CatalogueImportRecord | undefined,
) {
  if (owner) {
    return `Assigned to ${owner.catalogueNumber}`;
  }

  if (isMarkedForRemoval) {
    return "Will be removed when saved";
  }

  if (isSelected) {
    return "Selected for this record";
  }

  return "Available";
}

function RecordImageMatcher({
  record,
  images,
  recordById,
  isFirstRecord,
  isLastRecord,
  onPrevious,
  onNext,
  onFinishMatching,
  onSetRecordImageAssignments,
  onSkipAndContinue,
}: RecordImageMatcherProps) {
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(record.assignedImageIds);

  const selectedImageIdSet = useMemo(() => new Set(selectedImageIds), [selectedImageIds]);

  const hasUnsavedChanges = !sameImageIds(selectedImageIds, record.assignedImageIds);

  const hasExistingAssignments = record.assignedImageIds.length > 0;

  const isReviewingSavedAssignment = hasExistingAssignments && !hasUnsavedChanges;

  const canSkip =
    !hasExistingAssignments && selectedImageIds.length === 0 && !hasUnsavedChanges && record.status !== "skipped";

  const toggleImage = (image: CatalogueImportImage) => {
    const isAssignedToAnotherRecord = image.assignedRecordId !== null && image.assignedRecordId !== record.id;

    if (isAssignedToAnotherRecord) {
      return;
    }

    setSelectedImageIds((currentImageIds) =>
      currentImageIds.includes(image.id)
        ? currentImageIds.filter((imageId) => imageId !== image.id)
        : [...currentImageIds, image.id],
    );
  };

  const continueToNextRecord = () => {
    if (isReviewingSavedAssignment) {
      if (isLastRecord) {
        onFinishMatching();
        return;
      }

      onNext();
      return;
    }

    if (selectedImageIds.length === 0) {
      return;
    }

    onSetRecordImageAssignments(record.id, selectedImageIds);

    if (isLastRecord) {
      onFinishMatching();
      return;
    }

    onNext();
  };

  const removeCurrentAssignments = () => {
    onSetRecordImageAssignments(record.id, []);
    setSelectedImageIds([]);
  };

  const continueLabel = isReviewingSavedAssignment
    ? isLastRecord
      ? "Finish matching"
      : "Next record"
    : selectedImageIds.length === 1
      ? isLastRecord
        ? "Assign 1 image and finish"
        : "Assign 1 image and next record"
      : isLastRecord
        ? `Assign ${selectedImageIds.length} images and finish`
        : `Assign ${selectedImageIds.length} images and next record`;

  return (
    <div className="catalogue-matching-layout">
      <div className="catalogue-matching-sidebar">
        <aside className="catalogue-matching-record-panel">
          <p className="catalogue-matching-record-number">{record.catalogueNumber}</p>

          <h1>{getRecordDisplayTitle(record)}</h1>

          {getRecordContext(record) && <p className="catalogue-matching-record-context">{getRecordContext(record)}</p>}

          {record.expectedImageCount !== null && (
            <p className="catalogue-matching-record-expected">
              Expected: {formatImageCount(record.expectedImageCount)}
            </p>
          )}
        </aside>

        <aside className="catalogue-matching-action-panel" aria-label="Catalogue record actions">
          <button
            className="primary-button"
            type="button"
            disabled={!isReviewingSavedAssignment && selectedImageIds.length === 0}
            onClick={continueToNextRecord}>
            {continueLabel}
          </button>

          <button
            className="secondary-button"
            type="button"
            disabled={!canSkip}
            onClick={() => onSkipAndContinue(record.id)}>
            Skip for now
          </button>

          {hasExistingAssignments && selectedImageIds.length === 0 && (
            <button
              className="text-button catalogue-matching-remove-button"
              type="button"
              onClick={removeCurrentAssignments}>
              Remove current image assignment
            </button>
          )}

          <div className="catalogue-matching-action-divider" />

          <button
            className="outline-button"
            type="button"
            disabled={isFirstRecord || hasUnsavedChanges}
            onClick={onPrevious}>
            Previous record
          </button>
        </aside>
      </div>

      <section className="catalogue-matching-selection-panel" aria-label="Collection images">
        <div className="catalogue-matching-image-grid">
          {images.map((image) => {
            const assignedToAnotherRecord = image.assignedRecordId !== null && image.assignedRecordId !== record.id;

            const assignedToCurrentRecord = image.assignedRecordId === record.id;

            const isSelected = selectedImageIdSet.has(image.id);

            const isMarkedForRemoval = assignedToCurrentRecord && !isSelected;

            const owner = assignedToAnotherRecord
              ? (recordById.get(image.assignedRecordId ?? "") ?? undefined)
              : undefined;

            const stateLabel = getImageStateLabel(isSelected, isMarkedForRemoval, owner);

            return (
              <button
                className={`catalogue-matching-image ${
                  isSelected ? "catalogue-matching-image-selected" : ""
                } ${assignedToCurrentRecord ? "catalogue-matching-image-assigned-current" : ""} ${
                  isMarkedForRemoval ? "catalogue-matching-image-removing" : ""
                } ${assignedToAnotherRecord ? "catalogue-matching-image-unavailable" : ""}`}
                type="button"
                key={image.id}
                disabled={assignedToAnotherRecord}
                aria-pressed={isSelected}
                aria-label={`${image.filename}: ${stateLabel}`}
                title={image.filename}
                onClick={() => toggleImage(image)}>
                <img src={image.previewUrl} alt="" />

                <span className="catalogue-matching-image-copy">
                  <strong>{image.filename}</strong>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MatchingGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="catalogue-dialog-backdrop" role="presentation">
      <section
        className="catalogue-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalogue-matching-guide-title">
        <p className="card-kicker">Image matching</p>

        <h2 id="catalogue-matching-guide-title">Match images to records</h2>

        <ul className="catalogue-dialog-issues">
          <li>Select every image belonging to the current catalogue record.</li>
          <li>Images assigned to another record cannot be selected again.</li>
          <li>Use Previous record to revisit an earlier decision.</li>
        </ul>

        <div className="catalogue-dialog-actions">
          <button className="primary-button" type="button" onClick={onClose}>
            Start matching
          </button>
        </div>
      </section>
    </div>
  );
}

function getFirstUnmatchedRecordIndex(records: CatalogueImportRecord[]) {
  const firstUnmatchedRecordIndex = records.findIndex((record) => record.assignedImageIds.length === 0);

  return firstUnmatchedRecordIndex === -1 ? 0 : firstUnmatchedRecordIndex;
}

export function CatalogueImageMatchingScreen({
  session,
  showWorkflowGuidance,
  onBack,
  onFinishMatching,
  onSetRecordImageAssignments,
  onMarkRecordSkipped,
}: CatalogueImageMatchingScreenProps) {
  const [currentRecordIndex, setCurrentRecordIndex] = useState(() => getFirstUnmatchedRecordIndex(session.records));

  const [isGuideOpen, setIsGuideOpen] = useState(() => showWorkflowGuidance && !hasSeenMatchingGuide());

  const currentRecord = session.records[currentRecordIndex];

  const recordById = useMemo(() => new Map(session.records.map((record) => [record.id, record])), [session.records]);

  const closeGuide = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MATCHING_GUIDE_STORAGE_KEY, "true");
    }

    setIsGuideOpen(false);
  };

  if (!currentRecord) {
    return (
      <section className="catalogue-matching-empty-state">
        <p>No catalogue records are available in this import session.</p>

        <button className="outline-button" type="button" onClick={onBack}>
          Import session
        </button>
      </section>
    );
  }

  const goToPreviousRecord = () => {
    setCurrentRecordIndex((index) => Math.max(0, index - 1));
  };

  const goToNextRecord = () => {
    setCurrentRecordIndex((index) => Math.min(session.records.length - 1, index + 1));
  };

  const skipAndContinue = (recordId: string) => {
    onMarkRecordSkipped(recordId);

    if (currentRecordIndex === session.records.length - 1) {
      onFinishMatching();
      return;
    }

    goToNextRecord();
  };

  return (
    <>
      <header className="catalogue-matching-toolbar">
        <button className="outline-button" type="button" onClick={onBack}>
          Import session
        </button>

        <span>
          {currentRecordIndex + 1} / {session.records.length}
        </span>
      </header>

      <RecordImageMatcher
        key={currentRecord.id}
        record={currentRecord}
        images={session.images}
        recordById={recordById}
        isFirstRecord={currentRecordIndex === 0}
        isLastRecord={currentRecordIndex === session.records.length - 1}
        onPrevious={goToPreviousRecord}
        onNext={goToNextRecord}
        onFinishMatching={onFinishMatching}
        onSetRecordImageAssignments={onSetRecordImageAssignments}
        onSkipAndContinue={skipAndContinue}
      />

      {isGuideOpen && <MatchingGuide onClose={closeGuide} />}
    </>
  );
}
