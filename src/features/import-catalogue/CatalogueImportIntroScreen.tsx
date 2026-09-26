import { useState } from "react";

import { CatalogueImportLandingScreen } from "./CatalogueImportLandingScreen";
import { CatalogueImportWorkspaceScreen } from "./CatalogueImportWorkspaceScreen";
import type { FossilTemplateInspection, FossilTemplateInspectionRow } from "./fossilCatalogueImport";

import {
  createEmptySharedCollectingContext,
  type CatalogueContextMode,
  type CatalogueImportSession,
  type CatalogueTemplateKind,
  type SharedCollectingContext,
} from "./catalogueImportTypes";

import { buildFossilCatalogueTemplate, createFossilTemplateFilename } from "./fossilCatalogueTemplate";

import type { CatalogueImportImagePoolAddResult } from "../../services/catalogueImportSessionService";

type CatalogueImportIntroScreenProps = {
  onBack: () => void;
  activeSession: CatalogueImportSession | null;
  onCreateImportSession: (
    inspection: FossilTemplateInspection,
    rows: FossilTemplateInspectionRow[],
    filename: string,
  ) => CatalogueImportSession;
  onAddImages: (files: File[]) => CatalogueImportImagePoolAddResult;
};

type SetupStep = "template" | "context";

type TemplateOption = {
  id: CatalogueTemplateKind;
  symbol: string;
  title: string;
  description: string;
  detail: string;
  available: boolean;
};

const templateOptions: TemplateOption[] = [
  {
    id: "fossil",
    symbol: "◒",
    title: "Fossil collection",
    description: "For fossils, bones, teeth, shells and trace fossils.",
    detail: "Includes taxonomy, anatomy, geological context and preparation.",
    available: true,
  },
  {
    id: "rock-mineral",
    symbol: "◆",
    title: "Rock or mineral collection",
    description: "For rocks, minerals, crystals and geological samples.",
    detail: "A dedicated mineralogical template is planned.",
    available: false,
  },
  {
    id: "mixed",
    symbol: "▦",
    title: "Mixed or other collection",
    description: "For collections containing several material types.",
    detail: "A simpler general-purpose template is planned.",
    available: false,
  },
];

const contextOptions: Array<{
  id: CatalogueContextMode;
  title: string;
  description: string;
  example: string;
}> = [
  {
    id: "shared",
    title: "Most items share a collecting context",
    description: "Enter shared locality, collector and date information once. Blank CSV cells inherit these values.",
    example: "Best for a quarry, excavation or field trip.",
  },
  {
    id: "per-record",
    title: "Items have different collecting contexts",
    description: "Include locality, collector and date information separately for every specimen.",
    example: "Best for a collection assembled from many places.",
  },
];

export function CatalogueImportIntroScreen({
  onBack,
  activeSession,
  onCreateImportSession,
  onAddImages,
}: CatalogueImportIntroScreenProps) {
  const [isBuildingTemplate, setIsBuildingTemplate] = useState(false);

  const [setupStep, setSetupStep] = useState<SetupStep>("template");

  const [selectedTemplate, setSelectedTemplate] = useState<CatalogueTemplateKind | null>(null);

  const [contextMode, setContextMode] = useState<CatalogueContextMode | null>(null);

  const [sharedContext, setSharedContext] = useState<SharedCollectingContext>(createEmptySharedCollectingContext);

  const updateSharedContext = (field: keyof SharedCollectingContext, value: string) => {
    setSharedContext((currentContext) => ({
      ...currentContext,
      [field]: value,
    }));
  };

  const continueToContextChoice = () => {
    if (!selectedTemplate) {
      return;
    }

    setContextMode(null);
    setSetupStep("context");
  };

  const downloadFossilTemplate = () => {
    if (!contextMode || !sharedContext.collectionName.trim()) {
      return;
    }

    const csv = buildFossilCatalogueTemplate(contextMode, sharedContext);

    const downloadUrl = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv;charset=utf-8",
      }),
    );

    const downloadLink = document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download = createFossilTemplateFilename(sharedContext.collectionName, contextMode);

    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  };

  if (activeSession) {
    return <CatalogueImportWorkspaceScreen session={activeSession} onBack={onBack} onAddImages={onAddImages} />;
  }

  if (!isBuildingTemplate) {
    return (
      <CatalogueImportLandingScreen
        onBack={onBack}
        onGetTemplate={() => {
          setSetupStep("template");
          setIsBuildingTemplate(true);
        }}
        onCreateImportSession={onCreateImportSession}
      />
    );
  }

  return (
    <>
      <header className="desktop-page-header desktop-page-header-actions">
        <div>
          <p className="eyebrow">Desktop workspace</p>

          <h1>Import catalogue</h1>

          <p>Choose a template that matches the collection before preparing the spreadsheet.</p>
        </div>

        <button className="outline-button" type="button" onClick={() => setIsBuildingTemplate(false)}>
          Back to import options
        </button>
      </header>

      {setupStep === "template" ? (
        <section className="catalogue-setup-panel">
          <div className="catalogue-setup-heading">
            <p className="card-kicker">Step 1 of 2</p>

            <h2>What does the collection mainly contain?</h2>

            <p>Specialist templates keep the spreadsheet useful without filling it with unrelated columns.</p>
          </div>

          <div className="catalogue-template-grid">
            {templateOptions.map((option) => {
              const isSelected = selectedTemplate === option.id;

              return (
                <button
                  className={`catalogue-template-card ${isSelected ? "catalogue-template-card-selected" : ""}`}
                  type="button"
                  key={option.id}
                  disabled={!option.available}
                  aria-pressed={option.available ? isSelected : undefined}
                  onClick={() => setSelectedTemplate(option.id)}>
                  <span className="catalogue-template-symbol" aria-hidden="true">
                    {option.symbol}
                  </span>

                  <span className="catalogue-template-card-copy">
                    <span className="catalogue-template-title-row">
                      <strong>{option.title}</strong>

                      {!option.available && <small>Planned</small>}
                    </span>

                    <span>{option.description}</span>

                    <small>{option.detail}</small>
                  </span>

                  {isSelected && (
                    <span className="catalogue-template-check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="catalogue-setup-actions catalogue-setup-actions-end">
            <button
              className="primary-button"
              type="button"
              disabled={!selectedTemplate}
              onClick={continueToContextChoice}>
              Continue
            </button>
          </div>
        </section>
      ) : (
        <section className="catalogue-setup-panel">
          <div className="catalogue-setup-heading catalogue-setup-heading-with-action">
            <div>
              <p className="card-kicker">Step 2 of 2</p>

              <h2>How was this fossil collection assembled?</h2>

              <p>Shared information becomes an import default. Individual spreadsheet values can still override it.</p>
            </div>

            <button className="text-button" type="button" onClick={() => setSetupStep("template")}>
              Change template
            </button>
          </div>

          <div className="catalogue-context-grid" role="group" aria-label="Collecting context">
            {contextOptions.map((option) => {
              const isSelected = contextMode === option.id;

              return (
                <button
                  className={`catalogue-context-card ${isSelected ? "catalogue-context-card-selected" : ""}`}
                  type="button"
                  key={option.id}
                  aria-pressed={isSelected}
                  onClick={() => setContextMode(option.id)}>
                  <span className="catalogue-context-radio" aria-hidden="true">
                    {isSelected ? "●" : "○"}
                  </span>

                  <span>
                    <strong>{option.title}</strong>

                    <span>{option.description}</span>

                    <small>{option.example}</small>
                  </span>
                </button>
              );
            })}
          </div>

          {contextMode && (
            <div className="catalogue-context-form">
              <div className="catalogue-context-form-heading">
                <div>
                  <h3>{contextMode === "shared" ? "Shared collecting context" : "Collection details"}</h3>

                  <p>
                    {contextMode === "shared"
                      ? "Leave a shared field blank when it varies substantially between specimens. It will then remain in the CSV."
                      : "Only the collection name is entered here. The downloadable CSV will contain collecting-context columns for each record."}
                  </p>
                </div>

                <span className="catalogue-private-badge">Private import</span>
              </div>

              <div className="catalogue-form-grid">
                <label className="catalogue-field catalogue-field-wide">
                  <span>Collection name</span>

                  <input
                    type="text"
                    value={sharedContext.collectionName}
                    maxLength={120}
                    onChange={(event) => updateSharedContext("collectionName", event.currentTarget.value)}
                  />
                </label>

                {contextMode === "shared" && (
                  <>
                    <label className="catalogue-field">
                      <span>Provenance</span>

                      <select
                        value={sharedContext.provenance}
                        onChange={(event) => updateSharedContext("provenance", event.currentTarget.value)}>
                        <option value="">Choose if shared</option>

                        <option value="self-found">Found by the collection owner</option>

                        <option value="known-collector">Found by a known collector</option>

                        <option value="inherited">Inherited</option>

                        <option value="documented-collection">Documented collection</option>

                        <option value="uncertain">Not certain</option>
                      </select>
                    </label>

                    <label className="catalogue-field">
                      <span>Collector or source</span>

                      <input
                        type="text"
                        value={sharedContext.collectedBy}
                        onChange={(event) => updateSharedContext("collectedBy", event.currentTarget.value)}
                      />
                    </label>

                    <label className="catalogue-field">
                      <span>Country</span>

                      <input
                        type="text"
                        value={sharedContext.country}
                        onChange={(event) => updateSharedContext("country", event.currentTarget.value)}
                      />
                    </label>

                    <label className="catalogue-field">
                      <span>Province</span>

                      <input
                        type="text"
                        value={sharedContext.province}
                        onChange={(event) => updateSharedContext("province", event.currentTarget.value)}
                      />
                    </label>

                    <label className="catalogue-field">
                      <span>Municipality</span>

                      <input
                        type="text"
                        value={sharedContext.municipality}
                        onChange={(event) => updateSharedContext("municipality", event.currentTarget.value)}
                      />
                    </label>

                    <label className="catalogue-field">
                      <span>Site or locality</span>

                      <input
                        type="text"
                        value={sharedContext.siteName}
                        onChange={(event) => updateSharedContext("siteName", event.currentTarget.value)}
                      />
                    </label>

                    <label className="catalogue-field">
                      <span>Collection date from</span>

                      <input
                        type="text"
                        value={sharedContext.collectionDateFrom}
                        placeholder="YYYY, YYYY-MM or YYYY-MM-DD"
                        onChange={(event) => updateSharedContext("collectionDateFrom", event.currentTarget.value)}
                      />
                    </label>

                    <label className="catalogue-field">
                      <span>Collection date to</span>

                      <input
                        type="text"
                        value={sharedContext.collectionDateTo}
                        placeholder="YYYY, YYYY-MM or YYYY-MM-DD"
                        onChange={(event) => updateSharedContext("collectionDateTo", event.currentTarget.value)}
                      />
                    </label>

                    <div className="catalogue-form-divider catalogue-field-wide">
                      <strong>Optional shared geology</strong>

                      <span>
                        Leave these blank if formation, member or age varies by specimen, as it does in parts of the
                        Nieuwdonk catalogue.
                      </span>
                    </div>

                    <label className="catalogue-field">
                      <span>Formation</span>

                      <input
                        type="text"
                        value={sharedContext.formation}
                        onChange={(event) => updateSharedContext("formation", event.currentTarget.value)}
                      />
                    </label>

                    <label className="catalogue-field">
                      <span>Member</span>

                      <input
                        type="text"
                        value={sharedContext.member}
                        onChange={(event) => updateSharedContext("member", event.currentTarget.value)}
                      />
                    </label>

                    <label className="catalogue-field catalogue-field-wide">
                      <span>Geological age or interval</span>

                      <input
                        type="text"
                        value={sharedContext.geologicalAge}
                        onChange={(event) => updateSharedContext("geologicalAge", event.currentTarget.value)}
                      />
                    </label>

                    <label className="catalogue-field">
                      <span>Youngest age in Ma (Mega annum = million years)</span>

                      <input
                        type="text"
                        inputMode="decimal"
                        value={sharedContext.ageMinMa}
                        placeholder="For example, 0.01"
                        onChange={(event) => updateSharedContext("ageMinMa", event.currentTarget.value)}
                      />
                    </label>

                    <label className="catalogue-field">
                      <span>Oldest age in Ma</span>

                      <input
                        type="text"
                        inputMode="decimal"
                        value={sharedContext.ageMaxMa}
                        placeholder="For example, 0.2"
                        onChange={(event) => updateSharedContext("ageMaxMa", event.currentTarget.value)}
                      />
                    </label>

                    <label className="catalogue-field catalogue-field-wide">
                      <span>Shared context notes</span>

                      <textarea
                        value={sharedContext.notes}
                        rows={3}
                        onChange={(event) => updateSharedContext("notes", event.currentTarget.value)}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="catalogue-setup-actions">
            <div>
              <strong>Download an empty CSV after choosing a context mode and entering the collection name.</strong>

              <span>You can open the downloaded file in Google Sheets, Excel or another spreadsheet editor.</span>
            </div>

            <button
              className="primary-button"
              type="button"
              disabled={!contextMode || !sharedContext.collectionName.trim()}
              onClick={downloadFossilTemplate}>
              Download fossil CSV template
            </button>
          </div>
        </section>
      )}
    </>
  );
}
