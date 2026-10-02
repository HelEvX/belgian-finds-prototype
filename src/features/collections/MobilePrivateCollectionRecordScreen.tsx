import { useState } from "react";

import type { PrivateCollection, PrivateCollectionSpecimen } from "./types";

type MobilePrivateCollectionRecordScreenProps = {
  collection: PrivateCollection;
  specimen: PrivateCollectionSpecimen;
  onBack: () => void;
};

type DetailItem = {
  label: string;
  value: string;
};

function getSpecimenTitle(specimen: PrivateCollectionSpecimen) {
  return specimen.identification.trim() || "Unidentified record";
}

function getLocation(specimen: PrivateCollectionSpecimen) {
  return [specimen.siteName, specimen.municipality, specimen.province].filter(Boolean).join(" · ");
}

function getFormation(specimen: PrivateCollectionSpecimen) {
  return [specimen.formation, specimen.member].filter(Boolean).join(" · ");
}

function getAge(specimen: PrivateCollectionSpecimen) {
  const ageLabel = specimen.geologicalAge.trim();

  const hasAgeRange = specimen.ageMinMa.trim() || specimen.ageMaxMa.trim();

  const ageRange =
    specimen.ageMinMa.trim() && specimen.ageMaxMa.trim()
      ? `${specimen.ageMinMa}–${specimen.ageMaxMa} Ma`
      : specimen.ageMinMa.trim()
        ? `${specimen.ageMinMa} Ma`
        : specimen.ageMaxMa.trim()
          ? `${specimen.ageMaxMa} Ma`
          : "";

  return [ageLabel, hasAgeRange ? ageRange : ""].filter(Boolean).join(" · ");
}

function getCollectionDate(specimen: PrivateCollectionSpecimen) {
  if (specimen.collectionDateFrom && specimen.collectionDateTo) {
    return specimen.collectionDateFrom === specimen.collectionDateTo
      ? specimen.collectionDateFrom
      : `${specimen.collectionDateFrom} – ${specimen.collectionDateTo}`;
  }

  return specimen.collectionDateFrom || specimen.collectionDateTo;
}

function withUnit(value: string, unit: string) {
  return value.trim() ? `${value} ${unit}` : "";
}

function DetailList({ items }: { items: DetailItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <dl className="member-record-detail-list">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>

          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function MobilePrivateCollectionRecordScreen({
  collection,
  specimen,
  onBack,
}: MobilePrivateCollectionRecordScreenProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const title = getSpecimenTitle(specimen);

  const activeImage = specimen.images[activeImageIndex] ?? specimen.images[0];

  const findContextItems: DetailItem[] = [
    {
      label: "Location",
      value: getLocation(specimen),
    },
    {
      label: "Formation",
      value: getFormation(specimen),
    },
    {
      label: "Geological age",
      value: getAge(specimen),
    },
    {
      label: "Collected",
      value: getCollectionDate(specimen),
    },
    {
      label: "Provenance",
      value: specimen.provenance.trim(),
    },
    {
      label: "Collector",
      value: specimen.collectedBy.trim(),
    },
  ].filter((item) => item.value);

  const measurementItems: DetailItem[] = [
    {
      label: "Length",
      value: withUnit(specimen.lengthCm, "cm"),
    },
    {
      label: "Width",
      value: withUnit(specimen.widthCm, "cm"),
    },
    {
      label: "Height",
      value: withUnit(specimen.heightCm, "cm"),
    },
    {
      label: "Weight",
      value: withUnit(specimen.weightG, "g"),
    },
    {
      label: "Measurement",
      value: specimen.measurementStatus.trim(),
    },
  ].filter((item) => item.value);

  const additionalItems: DetailItem[] = [
    {
      label: "Preparation",
      value: specimen.preparation.trim(),
    },
    {
      label: "Notes",
      value: specimen.specimenNotes.trim(),
    },
  ].filter((item) => item.value);

  return (
    <>
      <header className="mobile-header">
        <div>
          <p className="mobile-eyebrow">Private record</p>

          <h2>{title}</h2>
        </div>

        <button className="text-button member-collection-back" type="button" onClick={onBack}>
          Collection
        </button>
      </header>

      <p className="member-record-catalogue-reference">
        {collection.name} · {specimen.catalogueNumber}
      </p>

      {activeImage ? (
        <section className="member-record-gallery" aria-label={`Images for ${title}`}>
          <img
            className="member-record-primary-image"
            src={activeImage.previewUrl}
            alt={`Image ${activeImageIndex + 1} of ${specimen.images.length} for ${title}`}
          />

          {specimen.images.length > 1 && (
            <div className="member-record-image-picker" aria-label="Choose an image">
              {specimen.images.map((image, imageIndex) => (
                <button
                  className={`member-record-image-button ${
                    imageIndex === activeImageIndex ? "member-record-image-button-active" : ""
                  }`}
                  type="button"
                  key={image.id}
                  aria-label={`Show image ${imageIndex + 1}`}
                  aria-pressed={imageIndex === activeImageIndex}
                  onClick={() => setActiveImageIndex(imageIndex)}>
                  <img src={image.previewUrl} alt="" />
                </button>
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="member-record-image-empty">No images attached to this record.</div>
      )}

      <section className="member-record-section">
        <div className="section-heading">
          <h3>Record</h3>

          <span className="member-record-private-status">Private</span>
        </div>

        <dl className="member-record-detail-list">
          <div>
            <dt>Catalogue number</dt>

            <dd>{specimen.catalogueNumber}</dd>
          </div>

          {specimen.anatomicalElement.trim() && (
            <div>
              <dt>Element</dt>

              <dd>{specimen.anatomicalElement}</dd>
            </div>
          )}
        </dl>
      </section>

      {findContextItems.length > 0 && (
        <section className="member-record-section">
          <div className="section-heading">
            <h3>Find context</h3>
          </div>

          <DetailList items={findContextItems} />
        </section>
      )}

      {measurementItems.length > 0 && (
        <section className="member-record-section">
          <div className="section-heading">
            <h3>Measurements</h3>
          </div>

          <DetailList items={measurementItems} />
        </section>
      )}

      {additionalItems.length > 0 && (
        <section className="member-record-section">
          <div className="section-heading">
            <h3>Additional notes</h3>
          </div>

          <DetailList items={additionalItems} />
        </section>
      )}
    </>
  );
}
