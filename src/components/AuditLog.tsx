
import { Clock, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuditLogEntry } from "@/types";

interface AuditLogProps {
  entries: AuditLogEntry[];
}

const AuditLog = ({ entries }: AuditLogProps) => {
  if (entries.length === 0) {
    return (
      <Card className="w-full p-6">
        <h3 className="font-semibold mb-4">Verification History</h3>
        <div className="text-center py-10 text-gray-500">
          <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>No verification history yet</p>
        </div>
      </Card>
    );
  }

  const getActionIcon = (action: AuditLogEntry["action"]) => {
    switch (action) {
      case "upload":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "process":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "verify":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "review":
        return <AlertTriangle className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: AuditLogEntry["status"]) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Success
          </span>
        );
      case "failure":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            Failure
          </span>
        );
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Card className="w-full p-6">
      <h3 className="font-semibold mb-4">Verification History</h3>

      <div className="space-y-4">
        {entries.slice().reverse().map((entry) => (
          <div key={entry.id}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">{getActionIcon(entry.action)}</div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">
                    {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}{" "}
                    <span className="font-normal text-gray-500">
                      {entry.documentType.replace("_", " ")}
                    </span>
                  </p>
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500 mr-2">
                      {formatTimestamp(entry.timestamp)}
                    </p>
                    {getStatusBadge(entry.status)}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{entry.details}</p>
              </div>
            </div>
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AuditLog;
