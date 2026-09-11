import { useEffect, useRef, useState, type ChangeEvent } from "react";

type BulkImportModalProps = {
  onClose: () => void;
};

type LocalImportImage = {
  id: string;
  file: File;
  previewUrl: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function BulkImportModal({ onClose }: BulkImportModalProps) {
  const [images, setImages] = useState<LocalImportImage[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<LocalImportImage[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, []);

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.currentTarget.files ?? []).filter((file) => file.type.startsWith("image/"));

    setImages((currentImages) => {
      const existingIds = new Set(currentImages.map((image) => image.id));

      const newImages = selectedFiles
        .map((file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          previewUrl: URL.createObjectURL(file),
        }))
        .filter((image) => {
          if (existingIds.has(image.id)) {
            URL.revokeObjectURL(image.previewUrl);
            return false;
          }

          existingIds.add(image.id);
          return true;
        });

      const nextImages = [...currentImages, ...newImages];

      imagesRef.current = nextImages;

      return nextImages;
    });

    setIsComplete(false);

    /*
     * Reset the input so the same file can be selected again after
     * being removed.
     */
    event.currentTarget.value = "";
  };

  const removeImage = (imageId: string) => {
    setImages((currentImages) => {
      const imageToRemove = currentImages.find((image) => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      const remainingImages = currentImages.filter((image) => image.id !== imageId);

      imagesRef.current = remainingImages;

      return remainingImages;
    });

    setIsComplete(false);
  };

  const clearImages = () => {
    imagesRef.current.forEach((image) => {
      URL.revokeObjectURL(image.previewUrl);
    });

    imagesRef.current = [];
    setImages([]);
    setIsComplete(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const createDraftWorkspace = () => {
    if (images.length === 0) {
      return;
    }

    setIsComplete(true);
  };

  const totalSize = images.reduce((total, image) => total + image.file.size, 0);

  return (
    <div
      className="bulk-import-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
      <section className="bulk-import-modal" role="dialog" aria-modal="true" aria-labelledby="bulk-import-title">
        <header className="bulk-import-header">
          <div>
            <p className="mobile-eyebrow">Collection import</p>

            <h2 id="bulk-import-title">{isComplete ? "Draft workspace ready" : "Choose collection images"}</h2>
          </div>

          <button
            className="bulk-import-close"
            type="button"
            aria-label="Close bulk import"
            onClick={onClose}
            autoFocus>
            ×
          </button>
        </header>

        {!isComplete ? (
          <>
            <p className="bulk-import-description">
              Select photographs for several specimens. You will group related images into specimen drafts in the next
              stage of the import workflow.
            </p>

            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFilesSelected} />

            <button
              className={
                images.length === 0 ? "primary-button bulk-import-picker" : "secondary-button bulk-import-picker"
              }
              type="button"
              onClick={openFilePicker}>
              {images.length === 0 ? "Choose multiple images" : "Add more images"}
            </button>

            {images.length === 0 ? (
              <div className="bulk-import-empty">
                <span aria-hidden="true">▦</span>

                <strong>No images selected yet</strong>

                <p>On desktop, the file picker can select several existing photographs at once.</p>
              </div>
            ) : (
              <>
                <div className="bulk-import-toolbar" aria-live="polite">
                  <strong>
                    {images.length} {images.length === 1 ? "image" : "images"}
                  </strong>

                  <button className="bulk-import-clear" type="button" onClick={clearImages}>
                    Clear all
                  </button>
                </div>

                <div className="bulk-import-grid">
                  {images.map((image) => (
                    <article className="bulk-import-image" key={image.id}>
                      <div className="bulk-import-preview">
                        <img src={image.previewUrl} alt="" loading="lazy" />

                        <button
                          className="bulk-import-remove"
                          type="button"
                          aria-label={`Remove ${image.file.name}`}
                          onClick={() => removeImage(image.id)}>
                          ×
                        </button>
                      </div>

                      <div className="bulk-import-file-copy">
                        <strong title={image.file.name}>{image.file.name}</strong>

                        <span>{formatFileSize(image.file.size)}</span>
                      </div>
                    </article>
                  ))}
                </div>

                <dl className="bulk-import-summary">
                  <div>
                    <dt>Selected</dt>
                    <dd>{images.length} images</dd>
                  </div>

                  <div>
                    <dt>Total size</dt>
                    <dd>{formatFileSize(totalSize)}</dd>
                  </div>

                  <div>
                    <dt>Published</dt>
                    <dd>Nothing</dd>
                  </div>
                </dl>
              </>
            )}

            <div className="bulk-import-local-note">
              <strong>Local prototype only</strong>

              <span>These images stay in this browser session. They are not uploaded, saved or published.</span>
            </div>

            <div className="bulk-import-actions">
              <button
                className="primary-button"
                type="button"
                disabled={images.length === 0}
                onClick={createDraftWorkspace}>
                Create draft workspace
              </button>

              <button className="secondary-button" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="bulk-import-complete">
            <div className="bulk-import-complete-symbol" aria-hidden="true">
              ✓
            </div>

            <h3>Import batch prepared</h3>

            <p>
              {images.length} {images.length === 1 ? "image is" : "images are"} ready to be grouped into specimen
              drafts.
            </p>

            <dl className="bulk-import-summary">
              <div>
                <dt>Images</dt>
                <dd>{images.length}</dd>
              </div>

              <div>
                <dt>Draft records</dt>
                <dd>Created after grouping</dd>
              </div>

              <div>
                <dt>Visibility</dt>
                <dd>Private</dd>
              </div>
            </dl>

            <div className="bulk-import-local-note">
              <strong>Nothing has been published</strong>

              <span>
                In the real application, this workspace would be saved to the contributor’s account as a private import
                batch.
              </span>
            </div>

            <div className="bulk-import-actions">
              <button className="primary-button" type="button" onClick={onClose}>
                Finish preview
              </button>

              <button className="secondary-button" type="button" onClick={clearImages}>
                Start another batch
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
