import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { BulkImportGroupingStep } from "./BulkImportGroupingStep";
import type { LocalImportImage, SpecimenDraftGroup } from "./bulkImportTypes";

type BulkImportModalProps = {
  onClose: () => void;
};

type ImportStage = "select" | "ready" | "group" | "finished";

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function BulkImportModal({ onClose }: BulkImportModalProps) {
  const [images, setImages] = useState<LocalImportImage[]>([]);
  const [groups, setGroups] = useState<SpecimenDraftGroup[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [stage, setStage] = useState<ImportStage>("select");
  const [draftCount, setDraftCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<LocalImportImage[]>([]);
  const nextGroupIdRef = useRef(1);

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

    /*
     * If the picker was opened from the grouping screen, stay there.
     * Otherwise return to the normal image-selection stage.
     */
    setStage((currentStage) => (currentStage === "group" ? "group" : "select"));

    setDraftCount(0);
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

    /*
     * If the removed image was already grouped, remove it from that
     * group. Remove the group entirely if it becomes empty.
     */
    setGroups((currentGroups) =>
      currentGroups
        .map((group) => ({
          ...group,
          imageIds: group.imageIds.filter((id) => id !== imageId),
        }))
        .filter((group) => group.imageIds.length > 0),
    );

    setSelectedIds((currentIds) => currentIds.filter((id) => id !== imageId));

    setDraftCount(0);
  };

  const clearImages = () => {
    imagesRef.current.forEach((image) => {
      URL.revokeObjectURL(image.previewUrl);
    });

    imagesRef.current = [];
    nextGroupIdRef.current = 1;

    setImages([]);
    setGroups([]);
    setSelectedIds([]);
    setStage("select");
    setDraftCount(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const toggleGroupingImage = (imageId: string) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(imageId) ? currentIds.filter((id) => id !== imageId) : [...currentIds, imageId],
    );
  };

  const createSpecimenDraft = () => {
    if (selectedIds.length === 0) {
      return;
    }

    const groupedImageIds = new Set(groups.flatMap((group) => group.imageIds));

    const validSelectedIds = selectedIds.filter(
      (imageId) => images.some((image) => image.id === imageId) && !groupedImageIds.has(imageId),
    );

    if (validSelectedIds.length === 0) {
      setSelectedIds([]);
      return;
    }

    const newGroup: SpecimenDraftGroup = {
      id: nextGroupIdRef.current,
      imageIds: validSelectedIds,
    };

    nextGroupIdRef.current += 1;

    setGroups((currentGroups) => [...currentGroups, newGroup]);

    setSelectedIds([]);
  };

  const undoGroup = (groupId: number) => {
    setGroups((currentGroups) => currentGroups.filter((group) => group.id !== groupId));

    setDraftCount(0);
  };

  const totalSize = images.reduce((total, image) => total + image.file.size, 0);

  const modalTitle = {
    select: "Choose collection images",
    ready: "Draft workspace ready",
    group: "Group collection images",
    finished: "Specimen drafts prepared",
  }[stage];

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

            <h2 id="bulk-import-title">{modalTitle}</h2>
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

        <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFilesSelected} />

        {stage === "select" && (
          <>
            <p className="bulk-import-description">
              Select photographs for several specimens. You will group related images into specimen drafts in the next
              stage.
            </p>

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
                    <dt>Specimen groups</dt>
                    <dd>{groups.length}</dd>
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
                onClick={() => setStage("ready")}>
                {groups.length > 0 ? "Return to draft workspace" : "Create draft workspace"}
              </button>

              <button className="secondary-button" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}

        {stage === "ready" && (
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
                <dt>Specimen groups</dt>
                <dd>{groups.length}</dd>
              </div>

              <div>
                <dt>Visibility</dt>
                <dd>Private</dd>
              </div>
            </dl>

            <div className="bulk-import-local-note">
              <strong>Nothing has been published</strong>

              <span>
                The next step groups photographs belonging to the same physical specimen. Your existing groups will be
                preserved if you return to image selection.
              </span>
            </div>

            <div className="bulk-import-actions">
              <button className="primary-button" type="button" onClick={() => setStage("group")}>
                {groups.length > 0 ? "Continue grouping images" : "Start grouping images"}
              </button>

              <button className="secondary-button" type="button" onClick={() => setStage("select")}>
                Back to image selection
              </button>
            </div>
          </div>
        )}

        {stage === "group" && (
          <BulkImportGroupingStep
            images={images}
            groups={groups}
            selectedIds={selectedIds}
            onToggleImage={toggleGroupingImage}
            onCreateGroup={createSpecimenDraft}
            onUndoGroup={undoGroup}
            onAddImages={openFilePicker}
            onBack={() => setStage("ready")}
            onFinish={(groupCount) => {
              setDraftCount(groupCount);
              setStage("finished");
            }}
          />
        )}

        {stage === "finished" && (
          <div className="bulk-import-complete">
            <div className="bulk-import-complete-symbol" aria-hidden="true">
              ✓
            </div>

            <h3>{draftCount} specimen drafts prepared</h3>

            <p>Every selected image now belongs to a specimen draft.</p>

            <dl className="bulk-import-summary">
              <div>
                <dt>Images grouped</dt>
                <dd>{images.length}</dd>
              </div>

              <div>
                <dt>Specimen drafts</dt>
                <dd>{draftCount}</dd>
              </div>

              <div>
                <dt>Visibility</dt>
                <dd>Private</dd>
              </div>
            </dl>

            <div className="bulk-import-local-note">
              <strong>Next planned step</strong>

              <span>
                A real import would now apply shared collection metadata and let the contributor review each draft.
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
