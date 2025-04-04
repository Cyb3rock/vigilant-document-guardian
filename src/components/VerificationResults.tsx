
import { CheckCircle, AlertCircle, XCircle, FileText, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VerificationResult, ExtractedData } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface VerificationResultsProps {
  result: VerificationResult;
  onReset: () => void;
}

const VerificationResults = ({ result, onReset }: VerificationResultsProps) => {
  const { toast } = useToast();

  const getStatusDisplay = () => {
    switch (result.status) {
      case "verified":
        return {
          icon: <CheckCircle className="h-10 w-10 text-green-500" />,
          title: "Verified",
          description: "This document appears to be authentic",
          color: "bg-green-500"
        };
      case "suspicious":
        return {
          icon: <AlertCircle className="h-10 w-10 text-yellow-500" />,
          title: "Suspicious",
          description: "This document has some suspicious elements",
          color: "bg-yellow-500"
        };
      case "rejected":
        return {
          icon: <XCircle className="h-10 w-10 text-red-500" />,
          title: "Rejected",
          description: "This document appears to be fraudulent",
          color: "bg-red-500"
        };
      default:
        return {
          icon: <FileText className="h-10 w-10 text-gray-500" />,
          title: "Unknown",
          description: "Verification status unknown",
          color: "bg-gray-500"
        };
    }
  };

  const copyToClipboard = (data: ExtractedData) => {
    const text = Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
      
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Document data has been copied to your clipboard",
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Failed to copy data to clipboard",
        variant: "destructive",
      });
    });
  };

  const status = getStatusDisplay();
  const date = new Date(result.timestamp).toLocaleString();

  return (
    <Card className="w-full">
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            {status.icon}
            <div className="ml-3">
              <h2 className="text-2xl font-bold">{status.title}</h2>
              <p className="text-gray-500">{status.description}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-right mr-4">
              <p className="text-sm text-gray-500">Verification Score</p>
              <p className="text-xl font-bold">{result.overallScore}%</p>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: status.color }}>
              {result.overallScore}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Document Type</p>
            <p className="font-medium capitalize">{result.documentType.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-gray-500">Verification ID</p>
            <p className="font-medium">{result.id.slice(0, 8)}</p>
          </div>
          <div>
            <p className="text-gray-500">Verification Date</p>
            <p className="font-medium">{date}</p>
          </div>
          <div>
            <p className="text-gray-500">Suspicious Areas</p>
            <p className="font-medium">{result.suspiciousAreas.length}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Extracted Data</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(result.extractedData)}
            className="flex items-center"
          >
            <Copy className="h-4 w-4 mr-1" /> Copy
          </Button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {Object.entries(result.extractedData).map(([key, value]) => (
              <div key={key} className="py-1">
                <p className="text-sm text-gray-500">{key}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex justify-end">
          <Button onClick={onReset}>Verify Another Document</Button>
        </div>
      </div>
    </Card>
  );
};

export default VerificationResults;
