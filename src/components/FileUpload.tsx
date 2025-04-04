
import { useState, useRef } from "react";
import { Upload, FileText, ImageIcon, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DocumentType } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onDocumentTypeSelected: (type: DocumentType) => void;
}

const FileUpload = ({ onFileSelected, onDocumentTypeSelected }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const documentTypes: { value: DocumentType; label: string }[] = [
    { value: "passport", label: "Passport" },
    { value: "id_card", label: "ID Card" },
    { value: "driver_license", label: "Driver's License" },
    { value: "certificate", label: "Certificate" },
    { value: "diploma", label: "Diploma" },
    { value: "other", label: "Other Document" },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    // Check if the file is an image or PDF
    if (!file.type.match('image.*') && file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or PDF document",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the file is too large (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleTypeChange = (type: DocumentType) => {
    setSelectedType(type);
    onDocumentTypeSelected(type);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setSelectedType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Document for Verification</h2>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
          ? "border-primary bg-primary/5" 
          : selectedFile 
            ? "border-green-500 bg-green-50" 
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="mb-4 flex items-center">
              {selectedFile.type.includes("image") ? (
                <ImageIcon className="h-8 w-8 text-green-500 mr-2" />
              ) : (
                <FileText className="h-8 w-8 text-green-500 mr-2" />
              )}
              <span className="font-medium">{selectedFile.name}</span>
              <button
                onClick={handleClearFile}
                className="ml-2 p-1 rounded-full hover:bg-gray-200"
                aria-label="Remove file"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            
            <div className="w-full max-w-xs mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type:
              </label>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                  value={selectedType || ""}
                  onChange={(e) => handleTypeChange(e.target.value as DocumentType)}
                  required
                >
                  <option value="" disabled>Select document type</option>
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            <Button 
              type="button" 
              onClick={() => {
                if (!selectedType) {
                  toast({
                    title: "Document type required",
                    description: "Please select the type of document you are uploading",
                    variant: "destructive",
                  });
                  return;
                }
                toast({
                  title: "Document ready",
                  description: "Your document has been uploaded successfully",
                });
              }}
              disabled={!selectedType}
              className="mt-2"
            >
              Continue with Verification
            </Button>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-lg font-medium mb-1">
                Drag & drop your document here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Support for JPG, PNG, and PDF (max 10MB)
              </p>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Select File
              </Button>
            </label>
          </>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p className="mb-1">✓ Secure document handling</p>
        <p className="mb-1">✓ Advanced forgery detection</p>
        <p>✓ Fast and accurate verification</p>
      </div>
    </Card>
  );
};

export default FileUpload;
