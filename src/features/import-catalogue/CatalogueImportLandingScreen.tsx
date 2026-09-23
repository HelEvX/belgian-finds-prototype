import { useState, type ChangeEvent } from "react";
import { FossilCatalogueReviewScreen } from "./FossilCatalogueReviewScreen";
import {
  inspectFossilCatalogueTemplate,
  MAX_CATALOGUE_CSV_BYTES,
  type FossilTemplateInspection,
  type FossilTemplateInspectionRow,
} from "./fossilCatalogueImport";
import type { CatalogueImportCommitResult } from "./catalogueImportTypes";

type CatalogueImportLandingScreenProps = {
  onBack: () => void;
  onGetTemplate: () => void;
  onImportPrivateRecords: (
    inspection: FossilTemplateInspection,
    rows: FossilTemplateInspectionRow[],
  ) => CatalogueImportCommitResult;
};

export function CatalogueImportLandingScreen({
  onBack,
  onGetTemplate,
  onImportPrivateRecords,
}: CatalogueImportLandingScreenProps) {
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);

  const [inspection, setInspection] = useState<FossilTemplateInspection | null>(null);

  const [fileError, setFileError] = useState<string | null>(null);

  const [isReadingFile, setIsReadingFile] = useState(false);

  const [showReview, setShowReview] = useState(false);

  const clearFile = () => {
    setUploadedFilename(null);
    setInspection(null);
    setFileError(null);
  };

  const readCompletedTemplate = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    clearFile();
    setUploadedFilename(file.name);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Choose a CSV exported from a Belgian Fossil Finds catalogue template.");
      return;
    }

    if (file.size > MAX_CATALOGUE_CSV_BYTES) {
      setFileError("This CSV is larger than the 5 MB import limit.");
      return;
    }

    setIsReadingFile(true);

    try {
      const csv = await file.text();
      setInspection(inspectFossilCatalogueTemplate(csv));
    } catch {
      setFileError("The selected file could not be read. Export the template again and retry.");
    } finally {
      setIsReadingFile(false);
    }
  };

  if (showReview && inspection) {
    return (
      <FossilCatalogueReviewScreen
        inspection={inspection}
        filename={uploadedFilename ?? ""}
        onBack={() => setShowReview(false)}
        onImportPrivateRecords={onImportPrivateRecords}
      />
    );
  }

  return (
    <>
      <header className="desktop-page-header desktop-page-header-actions">
        <div>
          <p className="eyebrow">Desktop workspace</p>

          <h1>Import catalogue</h1>

          <p>Upload a completed Belgian Fossil Finds template, or download one to complete later.</p>
        </div>

        <button className="outline-button" type="button" onClick={onBack}>
          Back to My specimens
        </button>
      </header>

      <section className="catalogue-import-paths">
        <article className="catalogue-import-path catalogue-import-path-primary">
          <span className="catalogue-import-path-symbol" aria-hidden="true">
            ⇧
          </span>

          <div>
            <p className="card-kicker">Already completed a template?</p>

            <h2>Upload completed CSV</h2>

            <p>Only CSV files created from a Belgian Fossil Finds catalogue template can be imported automatically.</p>
          </div>

          <input
            className="visually-hidden"
            id="completed-catalogue-template"
            type="file"
            accept=".csv,text/csv"
            onChange={readCompletedTemplate}
          />

          <label className="primary-button catalogue-file-button" htmlFor="completed-catalogue-template">
            Choose completed template
          </label>
        </article>

        <article className="catalogue-import-path">
          <span className="catalogue-import-path-symbol" aria-hidden="true">
            ▤
          </span>

          <div>
            <p className="card-kicker">Starting a new spreadsheet?</p>

            <h2>Get a catalogue template</h2>

            <p>
              Choose the collection type and context. Download the template, complete it when convenient, and return
              here later.
            </p>
          </div>

          <button className="secondary-button" type="button" onClick={onGetTemplate}>
            Choose a template
          </button>
        </article>
      </section>

      {(uploadedFilename || fileError || inspection) && (
        <section className="catalogue-upload-result" aria-live="polite">
          <div className="catalogue-upload-result-heading">
            <div>
              <p className="card-kicker">Selected file</p>

              <h2>{uploadedFilename}</h2>

              {isReadingFile && <p>Reading template metadata…</p>}
            </div>

            <button className="text-button" type="button" onClick={clearFile}>
              Remove
            </button>
          </div>

          {fileError && (
            <div className="catalogue-message catalogue-message-error" role="alert">
              <strong>File not accepted</strong>
              <span>{fileError}</span>
            </div>
          )}

          {inspection?.errors.map((message) => (
            <div className="catalogue-message catalogue-message-error" role="alert" key={message}>
              <strong>Template cannot be imported</strong>
              <span>{message}</span>
            </div>
          ))}

          {inspection?.warnings.map((message) => (
            <div className="catalogue-message catalogue-message-warning" key={message}>
              <strong>Check the template</strong>
              <span>{message}</span>
            </div>
          ))}

          {inspection && inspection.errors.length === 0 && (
            <div className="catalogue-upload-summary">
              <dl>
                <div>
                  <dt>Collection</dt>
                  <dd>{inspection.collectionName}</dd>
                </div>

                <div>
                  <dt>Template</dt>
                  <dd>Fossil collection · version 2</dd>
                </div>

                <div>
                  <dt>Collecting context</dt>
                  <dd>{inspection.contextMode === "shared" ? "Shared defaults" : "Recorded per specimen"}</dd>
                </div>

                <div>
                  <dt>Specimen rows</dt>
                  <dd>{inspection.specimenRowCount}</dd>
                </div>
              </dl>

              <button className="primary-button" type="button" onClick={() => setShowReview(true)}>
                Review data
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
