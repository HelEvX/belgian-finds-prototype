import { useMemo, useState } from "react";

import type { CatalogueImportImage, CatalogueImportRecord, CatalogueImportSession } from "./catalogueImportTypes";

type CatalogueImageMatchingScreenProps = {
  session: CatalogueImportSession;
  onBack: () => void;
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
  onReturnToSession: () => void;
  onSetRecordImageAssignments: (recordId: string, imageIds: string[]) => void;
  onSkipAndContinue: (recordId: string) => void;
};

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

function getImageActionLabel(
  isSelected: boolean,
  isMarkedForRemoval: boolean,
  owner: CatalogueImportRecord | undefined,
) {
  if (owner) {
    return `Assigned to ${owner.catalogueNumber}`;
  }

  if (isMarkedForRemoval) {
    return "Will be released when saved";
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
  onReturnToSession,
  onSetRecordImageAssignments,
  onSkipAndContinue,
}: RecordImageMatcherProps) {
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(record.assignedImageIds);

  const selectedImageIdSet = useMemo(() => new Set(selectedImageIds), [selectedImageIds]);

  const hasUnsavedChanges = !sameImageIds(selectedImageIds, record.assignedImageIds);

  const hasExistingAssignments = record.assignedImageIds.length > 0;

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

  const assignImagesAndContinue = () => {
    if (selectedImageIds.length === 0) {
      return;
    }

    onSetRecordImageAssignments(record.id, selectedImageIds);

    if (isLastRecord) {
      onReturnToSession();
      return;
    }

    onNext();
  };

  const removeCurrentAssignments = () => {
    onSetRecordImageAssignments(record.id, []);
    setSelectedImageIds([]);
  };

  const skipForNow = () => {
    onSkipAndContinue(record.id);
  };

  const continueLabel =
    selectedImageIds.length === 1
      ? isLastRecord
        ? "Assign 1 image and return to session"
        : "Assign 1 image and next record"
      : isLastRecord
        ? `Assign ${selectedImageIds.length} images and return to session`
        : `Assign ${selectedImageIds.length} images and next record`;

  return (
    <div className="catalogue-matching-layout">
      <div className="catalogue-matching-sidebar">
        <aside className="catalogue-matching-record-panel">
          <p className="card-kicker">Current catalogue record</p>

          <p className="catalogue-matching-record-number">{record.catalogueNumber}</p>

          <h2>{getRecordDisplayTitle(record)}</h2>

          {getRecordContext(record) && <p className="catalogue-matching-record-context">{getRecordContext(record)}</p>}

          <dl className="catalogue-matching-record-facts">
            <div>
              <dt>Images currently assigned</dt>

              <dd>{record.assignedImageIds.length}</dd>
            </div>

            <div>
              <dt>Expected image count</dt>

              <dd>{record.expectedImageCount ?? "Not specified"}</dd>
            </div>

            <div>
              <dt>CSV source row</dt>

              <dd>{record.sourceRowNumber}</dd>
            </div>

            <div>
              <dt>Matching status</dt>

              <dd>
                {record.status === "images-matched"
                  ? "Images matched"
                  : record.status === "skipped"
                    ? "Skipped for now"
                    : "Needs images"}
              </dd>
            </div>
          </dl>

          {record.expectedImageCount !== null && (
            <p className="catalogue-matching-guidance">
              The expected count is guidance only. You may assign fewer or more images when the collection requires it.
            </p>
          )}
        </aside>

        <aside className="catalogue-matching-action-panel" aria-label="Catalogue record actions">
          <p className="card-kicker">Record actions</p>

          <button
            className="primary-button"
            type="button"
            disabled={selectedImageIds.length === 0}
            onClick={assignImagesAndContinue}>
            {continueLabel}
          </button>

          <button className="secondary-button" type="button" disabled={!canSkip} onClick={skipForNow}>
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

          <button
            className="text-button catalogue-matching-return-button"
            type="button"
            disabled={hasUnsavedChanges}
            onClick={onReturnToSession}>
            Return to import session
          </button>

          {hasUnsavedChanges && (
            <p className="catalogue-matching-unsaved-note">
              Assign the selected images before moving to another record.
            </p>
          )}
        </aside>
      </div>

      <section className="catalogue-matching-selection-panel">
        <div className="catalogue-matching-selection-heading">
          <div>
            <p className="card-kicker">Choose matching images</p>

            <h2>Select every image that depicts this record</h2>

            <p>
              Images allocated to another catalogue record are unavailable. Select all relevant images, then use the
              action panel to assign them and continue.
            </p>
          </div>

          <span className="catalogue-private-badge">{selectedImageIds.length} selected</span>
        </div>

        <div className="catalogue-matching-image-grid">
          {images.map((image) => {
            const assignedToAnotherRecord = image.assignedRecordId !== null && image.assignedRecordId !== record.id;

            const assignedToCurrentRecord = image.assignedRecordId === record.id;

            const isSelected = selectedImageIdSet.has(image.id);

            const isMarkedForRemoval = assignedToCurrentRecord && !isSelected;

            const owner = assignedToAnotherRecord
              ? (recordById.get(image.assignedRecordId ?? "") ?? undefined)
              : undefined;

            const actionLabel = getImageActionLabel(isSelected, isMarkedForRemoval, owner);

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
                aria-label={`${image.filename}: ${actionLabel}`}
                onClick={() => toggleImage(image)}>
                <img src={image.previewUrl} alt="" />

                <span className="catalogue-matching-image-copy">
                  <strong title={image.filename}>{image.filename}</strong>

                  <small>{actionLabel}</small>
                </span>
              </button>
            );
          })}
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
  onBack,
  onSetRecordImageAssignments,
  onMarkRecordSkipped,
}: CatalogueImageMatchingScreenProps) {
  const [currentRecordIndex, setCurrentRecordIndex] = useState(() => getFirstUnmatchedRecordIndex(session.records));

  const currentRecord = session.records[currentRecordIndex];

  const recordById = useMemo(() => new Map(session.records.map((record) => [record.id, record])), [session.records]);

  const matchedRecordCount = session.records.filter((record) => record.assignedImageIds.length > 0).length;

  const skippedRecordCount = session.records.filter((record) => record.status === "skipped").length;

  const unassignedImageCount = session.images.filter((image) => image.assignedRecordId === null).length;

  if (!currentRecord) {
    return (
      <section className="catalogue-review-panel">
        <div className="catalogue-review-heading">
          <div>
            <p className="card-kicker">Image matching</p>

            <h2>No catalogue records are available</h2>
          </div>
        </div>

        <div className="catalogue-matching-empty-state">
          <p>This import session does not contain any catalogue records to match.</p>

          <button className="primary-button" type="button" onClick={onBack}>
            Return to import session
          </button>
        </div>
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
      onBack();
      return;
    }

    goToNextRecord();
  };

  return (
    <>
      <header className="desktop-page-header">
        <p className="eyebrow">Private desktop import session</p>

        <h1>Match collection images</h1>

        <p>
          Match each catalogue record with its photographs. An image can be assigned to one record only, but you can
          revisit and correct every decision before finalising the import.
        </p>
      </header>

      <section className="catalogue-matching-progress" aria-label="Image-matching progress">
        <div>
          <span>Current record</span>

          <strong>
            {currentRecordIndex + 1} of {session.records.length}
          </strong>
        </div>

        <div>
          <span>Records matched</span>

          <strong>{matchedRecordCount}</strong>
        </div>

        <div>
          <span>Skipped for now</span>

          <strong>{skippedRecordCount}</strong>
        </div>

        <div>
          <span>Images still unassigned</span>

          <strong>{unassignedImageCount}</strong>
        </div>
      </section>

      <RecordImageMatcher
        key={currentRecord.id}
        record={currentRecord}
        images={session.images}
        recordById={recordById}
        isFirstRecord={currentRecordIndex === 0}
        isLastRecord={currentRecordIndex === session.records.length - 1}
        onPrevious={goToPreviousRecord}
        onNext={goToNextRecord}
        onReturnToSession={onBack}
        onSetRecordImageAssignments={onSetRecordImageAssignments}
        onSkipAndContinue={skipAndContinue}
      />
    </>
  );
}
