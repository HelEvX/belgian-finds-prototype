import type { CatalogueImportSession } from "./catalogueImportTypes";

type CatalogueImportWorkspaceScreenProps = {
  session: CatalogueImportSession;
  onBack: () => void;
};

export function CatalogueImportWorkspaceScreen({ session, onBack }: CatalogueImportWorkspaceScreenProps) {
  const awaitingImagesCount = session.records.filter((record) => record.status === "awaiting-images").length;

  const recordsWithCsvNotesCount = session.records.filter((record) => record.validationWarnings.length > 0).length;

  const readyToFinaliseCount = session.records.filter((record) => record.status === "ready-to-finalise").length;

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

      <section className="catalogue-review-panel">
        <div className="catalogue-review-heading">
          <div>
            <p className="card-kicker">Import session created</p>

            <h2>Next: match collection images</h2>
          </div>

          <span className="catalogue-private-badge">Private until finalised</span>
        </div>

        <p>
          This session contains {session.records.length} validated catalogue record
          {session.records.length === 1 ? "" : "s"} from <strong>{session.sourceFilename}</strong>. They have not been
          added to My specimens and are not visible to other members.
        </p>

        <p>
          The next desktop workflow will let you select the images for this collection and assign them to catalogue
          records without allowing the same image to be assigned twice.
        </p>
      </section>
    </>
  );
}
