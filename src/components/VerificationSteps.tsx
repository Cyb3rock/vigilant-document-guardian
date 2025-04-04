
import { Check, Clock, Loader2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VerificationStep as Step } from "@/types";

interface VerificationStepsProps {
  steps: Step[];
}

const VerificationSteps = ({ steps }: VerificationStepsProps) => {
  const getStatusIcon = (status: Step["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-gray-400" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: Step["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-500 border-gray-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-full p-4">
      <h3 className="font-semibold mb-4">Verification Process</h3>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-1.5 rounded-full mr-3 ${getStatusClass(step.status)}`}>
                  {getStatusIcon(step.status)}
                </div>
                <div>
                  <p className="font-medium">{step.name}</p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
              
              {step.status !== "pending" && (
                <div className="flex items-center space-x-3">
                  {step.status === "completed" && (
                    <div className="text-sm font-medium">
                      Score: {step.score}%
                    </div>
                  )}
                  {step.status === "processing" ? (
                    <div className="w-16 h-2">
                      <Progress 
                        value={undefined} 
                        className="animate-pulse" 
                      />
                    </div>
                  ) : step.status !== "pending" ? (
                    <div className="w-16 h-2">
                      <Progress 
                        value={step.score} 
                        className={getScoreColor(step.score)} 
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            
            {step.details && (step.status === "completed" || step.status === "failed") && (
              <div className={`text-sm p-2 rounded ml-10 ${
                step.status === "failed" 
                  ? "bg-red-50 text-red-700" 
                  : "bg-gray-50 text-gray-700"
              }`}>
                {step.details}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default VerificationSteps;
