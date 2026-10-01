import { getSpecimenDisplayTitle } from "../record-find/getSpecimenDisplayTitle";
import {
  getSpecimenWorkspaceContext,
  getSpecimenWorkspaceStatusLabel,
} from "../record-find/getSpecimenWorkspaceMetadata";

import type { PrivateCollection } from "../collections/types";
import type { SpecimenDraft } from "../record-find/types";

type DesktopSpecimensScreenProps = {
  drafts: SpecimenDraft[];
  collections: PrivateCollection[];
  onImportCatalogue: () => void;
  onOpenSpecimen: (draftId: string) => void;
  onOpenCollection: (collectionId: string) => void;
};

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

export function DesktopSpecimensScreen({
  drafts,
  collections,
  onImportCatalogue,
  onOpenSpecimen,
  onOpenCollection,
}: DesktopSpecimensScreenProps) {
  const privateDraftCount = drafts.filter((draft) => draft.status === "private-specimen").length;

  const totalCollectionRecordCount = collections.reduce((total, collection) => total + collection.specimens.length, 0);

  const sortedDrafts = [...drafts].sort((firstDraft, secondDraft) =>
    secondDraft.updatedAt.localeCompare(firstDraft.updatedAt),
  );

  const sortedCollections = [...collections].sort((firstCollection, secondCollection) =>
    secondCollection.updatedAt.localeCompare(firstCollection.updatedAt),
  );

  return (
    <>
      <header className="desktop-page-header desktop-page-header-actions">
        <div>
          <p className="eyebrow">Private workspace</p>

          <h1>My specimens</h1>

          <p>Keep imported collections and individual specimens separate until you choose to share a record.</p>
        </div>

        <button className="primary-button" type="button" onClick={onImportCatalogue}>
          Import catalogue
        </button>
      </header>

      <section className="desktop-stat-grid" aria-label="Private workspace summary">
        <article className="desktop-stat-card">
          <span>Collections</span>
          <strong>{collections.length}</strong>
        </article>

        <article className="desktop-stat-card">
          <span>Catalogue records</span>
          <strong>{totalCollectionRecordCount}</strong>
        </article>

        <article className="desktop-stat-card">
          <span>Individual specimens</span>
          <strong>{drafts.length}</strong>
        </article>

        <article className="desktop-stat-card">
          <span>Saved privately</span>
          <strong>{privateDraftCount}</strong>
        </article>
      </section>

      <section className="desktop-panel">
        <div className="desktop-panel-heading">
          <h2>Collections</h2>
        </div>

        {sortedCollections.length === 0 ? (
          <div className="desktop-empty-state">
            <h3>No imported collections yet</h3>

            <p>Import a completed catalogue when you are ready to create a private collection.</p>
          </div>
        ) : (
          <div className="desktop-table-wrap">
            <table className="desktop-specimen-table">
              <thead>
                <tr>
                  <th scope="col">Collection</th>
                  <th scope="col">Records</th>
                  <th scope="col">Images</th>
                  <th scope="col">Visibility</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedCollections.map((collection) => {
                  const imageCount = collection.specimens.reduce(
                    (total, specimen) => total + specimen.images.length,
                    0,
                  );

                  return (
                    <tr key={collection.id}>
                      <td>
                        <strong>{collection.name}</strong>
                      </td>

                      <td>{collection.specimens.length}</td>

                      <td>{imageCount}</td>

                      <td>
                        <span className="desktop-table-status desktop-table-status-private">Private</span>
                      </td>

                      <td className="desktop-table-action-cell">
                        <button className="text-button" type="button" onClick={() => onOpenCollection(collection.id)}>
                          Open
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

      <section className="desktop-panel">
        <div className="desktop-panel-heading">
          <h2>Individual specimens</h2>
        </div>

        {sortedDrafts.length === 0 ? (
          <div className="desktop-empty-state">
            <h3>No individual specimens yet</h3>

            <p>Add one specimen in the mobile view when you have a separate find to document.</p>
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

                  const context = getSpecimenWorkspaceContext(draft) ?? "No location recorded";

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
                            <strong>{getSpecimenDisplayTitle(draft)}</strong>

                            <small>{context}</small>
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className={`desktop-table-status ${getStatusClassName(draft)}`}>
                          {getSpecimenWorkspaceStatusLabel(draft)}
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
