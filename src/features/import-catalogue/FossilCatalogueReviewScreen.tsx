import { useState } from "react";

import type { FossilTemplateInspection, FossilTemplateInspectionRow } from "./fossilCatalogueImport";

import type { CatalogueImportCommitResult } from "./catalogueImportTypes";

type FossilCatalogueReviewScreenProps = {
  inspection: FossilTemplateInspection;
  filename: string;
  onBack: () => void;
  onImportPrivateRecords: (
    inspection: FossilTemplateInspection,
    rows: FossilTemplateInspectionRow[],
  ) => CatalogueImportCommitResult;
};

const REVIEW_PAGE_SIZE = 20;

export function FossilCatalogueReviewScreen({
  inspection,
  filename,
  onBack,
  onImportPrivateRecords,
}: FossilCatalogueReviewScreenProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const [importResult, setImportResult] = useState<CatalogueImportCommitResult | null>(null);

  const rowsWithErrors = inspection.rows.filter((row) => row.errors.length > 0).length;

  const rowsWithWarnings = inspection.rows.filter((row) => row.warnings.length > 0).length;

  const validRows = inspection.rows.filter((row) => row.errors.length === 0);

  const totalPages = Math.max(1, Math.ceil(inspection.rows.length / REVIEW_PAGE_SIZE));

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const firstRowIndex = (safeCurrentPage - 1) * REVIEW_PAGE_SIZE;

  const visibleRows = inspection.rows.slice(firstRowIndex, firstRowIndex + REVIEW_PAGE_SIZE);

  const importPrivateRecords = () => {
    if (importResult || rowsWithErrors > 0 || validRows.length === 0) {
      return;
    }

    setImportResult(onImportPrivateRecords(inspection, validRows));
  };

  return (
    <>
      <header className="desktop-page-header desktop-page-header-actions">
        <div>
          <p className="eyebrow">Review before import</p>

          <h1>{inspection.collectionName}</h1>

          <p>Check the imported specimen information before private records are created.</p>
        </div>

        <button className="outline-button" type="button" onClick={onBack}>
          Back to file summary
        </button>
      </header>

      <section className="catalogue-review-summary">
        <div>
          <span>File</span>
          <strong>{filename}</strong>
        </div>

        <div>
          <span>Specimen rows</span>
          <strong>{inspection.specimenRowCount}</strong>
        </div>

        <div>
          <span>Rows with errors</span>
          <strong>{rowsWithErrors}</strong>
        </div>

        <div>
          <span>Rows with warnings</span>
          <strong>{rowsWithWarnings}</strong>
        </div>
      </section>

      <section className="catalogue-review-panel">
        <div className="catalogue-review-heading">
          <div>
            <p className="card-kicker">Specimen data</p>

            <h2>Review each imported record</h2>
          </div>

          <span className="catalogue-private-badge">Private until published</span>
        </div>

        <div className="catalogue-review-table-wrap">
          <table className="catalogue-review-table">
            <thead>
              <tr>
                <th scope="col">Record</th>
                <th scope="col">Catalogue number</th>
                <th scope="col">Identification</th>
                <th scope="col">Anatomical element</th>
                <th scope="col">Formation</th>
                <th scope="col">Geological age</th>
                <th scope="col">Status</th>
              </tr>
            </thead>

            <tbody>
              {visibleRows.map((row, visibleIndex) => {
                const hasErrors = row.errors.length > 0;

                const hasWarnings = row.warnings.length > 0;

                return (
                  <tr
                    key={`${row.rowNumber}-${row.catalogueNumber}`}
                    className={
                      hasErrors ? "catalogue-review-row-error" : hasWarnings ? "catalogue-review-row-warning" : ""
                    }>
                    <td>{firstRowIndex + visibleIndex + 1}</td>

                    <td>
                      <strong>{row.catalogueNumber || "Missing"}</strong>
                    </td>

                    <td>{row.identification || "Not provided"}</td>

                    <td>{row.anatomicalElement || "Not provided"}</td>

                    <td>{row.formation || row.member || "Not provided"}</td>

                    <td>{row.geologicalAge || "Not provided"}</td>

                    <td className="catalogue-review-status-cell">
                      {hasErrors ? (
                        <span className="catalogue-row-status catalogue-row-status-error">Error</span>
                      ) : hasWarnings ? (
                        <span className="catalogue-row-status catalogue-row-status-warning">Check</span>
                      ) : (
                        <span className="catalogue-row-status catalogue-row-status-ready">Ready</span>
                      )}

                      {(hasErrors || hasWarnings) && (
                        <span className="catalogue-row-message-tooltip">
                          <span className="catalogue-row-message-tooltip-title">
                            {hasErrors ? "Needs correction" : "Check recommended"}
                          </span>

                          <span className="catalogue-row-message-tooltip-list">
                            {row.errors.map((message) => (
                              <span key={`error-${message}`}>{message}</span>
                            ))}

                            {row.warnings.map((message) => (
                              <span key={`warning-${message}`}>{message}</span>
                            ))}
                          </span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <nav className="catalogue-review-pagination" aria-label="Specimen review pages">
          <button
            className="outline-button"
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
            Previous
          </button>

          <span>
            Page {safeCurrentPage} of {totalPages}
          </span>

          <button
            className="outline-button"
            type="button"
            disabled={safeCurrentPage === totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>
            Next
          </button>
        </nav>

        <div className="catalogue-review-actions">
          <p>
            {importResult
              ? importResult.createdCount > 0
                ? `${importResult.createdCount} private draft${importResult.createdCount === 1 ? "" : "s"} created.${
                    importResult.skippedDuplicateCount > 0
                      ? ` ${importResult.skippedDuplicateCount} existing catalogue record${
                          importResult.skippedDuplicateCount === 1 ? " was" : "s were"
                        } skipped.`
                      : ""
                  }`
                : "No new private drafts were created because every catalogue number already exists in this collection."
              : rowsWithErrors > 0
                ? "Correct the rows marked Error and upload the CSV again."
                : `${validRows.length} record${validRows.length === 1 ? "" : "s"} ready to import privately.`}
          </p>

          <button
            className="primary-button"
            type="button"
            disabled={Boolean(importResult) || rowsWithErrors > 0 || validRows.length === 0}
            onClick={importPrivateRecords}>
            {importResult ? "Records imported" : "Import private records"}
          </button>
        </div>
      </section>
    </>
  );
}
