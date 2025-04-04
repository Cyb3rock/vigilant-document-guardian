
import { v4 as uuidv4 } from 'uuid';
import { 
  DocumentFile, 
  DocumentType, 
  VerificationResult, 
  VerificationStep, 
  AuditLogEntry,
  ExtractedData,
  SuspiciousArea
} from '@/types';
import { 
  preprocessDocument, 
  extractDocumentData, 
  matchTemplate, 
  detectForgeryIndicators, 
  validateContent 
} from './documentProcessing';

/**
 * Identifies document type based on file characteristics
 */
export const identifyDocumentType = (file: File): DocumentType => {
  // In a real implementation, this would analyze the document
  // For demo purposes, return a random document type
  const documentTypes: DocumentType[] = [
    'passport', 'id_card', 'driver_license', 'certificate', 'diploma', 'other'
  ];
  
  return documentTypes[Math.floor(Math.random() * 3)]; // Just use the first 3 for demo
};

/**
 * Creates a file preview URL
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Add an entry to the audit log
 */
export const createAuditLogEntry = (
  documentType: DocumentType | null,
  action: AuditLogEntry['action'],
  status: AuditLogEntry['status'],
  details: string
): AuditLogEntry => {
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    documentType: documentType || 'other',
    action,
    status,
    details
  };
};

/**
 * Main verification process
 */
export const verifyDocument = async (
  documentFile: DocumentFile,
  documentType: DocumentType,
  updateProgress: (progress: number) => void,
  updateSteps: (steps: VerificationStep[]) => void
): Promise<VerificationResult> => {
  // Initialize verification steps
  const steps: VerificationStep[] = [
    {
      id: uuidv4(),
      name: 'Image Pre-processing',
      description: 'Enhancing document image quality',
      status: 'pending',
      score: 0
    },
    {
      id: uuidv4(),
      name: 'OCR & Data Extraction',
      description: 'Converting image to text and extracting data',
      status: 'pending',
      score: 0
    },
    {
      id: uuidv4(),
      name: 'Template Matching',
      description: 'Comparing with authentic document templates',
      status: 'pending',
      score: 0
    },
    {
      id: uuidv4(),
      name: 'Forgery Detection',
      description: 'Analyzing for signs of tampering',
      status: 'pending',
      score: 0
    },
    {
      id: uuidv4(),
      name: 'Content Validation',
      description: 'Validating document data consistency',
      status: 'pending',
      score: 0
    }
  ];
  
  updateSteps([...steps]);
  updateProgress(5);
  
  // Step 1: Pre-processing
  steps[0].status = 'processing';
  updateSteps([...steps]);
  
  try {
    await preprocessDocument(documentFile);
    steps[0].status = 'completed';
    steps[0].score = 100;
  } catch (error) {
    steps[0].status = 'failed';
    steps[0].score = 0;
    steps[0].details = 'Failed to preprocess document image';
  }
  
  updateSteps([...steps]);
  updateProgress(20);
  
  // Step 2: OCR & Data Extraction
  steps[1].status = 'processing';
  updateSteps([...steps]);
  
  let extractedData: ExtractedData = {};
  try {
    extractedData = await extractDocumentData(documentFile, documentType);
    steps[1].status = 'completed';
    steps[1].score = 95;
  } catch (error) {
    steps[1].status = 'failed';
    steps[1].score = 0;
    steps[1].details = 'Failed to extract data from document';
  }
  
  updateSteps([...steps]);
  updateProgress(40);
  
  // Step 3: Template Matching
  steps[2].status = 'processing';
  updateSteps([...steps]);
  
  let templateScore = 0;
  try {
    templateScore = await matchTemplate(documentFile, documentType);
    steps[2].status = 'completed';
    steps[2].score = templateScore;
  } catch (error) {
    steps[2].status = 'failed';
    steps[2].score = 0;
    steps[2].details = 'Failed to match document against templates';
  }
  
  updateSteps([...steps]);
  updateProgress(60);
  
  // Step 4: Forgery Detection
  steps[3].status = 'processing';
  updateSteps([...steps]);
  
  let suspiciousAreas: SuspiciousArea[] = [];
  try {
    suspiciousAreas = await detectForgeryIndicators(documentFile);
    steps[3].status = 'completed';
    steps[3].score = suspiciousAreas.length > 0 ? 
      Math.max(0, 100 - suspiciousAreas.length * 25) : 100;
    steps[3].details = suspiciousAreas.length > 0 ? 
      `Detected ${suspiciousAreas.length} suspicious area(s)` : 
      'No suspicious areas detected';
  } catch (error) {
    steps[3].status = 'failed';
    steps[3].score = 0;
    steps[3].details = 'Failed to analyze document for forgery indicators';
  }
  
  updateSteps([...steps]);
  updateProgress(80);
  
  // Step 5: Content Validation
  steps[4].status = 'processing';
  updateSteps([...steps]);
  
  let contentValidation = { isValid: false, score: 0, details: '' };
  try {
    contentValidation = await validateContent(extractedData, documentType);
    steps[4].status = 'completed';
    steps[4].score = contentValidation.score;
    steps[4].details = contentValidation.details;
  } catch (error) {
    steps[4].status = 'failed';
    steps[4].score = 0;
    steps[4].details = 'Failed to validate document content';
  }
  
  updateSteps([...steps]);
  updateProgress(100);
  
  // Calculate overall score
  const completedSteps = steps.filter(step => step.status === 'completed');
  const overallScore = completedSteps.length > 0 
    ? Math.round(completedSteps.reduce((sum, step) => sum + step.score, 0) / completedSteps.length) 
    : 0;
  
  // Determine verification status
  let status: VerificationResult['status'] = 'rejected';
  if (overallScore >= 85) {
    status = 'verified';
  } else if (overallScore >= 65) {
    status = 'suspicious';
  }
  
  // Return verification result
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    documentType,
    overallScore,
    extractedData,
    verificationSteps: steps,
    suspiciousAreas,
    status
  };
};
