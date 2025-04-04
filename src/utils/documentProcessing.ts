
import { DocumentFile, DocumentType, ExtractedData, SuspiciousArea } from "@/types";

/**
 * Simulates document preprocessing like enhancement and normalization
 */
export const preprocessDocument = async (documentFile: DocumentFile): Promise<boolean> => {
  // In a real implementation, this would perform image processing
  console.log("Preprocessing document:", documentFile.file.name);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return true;
};

/**
 * Simulates OCR and data extraction from a document
 */
export const extractDocumentData = async (
  documentFile: DocumentFile, 
  documentType: DocumentType
): Promise<ExtractedData> => {
  console.log(`Extracting data from ${documentType}:`, documentFile.file.name);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock data based on document type
  switch(documentType) {
    case 'passport':
      return {
        'Document Type': 'Passport',
        'Document Number': 'P12345678',
        'Issuing Country': 'United States',
        'Full Name': 'John Smith',
        'Date of Birth': '15/04/1985',
        'Date of Issue': '10/01/2018',
        'Date of Expiry': '09/01/2028',
        'Gender': 'M',
        'Nationality': 'USA',
      };
    case 'id_card':
      return {
        'Document Type': 'National ID Card',
        'Document Number': 'ID987654321',
        'Full Name': 'Sarah Johnson',
        'Date of Birth': '22/07/1990',
        'Date of Issue': '05/03/2019',
        'Date of Expiry': '04/03/2029',
        'Address': '123 Main St, Anytown, ST 12345',
      };
    case 'driver_license':
      return {
        'Document Type': 'Driver License',
        'License Number': 'DL5432109',
        'Class': 'C',
        'Full Name': 'Michael Brown',
        'Date of Birth': '30/11/1982',
        'Date of Issue': '15/05/2020',
        'Date of Expiry': '29/11/2024',
        'Address': '456 Oak Ave, Somewhere, ST 54321',
        'Restrictions': 'None',
      };
    default:
      return {
        'Document Type': documentType,
        'Document Number': 'Unknown',
        'Full Name': 'Unknown',
        'Date of Issue': 'Unknown',
      };
  }
};

/**
 * Simulates template matching against known authentic templates
 */
export const matchTemplate = async (
  documentFile: DocumentFile, 
  documentType: DocumentType
): Promise<number> => {
  console.log(`Matching ${documentType} against templates:`, documentFile.file.name);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  // Return a confidence score between 0-100
  // In a real implementation, this would compare against reference templates
  return Math.floor(Math.random() * 30) + 70; // Random score between 70-99
};

/**
 * Simulates detection of potential forgery indicators
 */
export const detectForgeryIndicators = async (
  documentFile: DocumentFile
): Promise<SuspiciousArea[]> => {
  console.log("Analyzing for forgery indicators:", documentFile.file.name);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2200));
  
  // For demo purposes, sometimes return suspicious areas
  const shouldHaveSuspiciousAreas = Math.random() > 0.5;
  
  if (!shouldHaveSuspiciousAreas) {
    return [];
  }
  
  // Generate 1-3 random suspicious areas
  const numAreas = Math.floor(Math.random() * 3) + 1;
  const areas: SuspiciousArea[] = [];
  
  const types = ['font_inconsistency', 'digital_alteration', 'layout_anomaly', 'security_feature'] as const;
  const descriptions = {
    font_inconsistency: 'Font style inconsistent with document standard',
    digital_alteration: 'Possible digital manipulation detected',
    layout_anomaly: 'Element position deviates from template',
    security_feature: 'Missing or altered security feature'
  };
  
  for (let i = 0; i < numAreas; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    
    areas.push({
      id: `area-${i}`,
      x: Math.floor(Math.random() * 70) + 10, // 10-80%
      y: Math.floor(Math.random() * 70) + 10, // 10-80%
      width: Math.floor(Math.random() * 20) + 10, // 10-30%
      height: Math.floor(Math.random() * 20) + 5, // 5-25%
      type,
      confidence: Math.floor(Math.random() * 40) + 60, // 60-99%
      description: descriptions[type]
    });
  }
  
  return areas;
};

/**
 * Simulates content validation 
 */
export const validateContent = async (
  extractedData: ExtractedData,
  documentType: DocumentType
): Promise<{isValid: boolean, score: number, details: string}> => {
  console.log(`Validating content for ${documentType}`);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1700));
  
  // Check for expiry date if available
  let details = "";
  
  if (extractedData['Date of Expiry']) {
    try {
      const parts = extractedData['Date of Expiry'].split('/');
      const expiryDate = new Date(
        parseInt(parts[2]), // year
        parseInt(parts[1]) - 1, // month (0-based)
        parseInt(parts[0]) // day
      );
      
      if (expiryDate < new Date()) {
        details += "Document is expired. ";
      }
    } catch (e) {
      details += "Could not parse expiration date. ";
    }
  }
  
  // Randomly decide validity for demo purposes
  const isValid = Math.random() > 0.3;
  const score = isValid ? 
    Math.floor(Math.random() * 20) + 80 : // 80-99 if valid
    Math.floor(Math.random() * 30) + 40;  // 40-69 if invalid
  
  if (!isValid) {
    details += "Some fields do not match expected format or contain inconsistent information.";
  } else if (details === "") {
    details = "All content validated successfully.";
  }
  
  return { isValid, score, details };
};
