import { useMemo } from "react";
import type { LocalImportImage, SpecimenDraftGroup } from "./bulkImportTypes";

type BulkImportGroupingStepProps = {
  images: LocalImportImage[];
  groups: SpecimenDraftGroup[];
  selectedIds: string[];
  onToggleImage: (imageId: string) => void;
  onCreateGroup: () => void;
  onUndoGroup: (groupId: number) => void;
  onAddImages: () => void;
  onBack: () => void;
  onFinish: (groupCount: number) => void;
};

export function BulkImportGroupingStep({
  images,
  groups,
  selectedIds,
  onToggleImage,
  onCreateGroup,
  onUndoGroup,
  onAddImages,
  onBack,
  onFinish,
}: BulkImportGroupingStepProps) {
  const groupedImageIds = useMemo(() => new Set(groups.flatMap((group) => group.imageIds)), [groups]);

  const unassignedImages = images.filter((image) => !groupedImageIds.has(image.id));

  const getGroupImages = (group: SpecimenDraftGroup) =>
    group.imageIds
      .map((imageId) => images.find((image) => image.id === imageId))
      .filter((image): image is LocalImportImage => image !== undefined);

  const allImagesGrouped = images.length > 0 && unassignedImages.length === 0;

  return (
    <div className="bulk-grouping-step">
      <header className="bulk-grouping-heading">
        <div>
          <p className="mobile-eyebrow">Group collection images</p>

          <h3>Create specimen drafts</h3>
        </div>

        <span className="bulk-grouping-count">{unassignedImages.length} unassigned</span>
      </header>

      <p className="bulk-grouping-description">
        Select all photographs that show the same specimen, then create one draft. Repeat until every image has been
        grouped.
      </p>

      <button className="secondary-button bulk-grouping-add-images" type="button" onClick={onAddImages}>
        Add missing images
      </button>

      {unassignedImages.length > 0 ? (
        <>
          <div className="bulk-grouping-grid">
            {unassignedImages.map((image) => {
              const isSelected = selectedIds.includes(image.id);

              return (
                <button
                  key={image.id}
                  className={`bulk-grouping-image ${isSelected ? "bulk-grouping-image-selected" : ""}`}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggleImage(image.id)}>
                  <img src={image.previewUrl} alt="" loading="lazy" />

                  <span className="bulk-grouping-selection">{isSelected ? "✓" : ""}</span>

                  <span className="bulk-grouping-filename" title={image.file.name}>
                    {image.file.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className={`bulk-grouping-selection-note ${
              selectedIds.length > 0 ? "bulk-grouping-selection-note-active" : ""
            }`}
            aria-live="polite">
            {selectedIds.length === 0 ? (
              <span>Select one or more images of the same specimen.</span>
            ) : (
              <>
                <strong>
                  {selectedIds.length} {selectedIds.length === 1 ? "image selected" : "images selected"}
                </strong>

                <span>These images will become one specimen draft.</span>
              </>
            )}
          </div>

          <button
            className="primary-button bulk-grouping-create"
            type="button"
            disabled={selectedIds.length === 0}
            onClick={onCreateGroup}>
            Create specimen draft
          </button>
        </>
      ) : (
        <div className="bulk-grouping-all-assigned">
          <span aria-hidden="true">✓</span>

          <div>
            <strong>Every image has been grouped</strong>

            <p>Review the specimen drafts below, or add any photographs you have missed.</p>
          </div>
        </div>
      )}

      {groups.length > 0 && (
        <section className="bulk-draft-list">
          <div className="bulk-draft-list-heading">
            <h4>Specimen drafts</h4>

            <span>
              {groups.length} {groups.length === 1 ? "draft" : "drafts"}
            </span>
          </div>

          {groups.map((group, index) => {
            const groupImages = getGroupImages(group);

            return (
              <article className="bulk-draft-card" key={group.id}>
                <div className="bulk-draft-card-header">
                  <div>
                    <span>Draft specimen</span>
                    <strong>{index + 1}</strong>
                  </div>

                  <button type="button" onClick={() => onUndoGroup(group.id)}>
                    Undo group
                  </button>
                </div>

                <div className="bulk-draft-thumbnails">
                  {groupImages.slice(0, 4).map((image) => (
                    <img key={image.id} src={image.previewUrl} alt="" />
                  ))}

                  {groupImages.length > 4 && <span>+{groupImages.length - 4}</span>}
                </div>

                <p>
                  {groupImages.length} {groupImages.length === 1 ? "image" : "images"}
                </p>
              </article>
            );
          })}
        </section>
      )}

      <div className="bulk-import-actions">
        <button
          className="primary-button"
          type="button"
          disabled={!allImagesGrouped}
          onClick={() => onFinish(groups.length)}>
          Finish grouping
        </button>

        <button className="secondary-button" type="button" onClick={onBack}>
          Back to batch summary
        </button>
      </div>
    </div>
  );
}
