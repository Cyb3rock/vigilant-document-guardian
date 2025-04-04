
import { useState, useEffect } from "react";
import { Search, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentFile, SuspiciousArea } from "@/types";

interface DocumentPreviewProps {
  document: DocumentFile;
  suspiciousAreas?: SuspiciousArea[];
  isProcessing?: boolean;
  processingProgress?: number;
}

const DocumentPreview = ({
  document,
  suspiciousAreas = [],
  isProcessing = false,
  processingProgress = 0,
}: DocumentPreviewProps) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showAreas, setShowAreas] = useState(true);

  // Reset zoom and rotation when document changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
  }, [document.id]);

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  const getAreaColor = (type: SuspiciousArea['type']) => {
    switch (type) {
      case 'font_inconsistency':
        return 'border-yellow-500';
      case 'digital_alteration':
        return 'border-red-500';
      case 'layout_anomaly':
        return 'border-orange-500';
      case 'security_feature':
        return 'border-purple-500';
      default:
        return 'border-red-500';
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Document Preview</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={zoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={zoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={rotate}
            title="Rotate"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          {suspiciousAreas.length > 0 && (
            <Button
              variant={showAreas ? "default" : "outline"}
              size="icon"
              onClick={() => setShowAreas(!showAreas)}
              title="Toggle suspicious areas"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="relative h-[400px] overflow-auto flex items-center justify-center bg-gray-100 p-4">
        <div
          className="document-container"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: "transform 0.3s ease",
          }}
        >
          <img
            src={document.preview}
            alt="Document preview"
            className="max-w-full"
            style={{ maxHeight: "700px" }}
          />

          {showAreas &&
            suspiciousAreas.map((area) => (
              <div
                key={area.id}
                className={`highlight-area ${getAreaColor(area.type)}`}
                style={{
                  left: `${area.x}%`,
                  top: `${area.y}%`,
                  width: `${area.width}%`,
                  height: `${area.height}%`,
                }}
                title={`${area.description} (Confidence: ${area.confidence}%)`}
              />
            ))}
        </div>

        {isProcessing && (
          <div className="processing-overlay">
            <div className="animate-rotate-slow mb-4">
              <Search className="h-12 w-12" />
            </div>
            <p className="text-lg font-semibold mb-2">Processing Document</p>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {suspiciousAreas.length > 0 && (
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
          <p className="text-sm font-medium text-yellow-800 mb-1">
            Suspicious Areas Detected
          </p>
          <p className="text-xs text-yellow-700">
            {suspiciousAreas.length} potential issues identified. Hover over the highlighted areas for details.
          </p>
        </div>
      )}
    </Card>
  );
};

export default DocumentPreview;
