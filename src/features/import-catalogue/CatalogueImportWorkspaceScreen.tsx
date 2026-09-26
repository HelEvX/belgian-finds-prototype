import { useState, type ChangeEvent, type InputHTMLAttributes } from "react";

import type { CatalogueImportSession } from "./catalogueImportTypes";

import type { CatalogueImportImagePoolAddResult } from "../../services/catalogueImportSessionService";

type DirectoryInputAttributes = InputHTMLAttributes<HTMLInputElement> & {
  directory?: string;
  webkitdirectory?: string;
};

type CatalogueImportWorkspaceScreenProps = {
  session: CatalogueImportSession;
  onBack: () => void;
  onAddImages: (files: File[]) => CatalogueImportImagePoolAddResult;
};

function getImagePoolFeedback(result: CatalogueImportImagePoolAddResult) {
  const messages: string[] = [];

  if (result.addedCount > 0) {
    messages.push(
      `Added ${result.addedCount} image${result.addedCount === 1 ? "" : "s"} to the collection image pool.`,
    );
  }

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

  return messages.length > 0
    ? messages.join(" ")
    : "No supported image files were added. Choose image files or a folder containing images.";
}

export function CatalogueImportWorkspaceScreen({ session, onBack, onAddImages }: CatalogueImportWorkspaceScreenProps) {
  const [imageFeedback, setImageFeedback] = useState<string | null>(null);

  const awaitingImagesCount = session.records.filter((record) => record.status === "awaiting-images").length;

  const recordsWithCsvNotesCount = session.records.filter((record) => record.validationWarnings.length > 0).length;

  const readyToFinaliseCount = session.records.filter((record) => record.status === "ready-to-finalise").length;

  const unassignedImageCount = session.images.filter((image) => image.assignedRecordId === null).length;

  const assignedImageCount = session.images.length - unassignedImageCount;

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);

    event.currentTarget.value = "";

    if (files.length === 0) {
      return;
    }

    const result = onAddImages(files);

    setImageFeedback(getImagePoolFeedback(result));
  };

  const folderInputAttributes: DirectoryInputAttributes = {
    className: "visually-hidden",
    id: "catalogue-image-folder",
    type: "file",
    accept: "image/*",
    multiple: true,
    directory: "",
    webkitdirectory: "",
  };

  return (
    <>
      <header className="desktop-page-header desktop-page-header-actions">
        <div>
          <p className="eyebrow">Private desktop import session</p>

          <h1>{session.collectionName}</h1>

          <p>
            Imported catalogue records remain in this workspace while images are matched and any remaining information
            is checked.
          </p>
        </div>

        <button className="outline-button" type="button" onClick={onBack}>
          Back to My specimens
        </button>
      </header>

      <section className="catalogue-review-summary">
        <div>
          <span>Catalogue records</span>

          <strong>{session.records.length}</strong>
        </div>

        <div>
          <span>Awaiting image matching</span>

          <strong>{awaitingImagesCount}</strong>
        </div>

        <div>
          <span>Records with CSV notes</span>

          <strong>{recordsWithCsvNotesCount}</strong>
        </div>

        <div>
          <span>Ready to finalise</span>

          <strong>{readyToFinaliseCount}</strong>
        </div>
      </section>

      <section className="catalogue-image-pool-panel">
        <div className="catalogue-image-pool-heading">
          <div>
            <p className="card-kicker">{session.images.length > 0 ? "Image pool ready" : "Step 1 of 2"}</p>

            <h2>
              {session.images.length > 0 ? "Collection images ready to match" : "Build the collection image pool"}
            </h2>

            <p>
              Select every image that may belong to this collection. Images stay private in this import session until
              you match them to catalogue records.
            </p>
          </div>

          <span className="catalogue-private-badge">Private image pool</span>
        </div>

        <div className="catalogue-image-pool-stats">
          <div>
            <span>Images in pool</span>

            <strong>{session.images.length}</strong>
          </div>

          <div>
            <span>Available to assign</span>

            <strong>{unassignedImageCount}</strong>
          </div>

          <div>
            <span>Already assigned</span>

            <strong>{assignedImageCount}</strong>
          </div>
        </div>

        <div className="catalogue-image-pool-actions">
          <div>
            <strong>Select all collection images at once</strong>

            <span>
              Choose multiple files now, or choose a folder in a browser that supports folder selection. You can add
              more images later; duplicate files are skipped.
            </span>
          </div>

          <div className="catalogue-image-pool-buttons">
            <input
              className="visually-hidden"
              id="catalogue-image-files"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelection}
            />

            <label className="primary-button catalogue-file-button" htmlFor="catalogue-image-files">
              Choose image files
            </label>

            <input {...folderInputAttributes} onChange={handleImageSelection} />

            <label className="secondary-button catalogue-file-button" htmlFor="catalogue-image-folder">
              Choose a folder
            </label>
          </div>
        </div>

        {imageFeedback && (
          <div className="catalogue-image-pool-feedback" role="status">
            {imageFeedback}
          </div>
        )}

        {session.images.length > 0 && (
          <div className="catalogue-image-preview-section">
            <div className="catalogue-image-preview-heading">
              <div>
                <h3>Image pool preview</h3>

                <p>
                  Showing the first {Math.min(session.images.length, 8)} of {session.images.length} available image
                  {session.images.length === 1 ? "" : "s"}.
                </p>
              </div>

              <span>{unassignedImageCount} unassigned</span>
            </div>

            <div className="catalogue-image-preview-grid">
              {session.images.slice(0, 8).map((image) => (
                <figure className="catalogue-image-preview" key={image.id}>
                  <img src={image.previewUrl} alt={`Preview of ${image.filename}`} />

                  <figcaption title={image.filename}>{image.filename}</figcaption>
                </figure>
              ))}
            </div>

            <p className="catalogue-image-pool-next-step">
              Next, the matching workspace will present one catalogue record at a time and prevent an image from being
              selected for more than one record.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
