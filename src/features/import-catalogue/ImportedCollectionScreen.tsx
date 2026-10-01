import type { CatalogueImportRecord, CatalogueImportSession } from "./catalogueImportTypes";

type ImportedCollectionScreenProps = {
  session: CatalogueImportSession;
  onFinishImport: () => void;
};

const catalogueNumberCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function getRecordDisplayTitle(record: CatalogueImportRecord) {
  return record.specimenData.identification.trim() || "Unidentified record";
}

function getRecordLocation(record: CatalogueImportRecord) {
  return (
    [record.specimenData.siteName, record.specimenData.municipality, record.specimenData.province]
      .filter(Boolean)
      .join(" · ") || "No locality recorded"
  );
}

function getImageCountLabel(record: CatalogueImportRecord) {
  const assignedImageCount = record.assignedImageIds.length;

  if (record.expectedImageCount === null) {
    return String(assignedImageCount);
  }

  return `${assignedImageCount} / ${record.expectedImageCount}`;
}

export function ImportedCollectionScreen({ session, onFinishImport }: ImportedCollectionScreenProps) {
  const assignedImageCount = session.images.filter((image) => image.assignedRecordId !== null).length;

  const unassignedImageCount = session.images.length - assignedImageCount;

  const recordsWithoutImagesCount = session.records.filter((record) => record.assignedImageIds.length === 0).length;

  const canFinishImport = unassignedImageCount === 0 && recordsWithoutImagesCount === 0;

  const sortedRecords = [...session.records].sort((firstRecord, secondRecord) =>
    catalogueNumberCollator.compare(firstRecord.catalogueNumber, secondRecord.catalogueNumber),
  );

  const imageSummary = canFinishImport
    ? `${assignedImageCount} of ${session.images.length} images matched to ${session.records.length} catalogue records.`
    : `${assignedImageCount} of ${session.images.length} images matched. ${recordsWithoutImagesCount} catalogue record${
        recordsWithoutImagesCount === 1 ? "" : "s"
      } still have no image assignment.`;

  return (
    <>
      <header className="desktop-page-header desktop-page-header-actions">
        <div>
          <p className="eyebrow">Private imported collection</p>

          <h1>{session.collectionName}</h1>

          <p>{imageSummary}</p>
        </div>

        <button className="primary-button" type="button" disabled={!canFinishImport} onClick={onFinishImport}>
          Finish import
        </button>
      </header>

      <section className="desktop-panel">
        <div className="desktop-panel-heading">
          <h2>Catalogue records</h2>
        </div>

        <div className="desktop-table-wrap">
          <table className="desktop-specimen-table">
            <thead>
              <tr>
                <th scope="col">Catalogue no.</th>
                <th scope="col">Identification</th>
                <th scope="col">Images</th>
                <th scope="col">Locality</th>
              </tr>
            </thead>

            <tbody>
              {sortedRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <strong>{record.catalogueNumber}</strong>
                  </td>

                  <td>{getRecordDisplayTitle(record)}</td>

                  <td>{getImageCountLabel(record)}</td>

                  <td>{getRecordLocation(record)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
