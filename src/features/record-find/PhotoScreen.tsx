import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { MAX_FIND_PHOTOS, type FindPhotoSource, type LocalFindPhoto } from "./types";

type PhotoScreenProps = {
  photos: LocalFindPhoto[];
  onAddPhotos: (files: File[], source: FindPhotoSource) => void;
  onRemovePhoto: (photoId: string) => void;
  onBack: () => void;
  onContinue: () => void;
  onSaveForLater: () => void;
  showImageGuidance: boolean;
};

type PhotoFeedback = {
  tone: "success" | "warning";
  message: string;
};

function getPhotoGuidance(photoCount: number) {
  if (photoCount === 0) {
    return {
      title: "Start with the whole object",
      description: "Add a clear photograph showing the complete specimen.",
    };
  }

  if (photoCount === 1) {
    return {
      title: "Good start. Can you add another angle?",
      description: "A side or reverse view may reveal details that are not visible in the first photograph.",
    };
  }

  if (photoCount === 2) {
    return {
      title: "One more view would help",
      description: "If possible, include a ruler or another clear indication of scale.",
    };
  }

  if (photoCount < MAX_FIND_PHOTOS) {
    return {
      title: "You have added the recommended three views",
      description: "You can continue, or add a close-up, label or other useful detail.",
    };
  }

  return {
    title: "Maximum reached",
    description: "You can remove a photograph if you would like to replace it.",
  };
}

export function PhotoScreen({
  photos,
  onAddPhotos,
  onRemovePhoto,
  onBack,
  onContinue,
  onSaveForLater,
  showImageGuidance,
}: PhotoScreenProps) {
  const [feedback, setFeedback] = useState<PhotoFeedback | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const existingInputRef = useRef<HTMLInputElement>(null);

  const guidance = getPhotoGuidance(photos.length);

  const hasReachedMaximum = photos.length >= MAX_FIND_PHOTOS;

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => {
        setFeedback(null);
      },
      feedback.tone === "warning" ? 5000 : 3000,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [feedback]);

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>, source: FindPhotoSource) => {
    const selectedFiles = Array.from(event.currentTarget.files ?? []);

    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));

    const existingSignatures = new Set(
      photos.map((photo) => `${photo.file.name}-${photo.file.size}-${photo.file.lastModified}`),
    );

    const acceptedFiles: File[] = [];
    let duplicateCount = 0;

    for (const file of imageFiles) {
      const signature = `${file.name}-${file.size}-${file.lastModified}`;

      if (existingSignatures.has(signature)) {
        duplicateCount += 1;
        continue;
      }

      existingSignatures.add(signature);
      acceptedFiles.push(file);
    }

    const availableSlots = MAX_FIND_PHOTOS - photos.length;

    const filesToAdd = acceptedFiles.slice(0, availableSlots);

    const maximumSkippedCount = acceptedFiles.length - filesToAdd.length;

    const unsupportedCount = selectedFiles.length - imageFiles.length;

    if (filesToAdd.length > 0) {
      onAddPhotos(filesToAdd, source);
    }

    const feedbackParts: string[] = [];

    if (filesToAdd.length > 0) {
      feedbackParts.push(
        `${filesToAdd.length} ${filesToAdd.length === 1 ? "photograph was" : "photographs were"} added.`,
      );
    }

    if (duplicateCount > 0) {
      feedbackParts.push(`${duplicateCount} ${duplicateCount === 1 ? "duplicate was" : "duplicates were"} skipped.`);
    }

    if (maximumSkippedCount > 0) {
      feedbackParts.push(
        `${maximumSkippedCount} ${
          maximumSkippedCount === 1 ? "image was" : "images were"
        } skipped because one specimen can include up to five photographs.`,
      );
    }

    if (unsupportedCount > 0) {
      feedbackParts.push(
        `${unsupportedCount} unsupported ${unsupportedCount === 1 ? "file was" : "files were"} skipped.`,
      );
    }

    if (feedbackParts.length > 0) {
      setFeedback({
        tone: duplicateCount > 0 || maximumSkippedCount > 0 || unsupportedCount > 0 ? "warning" : "success",
        message: feedbackParts.join(" "),
      });
    }

    event.currentTarget.value = "";
  };

  return (
    <>
      <header className="mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>

        <p className="mobile-eyebrow">Add one specimen</p>
      </header>

      <section className="record-flow">
        <p className="record-progress">Specimen photos</p>

        <div className="record-heading">
          <h2>Add specimen photos</h2>

          <p>
            Add at least one photograph of this specimen. Three useful views are recommended, but they are not required.
          </p>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(event) => handleFilesSelected(event, "camera")}
        />

        <input
          ref={existingInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => handleFilesSelected(event, "existing")}
        />

        <div className="photo-source-actions">
          <button
            className="photo-source-button"
            type="button"
            disabled={hasReachedMaximum}
            onClick={() => cameraInputRef.current?.click()}>
            <span className="photo-source-symbol" aria-hidden="true">
              ◉
            </span>

            <span className="photo-source-copy">
              <strong>Take a photo</strong>

              <span>Use this device’s camera when supported.</span>
            </span>
          </button>

          <button
            className="photo-source-button"
            type="button"
            disabled={hasReachedMaximum}
            onClick={() => existingInputRef.current?.click()}>
            <span className="photo-source-symbol" aria-hidden="true">
              ▧
            </span>

            <span className="photo-source-copy">
              <strong>Choose existing photos</strong>

              <span>Select one or several files from this device.</span>
            </span>
          </button>
        </div>

        {feedback && (
          <div
            className={`photo-feedback photo-feedback-${feedback.tone}`}
            role={feedback.tone === "warning" ? "alert" : "status"}
            aria-live={feedback.tone === "warning" ? "assertive" : "polite"}>
            <span aria-hidden="true">{feedback.tone === "warning" ? "!" : "✓"}</span>

            <p>{feedback.message}</p>
          </div>
        )}

        {showImageGuidance && (
          <div className={`photo-guidance ${photos.length >= 3 ? "photo-guidance-complete" : ""}`} aria-live="polite">
            <div className="photo-guidance-heading">
              <strong>{guidance.title}</strong>

              <span>
                {photos.length} / {MAX_FIND_PHOTOS}
              </span>
            </div>

            <p>{guidance.description}</p>
          </div>
        )}

        {photos.length > 0 && (
          <div className="single-photo-grid">
            {photos.map((photo, index) => (
              <article className="single-photo-card" key={photo.id}>
                <div className="single-photo-preview">
                  <img src={photo.previewUrl} alt="" loading="lazy" />

                  <span className="single-photo-number">{index + 1}</span>

                  <button
                    className="single-photo-remove"
                    type="button"
                    aria-label={`Remove ${photo.file.name}`}
                    onClick={() => {
                      onRemovePhoto(photo.id);

                      setFeedback({
                        tone: "success",
                        message: "Photograph removed. You can select it again if needed.",
                      });
                    }}>
                    ×
                  </button>
                </div>

                <div className="single-photo-copy">
                  <strong title={photo.file.name}>{photo.file.name}</strong>

                  <span>{photo.source === "camera" ? "New camera image" : "Existing image"}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mobile-actions">
          <button className="primary-button" type="button" disabled={photos.length === 0} onClick={onContinue}>
            Continue to specimen type
          </button>

          {photos.length > 0 && (
            <button className="secondary-button" type="button" onClick={onSaveForLater}>
              Save and finish later
            </button>
          )}
        </div>
      </section>
    </>
  );
}
