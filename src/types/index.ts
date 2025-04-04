
export interface DocumentFile {
  file: File;
  preview: string;
  id: string;
}

export type DocumentType = 
  | 'passport'
  | 'id_card'
  | 'driver_license'
  | 'certificate'
  | 'diploma'
  | 'other';

export interface ExtractedData {
  [key: string]: string;
}

export interface SuspiciousArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'font_inconsistency' | 'digital_alteration' | 'layout_anomaly' | 'security_feature';
  confidence: number;
  description: string;
}

export interface VerificationResult {
  id: string;
  timestamp: string;
  documentType: DocumentType;
  overallScore: number;
  extractedData: ExtractedData;
  verificationSteps: VerificationStep[];
  suspiciousAreas: SuspiciousArea[];
  status: 'verified' | 'suspicious' | 'rejected';
}

export interface VerificationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  score: number;
  details?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  documentType: DocumentType;
  action: 'upload' | 'process' | 'verify' | 'review';
  status: 'success' | 'failure';
  details: string;
}

export interface AppState {
  currentStep: 'upload' | 'processing' | 'results';
  documentFile: DocumentFile | null;
  documentType: DocumentType | null;
  processingProgress: number;
  verificationResult: VerificationResult | null;
  auditLog: AuditLogEntry[];
  error: string | null;
}
