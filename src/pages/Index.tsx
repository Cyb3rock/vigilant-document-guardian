
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from "@/components/FileUpload";
import DocumentPreview from "@/components/DocumentPreview";
import VerificationSteps from "@/components/VerificationSteps";
import VerificationResults from "@/components/VerificationResults";
import AuditLog from "@/components/AuditLog";
import {
  AppState,
  DocumentFile,
  DocumentType,
  VerificationStep,
  VerificationResult,
  AuditLogEntry,
} from "@/types";
import {
  createFilePreview,
  identifyDocumentType,
  verifyDocument,
  createAuditLogEntry,
} from "@/utils/verificationUtils";

const Index = () => {
  const [state, setState] = useState<AppState>({
    currentStep: "upload",
    documentFile: null,
    documentType: null,
    processingProgress: 0,
    verificationResult: null,
    auditLog: [],
    error: null,
  });

  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([]);
  const { toast } = useToast();

  const handleFileSelected = (file: File) => {
    const documentFile: DocumentFile = {
      file,
      preview: createFilePreview(file),
      id: uuidv4(),
    };

    // Auto-identify document type (this would be more sophisticated in a real implementation)
    const documentType = identifyDocumentType(file);

    setState((prev) => ({
      ...prev,
      documentFile,
      documentType,
    }));

    // Log the upload
    const logEntry = createAuditLogEntry(
      documentType,
      "upload",
      "success",
      `Document "${file.name}" uploaded successfully`
    );

    setState((prev) => ({
      ...prev,
      auditLog: [...prev.auditLog, logEntry],
    }));

    toast({
      title: "Document Uploaded",
      description: "Your document has been uploaded successfully",
    });
  };

  const handleDocumentTypeSelected = (type: DocumentType) => {
    setState((prev) => ({
      ...prev,
      documentType: type,
    }));
  };

  const startVerification = () => {
    if (!state.documentFile || !state.documentType) {
      toast({
        title: "Cannot Verify",
        description: "Please upload a document and select its type",
        variant: "destructive",
      });
      return;
    }

    setState((prev) => ({
      ...prev,
      currentStep: "processing",
      processingProgress: 0,
    }));

    // Log the process start
    const logEntry = createAuditLogEntry(
      state.documentType,
      "process",
      "success",
      "Document verification process started"
    );

    setState((prev) => ({
      ...prev,
      auditLog: [...prev.auditLog, logEntry],
    }));

    // Initialize verification steps
    const initialSteps: VerificationStep[] = [];
    setVerificationSteps(initialSteps);

    // Update progress
    const updateProgress = (progress: number) => {
      setState((prev) => ({
        ...prev,
        processingProgress: progress,
      }));
    };

    // Update steps
    const updateSteps = (steps: VerificationStep[]) => {
      setVerificationSteps(steps);
    };

    // Start the verification process
    verifyDocument(
      state.documentFile,
      state.documentType,
      updateProgress,
      updateSteps
    )
      .then((result) => {
        setState((prev) => ({
          ...prev,
          currentStep: "results",
          verificationResult: result,
        }));

        // Log the verification result
        const logEntry = createAuditLogEntry(
          state.documentType!,
          "verify",
          "success",
          `Document verified with score: ${result.overallScore}%. Status: ${result.status}`
        );

        setState((prev) => ({
          ...prev,
          auditLog: [...prev.auditLog, logEntry],
        }));

        toast({
          title: "Verification Complete",
          description: `Document verified with a score of ${result.overallScore}%`,
        });
      })
      .catch((error) => {
        console.error("Verification error:", error);

        setState((prev) => ({
          ...prev,
          currentStep: "upload",
          error: "Verification failed. Please try again.",
        }));

        // Log the error
        const logEntry = createAuditLogEntry(
          state.documentType!,
          "verify",
          "failure",
          "Document verification failed due to an error"
        );

        setState((prev) => ({
          ...prev,
          auditLog: [...prev.auditLog, logEntry],
        }));

        toast({
          title: "Verification Failed",
          description: "There was an error verifying your document. Please try again.",
          variant: "destructive",
        });
      });
  };

  const resetVerification = () => {
    setState((prev) => ({
      ...prev,
      currentStep: "upload",
      documentFile: null,
      documentType: null,
      processingProgress: 0,
      verificationResult: null,
      error: null,
    }));

    setVerificationSteps([]);
  };

  useEffect(() => {
    // If both document and type are selected, we can start verification
    if (
      state.currentStep === "upload" &&
      state.documentFile &&
      state.documentType
    ) {
      startVerification();
    }
  }, [state.documentFile, state.documentType]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-verify-blue">
                Document Guardian
              </h1>
              <p className="text-gray-500">Advanced Document Verification System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {state.currentStep === "upload" && (
          <div className="mb-8">
            <FileUpload
              onFileSelected={handleFileSelected}
              onDocumentTypeSelected={handleDocumentTypeSelected}
            />
          </div>
        )}

        {(state.currentStep === "processing" || state.currentStep === "results") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              {state.documentFile && (
                <DocumentPreview
                  document={state.documentFile}
                  suspiciousAreas={
                    state.verificationResult?.suspiciousAreas || []
                  }
                  isProcessing={state.currentStep === "processing"}
                  processingProgress={state.processingProgress}
                />
              )}
            </div>
            <div>
              {state.currentStep === "processing" && (
                <VerificationSteps steps={verificationSteps} />
              )}
              {state.currentStep === "results" && state.verificationResult && (
                <VerificationResults
                  result={state.verificationResult}
                  onReset={resetVerification}
                />
              )}
            </div>
          </div>
        )}

        <Tabs defaultValue="verification" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="verification">Verification Details</TabsTrigger>
            <TabsTrigger value="history">Verification History</TabsTrigger>
          </TabsList>
          <TabsContent value="verification" className="space-y-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About Document Verification</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Document image enhancement and normalization</li>
                    <li>OCR and structured data extraction</li>
                    <li>Template matching against authentic documents</li>
                    <li>Sophisticated forgery detection algorithms</li>
                    <li>Cross-reference and content validation</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Supported Documents</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Government-issued ID cards</li>
                    <li>Passports and travel documents</li>
                    <li>Driver's licenses</li>
                    <li>Academic certificates and diplomas</li>
                    <li>Corporate and legal documents</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Verification Process</h3>
                <p className="text-gray-700 mb-4">
                  Our advanced verification system analyzes documents through multiple layers 
                  of validation, combining traditional rule-based approaches with machine learning 
                  to detect both common and sophisticated forgery attempts.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-1">Document Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Image enhancement, layout analysis, and security feature detection
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-1">Data Extraction</h4>
                    <p className="text-sm text-gray-600">
                      OCR, key field identification, and structured data extraction
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-1">Forgery Detection</h4>
                    <p className="text-sm text-gray-600">
                      Font analysis, digital alteration detection, and pattern recognition
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <AuditLog entries={state.auditLog} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Document Guardian</h3>
              <p className="text-sm text-gray-400">Advanced Document Verification System</p>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Document Guardian. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
