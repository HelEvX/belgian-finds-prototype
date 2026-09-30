import { useState, type ChangeEvent, type InputHTMLAttributes } from "react";

import type { CatalogueImportAutoMatchPlan, CatalogueImportSession } from "./catalogueImportTypes";

import type {
  CatalogueImportAutoMatchResult,
  CatalogueImportImagePoolAddResult,
} from "../../services/catalogueImportSessionService";

type DirectoryInputAttributes = InputHTMLAttributes<HTMLInputElement> & {
  directory?: string;
  webkitdirectory?: string;
};

type CatalogueImportWorkspaceScreenProps = {
  session: CatalogueImportSession;
  onBack: () => void;
  onAddImages: (files: File[]) => CatalogueImportImagePoolAddResult;
  onStartMatching: () => void;
  onOpenImportedCollection: () => void;
  onAutoMatch: () => CatalogueImportAutoMatchResult;
};

function getImagePoolAttentionMessage(result: CatalogueImportImagePoolAddResult) {
  const messages: string[] = [];

  if (result.skippedDuplicateCount > 0) {
    messages.push(
      `${result.skippedDuplicateCount} duplicate file${result.skippedDuplicateCount === 1 ? " was" : "s were"} skipped.`,
    );
  }

  if (result.skippedNonImageCount > 0) {
    messages.push(
      `${result.skippedNonImageCount} non-image file${result.skippedNonImageCount === 1 ? " was" : "s were"} ignored.`,
    );
  }

  return messages.length > 0 ? messages.join(" ") : null;
}

type AutoMatchIssuesDialogProps = {
  plan: CatalogueImportAutoMatchPlan;
  onClose: () => void;
  onStartManualMatching: () => void;
};

function AutoMatchIssuesDialog({ plan, onClose, onStartManualMatching }: AutoMatchIssuesDialogProps) {
  return (
    <div
      className="catalogue-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
      <section
        className="catalogue-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalogue-auto-match-dialog-title">
        <p className="card-kicker">Auto-match unavailable</p>

        <h2 id="catalogue-auto-match-dialog-title">This image pool is not ready for auto-match</h2>

        <ul className="catalogue-dialog-issues">
          {plan.issues.map((issue) => (
            <li key={issue.kind}>
              <strong>{issue.title}</strong>

              <span>{issue.detail}</span>
            </li>
          ))}
        </ul>

        <div className="catalogue-dialog-actions">
          <button className="secondary-button" type="button" onClick={onClose}>
            Back to image pool
          </button>

          <button className="primary-button" type="button" onClick={onStartManualMatching}>
            Match manually
          </button>
        </div>
      </section>
    </div>
  );
}

export function CatalogueImportWorkspaceScreen({
  session,
  onBack,
  onAddImages,
  onStartMatching,
  onOpenImportedCollection,
  onAutoMatch,
}: CatalogueImportWorkspaceScreenProps) {
  const [imagePoolAttention, setImagePoolAttention] = useState<string | null>(null);

  const [autoMatchPlan, setAutoMatchPlan] = useState<CatalogueImportAutoMatchPlan | null>(null);

  const hasImages = session.images.length > 0;

  const assignedImageCount = session.images.filter((image) => image.assignedRecordId !== null).length;

  const hasImageAssignments = assignedImageCount > 0;

  const unassignedImageCount = session.images.length - assignedImageCount;

  const recordsWithoutImagesCount = session.records.filter((record) => record.assignedImageIds.length === 0).length;

  const isImageMatchingComplete = hasImageAssignments && unassignedImageCount === 0 && recordsWithoutImagesCount === 0;

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);

    event.currentTarget.value = "";

    if (files.length === 0) {
      return;
    }

    const result = onAddImages(files);

    setImagePoolAttention(getImagePoolAttentionMessage(result));
    setAutoMatchPlan(null);
  };

  const handleAutoMatch = () => {
    const result = onAutoMatch();

    if (result.session) {
      onOpenImportedCollection();
      return;
    }

    setAutoMatchPlan(result.plan);
  };

  const folderInputAttributes: DirectoryInputAttributes = {
    className: "visually-hidden",
    type: "file",
    accept: "image/*",
    multiple: true,
    directory: "",
    webkitdirectory: "",
  };

  const renderImageInputs = (
    prefix: string,
    firstButtonClassName: "primary-button" | "secondary-button" = "secondary-button",
  ) => (
    <>
      <input
        className="visually-hidden"
        id={`${prefix}-catalogue-image-files`}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelection}
      />

      <label className={`${firstButtonClassName} catalogue-file-button`} htmlFor={`${prefix}-catalogue-image-files`}>
        Choose image files
      </label>

      <input {...folderInputAttributes} id={`${prefix}-catalogue-image-folder`} onChange={handleImageSelection} />

      <label className="secondary-button catalogue-file-button" htmlFor={`${prefix}-catalogue-image-folder`}>
        Choose a folder
      </label>
    </>
  );

  return (
    <>
      <header className="desktop-page-header desktop-page-header-actions">
        <div>
          <p className="eyebrow">Private import session</p>

          <h1>{session.collectionName}</h1>

          <p className="catalogue-import-session-meta">
            {session.records.length} records · {session.images.length} images in the pool
          </p>
        </div>

        <button className="outline-button" type="button" onClick={onBack}>
          My specimens
        </button>
      </header>

      <section className="catalogue-image-pool-panel" aria-label="Collection image pool">
        {!hasImages && (
          <div className="catalogue-image-pool-copy">
            <h2>Add collection images</h2>

            <p>
              Choose every image you want to match to this catalogue. The files remain private in this import session.
            </p>

            <div className="catalogue-image-pool-choice-actions">{renderImageInputs("initial", "primary-button")}</div>
          </div>
        )}

        {hasImages && !hasImageAssignments && (
          <div className="catalogue-image-pool-copy">
            <h2>Choose a matching method</h2>

            <p>
              Auto-match follows natural filename order and each CSV row’s image count. Use manual matching when the
              image order is not prepared.
            </p>

            <div className="catalogue-image-pool-choice-actions">
              <button className="primary-button" type="button" onClick={handleAutoMatch}>
                Auto-match in CSV order
              </button>

              <button className="secondary-button" type="button" onClick={onStartMatching}>
                Match manually
              </button>
            </div>
          </div>
        )}

        {hasImages && hasImageAssignments && (
          <div className="catalogue-image-pool-copy">
            <h2>{isImageMatchingComplete ? "Image matching complete" : "Continue image matching"}</h2>

            <p>
              {isImageMatchingComplete
                ? `${assignedImageCount} images are matched to ${session.records.length} catalogue records.`
                : `${assignedImageCount} images are matched. ${recordsWithoutImagesCount} catalogue record${
                    recordsWithoutImagesCount === 1 ? "" : "s"
                  } still need an image assignment.`}
            </p>

            <div className="catalogue-image-pool-choice-actions">
              <button
                className="primary-button"
                type="button"
                onClick={isImageMatchingComplete ? onOpenImportedCollection : onStartMatching}>
                {isImageMatchingComplete ? "Open imported collection" : "Continue matching"}
              </button>
            </div>
          </div>
        )}

        {imagePoolAttention && (
          <div className="catalogue-image-pool-feedback" role="status">
            {imagePoolAttention}
          </div>
        )}
      </section>

      {autoMatchPlan && (
        <AutoMatchIssuesDialog
          plan={autoMatchPlan}
          onClose={() => setAutoMatchPlan(null)}
          onStartManualMatching={() => {
            setAutoMatchPlan(null);
            onStartMatching();
          }}
        />
      )}
    </>
  );
}
