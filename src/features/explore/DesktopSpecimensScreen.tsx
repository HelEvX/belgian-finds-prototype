import { recordKinds } from "../record-find/recordKinds";
import type { SpecimenDraft } from "../record-find/types";

type DesktopSpecimensScreenProps = {
  drafts: SpecimenDraft[];
  onImportCatalogue: () => void;
  onOpenSpecimen: (draftId: string) => void;
};

function getSpecimenTitle(draft: SpecimenDraft) {
  return recordKinds.find((recordKind) => recordKind.id === draft.recordKind)?.title ?? "Type not yet recorded";
}

function getSpecimenContext(draft: SpecimenDraft) {
  const suggestedIdentification = draft.description.suggestedIdentification.trim();

  if (suggestedIdentification) {
    return suggestedIdentification;
  }

  const place = [draft.locationContext.municipality.trim(), draft.locationContext.province.trim()]
    .filter(Boolean)
    .join(", ");

  return place || "No identification or location recorded";
}

function getStatusLabel(draft: SpecimenDraft) {
  if (draft.status === "private-specimen") {
    return "Private specimen";
  }

  if (draft.status === "ready-for-review") {
    return "Ready for review";
  }

  return "Needs information";
}

function getStatusClassName(draft: SpecimenDraft) {
  if (draft.status === "private-specimen") {
    return "desktop-table-status-private";
  }

  if (draft.status === "ready-for-review") {
    return "desktop-table-status-ready";
  }

  return "desktop-table-status-progress";
}

function formatUpdatedAt(updatedAt: string) {
  return new Intl.DateTimeFormat("en-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(updatedAt));
}

export function DesktopSpecimensScreen({ drafts, onImportCatalogue, onOpenSpecimen }: DesktopSpecimensScreenProps) {
  const privateCount = drafts.filter((draft) => draft.status === "private-specimen").length;

  const reviewCount = drafts.filter((draft) => draft.status === "ready-for-review").length;

  const incompleteCount = drafts.length - privateCount - reviewCount;

  const sortedDrafts = [...drafts].sort((firstDraft, secondDraft) =>
    secondDraft.updatedAt.localeCompare(firstDraft.updatedAt),
  );

  return (
    <>
      <header className="desktop-page-header desktop-page-header-actions">
        <div>
          <p className="eyebrow">Private collection</p>

          <h1>My specimens</h1>

          <p>Manage individual specimens and catalogue imports from one private workspace.</p>
        </div>

        <button className="primary-button" type="button" onClick={onImportCatalogue}>
          Import catalogue
        </button>
      </header>

      <section className="desktop-stat-grid" aria-label="Specimen summary">
        <article className="desktop-stat-card">
          <span>All specimens</span>
          <strong>{drafts.length}</strong>
        </article>

        <article className="desktop-stat-card">
          <span>Needs information</span>
          <strong>{incompleteCount}</strong>
        </article>

        <article className="desktop-stat-card">
          <span>Ready for review</span>
          <strong>{reviewCount}</strong>
        </article>

        <article className="desktop-stat-card">
          <span>Saved privately</span>
          <strong>{privateCount}</strong>
        </article>
      </section>

      <section className="desktop-panel">
        <div className="desktop-panel-heading">
          <div>
            <h2>Specimens</h2>

            <p>The desktop and mobile previews share the same in-memory specimen state.</p>
          </div>
        </div>

        {sortedDrafts.length === 0 ? (
          <div className="desktop-empty-state">
            <span className="desktop-empty-symbol" aria-hidden="true">
              ◈
            </span>

            <h3>No specimens yet</h3>

            <p>Add one specimen in the mobile view, or prepare to import an existing catalogue here.</p>

            <button className="secondary-button" type="button" onClick={onImportCatalogue}>
              View catalogue import
            </button>
          </div>
        ) : (
          <div className="desktop-table-wrap">
            <table className="desktop-specimen-table">
              <thead>
                <tr>
                  <th scope="col">Specimen</th>
                  <th scope="col">Status</th>
                  <th scope="col">Images</th>
                  <th scope="col">Last updated</th>

                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedDrafts.map((draft) => {
                  const firstImage = draft.images[0];

                  return (
                    <tr key={draft.id}>
                      <td>
                        <div className="desktop-specimen-cell">
                          {firstImage ? (
                            <img src={firstImage.previewUrl} alt="" />
                          ) : (
                            <span className="desktop-specimen-placeholder">No image</span>
                          )}

                          <span>
                            <strong>{getSpecimenTitle(draft)}</strong>

                            <small>{getSpecimenContext(draft)}</small>
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className={`desktop-table-status ${getStatusClassName(draft)}`}>
                          {getStatusLabel(draft)}
                        </span>
                      </td>

                      <td>{draft.images.length}</td>

                      <td>{formatUpdatedAt(draft.updatedAt)}</td>

                      <td className="desktop-table-action-cell">
                        <button className="text-button" type="button" onClick={() => onOpenSpecimen(draft.id)}>
                          Open on mobile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
