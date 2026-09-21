import { useState } from "react";
import type { FossilTemplateInspection } from "./fossilCatalogueImport";

type FossilCatalogueReviewScreenProps = {
  inspection: FossilTemplateInspection;
  filename: string;
  onBack: () => void;
};

const REVIEW_PAGE_SIZE = 20;

export function FossilCatalogueReviewScreen({ inspection, filename, onBack }: FossilCatalogueReviewScreenProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(inspection.rows.length / REVIEW_PAGE_SIZE));

  const firstRowIndex = (currentPage - 1) * REVIEW_PAGE_SIZE;

  const visibleRows = inspection.rows.slice(firstRowIndex, firstRowIndex + REVIEW_PAGE_SIZE);

  const rowsWithErrors = inspection.rows.filter((row) => row.errors.length > 0).length;

  const rowsWithWarnings = inspection.rows.filter((row) => row.warnings.length > 0).length;

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
          <small>
            Showing {Math.min(firstRowIndex + 1, inspection.specimenRowCount)}–
            {Math.min(firstRowIndex + visibleRows.length, inspection.specimenRowCount)}
          </small>
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
                <th scope="col">Row</th>
                <th scope="col">Catalogue number</th>
                <th scope="col">Identification</th>
                <th scope="col">Anatomical element</th>
                <th scope="col">Formation</th>
                <th scope="col">Geological age</th>
                <th scope="col">Status</th>
              </tr>
            </thead>

            <tbody>
              {visibleRows.map((row) => {
                const hasErrors = row.errors.length > 0;

                const hasWarnings = row.warnings.length > 0;

                return (
                  <tr
                    key={`${row.rowNumber}-${row.catalogueNumber}`}
                    className={
                      hasErrors ? "catalogue-review-row-error" : hasWarnings ? "catalogue-review-row-warning" : ""
                    }>
                    <td>{row.rowNumber}</td>

                    <td>
                      <strong>{row.catalogueNumber || "Missing"}</strong>
                    </td>

                    <td>{row.identification || "Not provided"}</td>

                    <td>{row.anatomicalElement || "Not provided"}</td>

                    <td>{row.formation || row.member || "Not provided"}</td>

                    <td>{row.geologicalAge || "Not provided"}</td>

                    <td>
                      {hasErrors ? (
                        <span className="catalogue-row-status catalogue-row-status-error">Error</span>
                      ) : hasWarnings ? (
                        <span className="catalogue-row-status catalogue-row-status-warning">Check</span>
                      ) : (
                        <span className="catalogue-row-status catalogue-row-status-ready">Ready</span>
                      )}

                      {(hasErrors || hasWarnings) && (
                        <ul className="catalogue-row-messages">
                          {row.errors.map((message) => (
                            <li key={message}>{message}</li>
                          ))}

                          {row.warnings.map((message) => (
                            <li key={message}>{message}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <nav className="catalogue-review-pagination" aria-label="Specimen review pages">
            <button
              className="outline-button"
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="outline-button"
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>
              Next
            </button>
          </nav>
        </div>

        <div className="catalogue-review-actions">
          <p>Rows marked Error must be corrected in the spreadsheet and uploaded again.</p>

          <button className="primary-button" type="button" disabled={rowsWithErrors > 0}>
            Import private records
          </button>
        </div>
      </section>
    </>
  );
}
