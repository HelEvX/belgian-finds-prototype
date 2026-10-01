import type { PrivateCollection, PrivateCollectionSpecimen } from "./types";

type PrivateCollectionScreenProps = {
  collection: PrivateCollection;
  onBack: () => void;
};

const catalogueNumberCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function getSpecimenDisplayTitle(specimen: PrivateCollectionSpecimen) {
  return specimen.identification.trim() || "Unidentified record";
}

function getSpecimenLocation(specimen: PrivateCollectionSpecimen) {
  return (
    [specimen.siteName, specimen.municipality, specimen.province].filter(Boolean).join(" · ") || "No locality recorded"
  );
}

export function PrivateCollectionScreen({ collection, onBack }: PrivateCollectionScreenProps) {
  const imageCount = collection.specimens.reduce((total, specimen) => total + specimen.images.length, 0);

  const sortedSpecimens = [...collection.specimens].sort((firstSpecimen, secondSpecimen) =>
    catalogueNumberCollator.compare(firstSpecimen.catalogueNumber, secondSpecimen.catalogueNumber),
  );

  return (
    <>
      <header className="desktop-page-header desktop-page-header-actions">
        <div>
          <p className="eyebrow">Private collection</p>

          <h1>{collection.name}</h1>

          <p>
            {collection.specimens.length} catalogue records · {imageCount} images · Private
          </p>
        </div>

        <button className="outline-button" type="button" onClick={onBack}>
          My specimens
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
              {sortedSpecimens.map((specimen) => (
                <tr key={specimen.id}>
                  <td>
                    <strong>{specimen.catalogueNumber}</strong>
                  </td>

                  <td>{getSpecimenDisplayTitle(specimen)}</td>

                  <td>{specimen.images.length}</td>

                  <td>{getSpecimenLocation(specimen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
