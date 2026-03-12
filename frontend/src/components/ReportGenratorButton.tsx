import { Button } from "@/components/ui/button";
import { Loader2, Download, FileText } from "lucide-react";
import { useReportPolling } from "@/hooks/useReports";

export function ReportGenerator({ projectId }: { projectId: number }) {
  const { generate, isGenerating, reportData } = useReportPolling(projectId);

  const isSuccess = reportData?.status === "SUCCESS";

  return (
    <div className="flex flex-col gap-3 p-6 border rounded-xl bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Project Export</h3>
          <p className="text-xs text-muted-foreground">Download all tasks and analytics in CSV format.</p>
        </div>
      </div>

      <div className="mt-2">
        {isSuccess ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800" asChild>
              <a href={`${process.env.NEXT_PUBLIC_API_URL}/${reportData.result?.file_path}`} download>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </a>
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full"
            onClick={() => generate()} 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Report...
              </>
            ) : (
              "Generate CSV"
            )}
          </Button>
        )}
      </div>

      {isGenerating && (
        <p className="text-[10px] text-center text-muted-foreground animate-pulse">
          Fetching data from server, please wait...
        </p>
      )}
    </div>
  );
}