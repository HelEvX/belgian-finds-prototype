import { useMemo } from "react";

import type { PrivateCollection, PrivateCollectionSpecimen } from "./types";

type MobilePrivateCollectionScreenProps = {
  collection: PrivateCollection;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onOpenRecord: (recordId: string) => void;
  onBack: () => void;
};

const catalogueNumberCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function getSpecimenTitle(specimen: PrivateCollectionSpecimen) {
  return specimen.identification.trim() || "Unidentified record";
}

function getSpecimenContext(specimen: PrivateCollectionSpecimen) {
  return [specimen.siteName, specimen.municipality, specimen.province].filter(Boolean).join(" · ");
}

function getImageCount(collection: PrivateCollection) {
  return collection.specimens.reduce((total, specimen) => total + specimen.images.length, 0);
}

export function MobilePrivateCollectionScreen({
  collection,
  searchQuery,
  onSearchQueryChange,
  onOpenRecord,
  onBack,
}: MobilePrivateCollectionScreenProps) {
  const sortedSpecimens = useMemo(
    () =>
      [...collection.specimens].sort((firstSpecimen, secondSpecimen) =>
        catalogueNumberCollator.compare(firstSpecimen.catalogueNumber, secondSpecimen.catalogueNumber),
      ),
    [collection.specimens],
  );

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();

  const visibleSpecimens = sortedSpecimens.filter((specimen) => {
    if (!normalizedSearchQuery) {
      return true;
    }

    return [
      specimen.catalogueNumber,
      specimen.identification,
      specimen.anatomicalElement,
      specimen.siteName,
      specimen.municipality,
      specimen.province,
    ].some((value) => value.toLocaleLowerCase().includes(normalizedSearchQuery));
  });

  const imageCount = getImageCount(collection);

  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Private collection</p>

          <h2>{collection.name}</h2>
        </div>

        <button className="text-button member-collection-back" type="button" onClick={onBack}>
          My specimens
        </button>
      </header>

      <section className="member-summary-card">
        <p className="card-kicker">Private</p>

        <h3>
          {collection.specimens.length} {collection.specimens.length === 1 ? "record" : "records"}
        </h3>

        <p>
          {imageCount} {imageCount === 1 ? "image" : "images"} in this collection.
        </p>
      </section>

      <label className="member-filter-control">
        <span>Find a catalogue record</span>

        <input
          type="search"
          value={searchQuery}
          placeholder="Catalogue number or identification"
          onChange={(event) => onSearchQueryChange(event.currentTarget.value)}
        />
      </label>

      <section className="mobile-section member-collection-records">
        <div className="section-heading">
          <h3>Records</h3>

          <span className="member-section-count">
            {visibleSpecimens.length} / {collection.specimens.length}
          </span>
        </div>

        {visibleSpecimens.length === 0 ? (
          <div className="member-empty-filter">
            <p>No catalogue records match that search.</p>
          </div>
        ) : (
          <div className="member-collection-record-list">
            {visibleSpecimens.map((specimen) => {
              const context = getSpecimenContext(specimen);

              const firstImage = specimen.images[0];

              const title = getSpecimenTitle(specimen);

              return (
                <button
                  className="member-collection-record-card"
                  type="button"
                  key={specimen.id}
                  aria-label={`Open ${specimen.catalogueNumber}: ${title}`}
                  onClick={() => onOpenRecord(specimen.id)}>
                  <span className="member-collection-record-media">
                    {firstImage ? (
                      <img className="member-collection-record-thumbnail" src={firstImage.previewUrl} alt="" />
                    ) : (
                      <span
                        className="member-collection-record-thumbnail member-collection-record-thumbnail-empty"
                        aria-hidden="true">
                        No image
                      </span>
                    )}

                    <small>
                      {specimen.images.length} {specimen.images.length === 1 ? "image" : "images"}
                    </small>
                  </span>

                  <span className="member-collection-record-copy">
                    <strong>{specimen.catalogueNumber}</strong>

                    <span>{title}</span>

                    {context && <small>{context}</small>}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
