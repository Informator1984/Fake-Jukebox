export interface SourceSpan {
  page?: number;
  paragraph?: number;
  start?: number;
  end?: number;
  label?: string;
}

export interface DocumentationUnit {
  id: string;
  deNumber: number;
  title: string;
  boundary: string;
  documentType: string;
  textFunction: string;
  indicativeAbstract: string;
  descriptors: string[];
  freeKeywords: string;
  category: string;
  evidenceType: string;
  aiRelevance: string;
  typicalUserQuestion: string;
  retrievalFocus: string;
  sourceSpans: SourceSpan[];
}

export interface Quote {
  id: string;
  documentationUnitId?: string;
  text: string;
  location: string;
  rationale: string;
}

export interface AnalysisResult {
  documentType: string;
  macroStructure: string;
  documentationUnits: DocumentationUnit[];
  quotes: Quote[];
  macroProfile: string;
  motifs?: string;
  openQuestions?: string;
  followUpQuestions: string[];
}

export type AnswerMode =
  | "short"
  | "with_de_reference"
  | "compare_des"
  | "thematic_synthesis"
  | "evidence_mode"
  | "keywords"
  | "documentary_mask";

export interface QaAnswer {
  answer: string;
  referencedDes: number[];
  mode: AnswerMode;
}

export interface DocumentWithAnalysis {
  id: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  textContent: string;
  pageCount?: number | null;
  createdAt: Date;
  analysis?: {
    id: string;
    documentType: string;
    macroStructure: string;
    macroProfile: string;
    motifs?: string | null;
    openQuestions?: string | null;
    followUpQuestions: string;
    rawJson: string;
    createdAt: Date;
    documentationUnits: {
      id: string;
      deNumber: number;
      title: string;
      boundary: string;
      documentType: string;
      textFunction: string;
      indicativeAbstract: string;
      descriptors: string;
      freeKeywords: string;
      category: string;
      evidenceType: string;
      aiRelevance: string;
      typicalUserQuestion: string;
      retrievalFocus: string;
      sourceSpans: string;
    }[];
    quotes: {
      id: string;
      documentationUnitId?: string | null;
      text: string;
      location: string;
      rationale: string;
    }[];
  } | null;
  qaTurns?: {
    id: string;
    question: string;
    answer: string;
    answerMode: string;
    referencedDes: string;
    createdAt: Date;
  }[];
}
