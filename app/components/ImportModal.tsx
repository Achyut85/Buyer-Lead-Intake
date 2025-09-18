"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload, FileText, CheckCircle, AlertCircle, Download } from "lucide-react";
import { DownloadTestCsv } from "./DownloadTestCsv";

export function ImportModal() {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [importResult, setImportResult] = useState<{
    inserted?: number;
    updated?: number;
  } | null>(null);

  const resetState = () => {
    setFile(null);
    setErrors([]);
    setImportResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    
    // Clear previous errors and results when new file is selected
    if (selectedFile) {
      setErrors([]);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setErrors([]);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/buyers/import", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.errors?.length) {
        setErrors(data.errors);
      } else {
        setImportResult({
          inserted: data.inserted,
          updated: data.updated
        });
      }
    } catch (err) {
      console.error("Import error:", err);
      setErrors([{ 
        row: "-", 
        message: err instanceof Error ? err.message : "Unexpected error occurred"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      // Reset state after a brief delay to avoid visual flash
      setTimeout(resetState, 300);
    }
  };

  const isSuccess = importResult && !errors.length;
  const hasErrors = errors.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"  className="w-full sm:w-auto h-11 px-6 rounded-2xl border-2 border-gray-200/80 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
          <Upload className="h-4 w-4" />
          Import Data
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full sm:w-[90%]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import Buyers from CSV
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* File Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select CSV File</label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2.5 gap-2">
              <div className="relative sm:flex-1 mt-1">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 disabled:opacity-50"
                />
              </div>
            </div>
            {file && (
              <p className="text-xs text-gray-600">
                Selected: {file.name} ({Math.round(file.size / 1024)}KB)
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="order-2 sm:order-1"
            >
              {isSuccess ? "Close" : "Cancel"}
            </Button>
            <Button
              type="button"
              onClick={handleImport}
              disabled={!file || loading}
              className="order-1 sm:order-2"
            >
              {loading ? "Importing..." : "Start Import"}
            </Button>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">Import Successful!</p>
                <p className="text-sm text-green-700">
                  {importResult.inserted && `${importResult.inserted} buyers imported`}
                  {importResult.updated && `, ${importResult.updated} updated`}
                </p>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {hasErrors && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-red-800 mb-2">
                  Import failed with validation errors ({errors.length} rows affected):
                </p>
                
                {/* Show common error patterns */}
                {errors.length > 0 && errors[0].message?.includes('expected string, received undefined') && (
                  <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                    <p className="font-medium text-amber-800">Common Issues Detected:</p>
                    <ul className="text-amber-700 mt-1 space-y-0.5">
                      <li>• Missing required fields (name, email)</li>
                      <li>• Empty cells in required columns</li>
                      <li>• Invalid dropdown values - must match exactly</li>
                    </ul>
                  </div>
                )}
                
                <div className="max-h-32 overflow-y-auto">
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium text-red-800 hover:text-red-900">
                      View detailed error messages ({errors.length} errors)
                    </summary>
                    <ul className="text-red-700 space-y-1 mt-2 pl-2">
                      {errors.slice(0, 10).map((err, i) => (
                        <li key={i} className="text-xs">
                          <span className="font-medium">Row {err.row}:</span> {err.message}
                        </li>
                      ))}
                      {errors.length > 10 && (
                        <li className="text-xs italic">
                          ... and {errors.length - 10} more errors
                        </li>
                      )}
                    </ul>
                  </details>
                </div>
                
                <div className="mt-3 text-xs text-red-600">
                  <p className="font-medium">💡 Quick Fix Tips:</p>
                  <ul className="mt-1 space-y-0.5">
                    <li>• Ensure all required columns have values</li>
                    <li>• Check dropdown values match exactly (case-sensitive)</li>
                    <li>• Verify column headers are correct</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Import Guidelines */}
          {!isSuccess && !hasErrors && (
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
              <p className="font-medium mb-2">Required CSV Format:</p>
              <div className="space-y-2">
                <div>
                  <p className="font-medium">Required Fields:</p>
                  <ul className="ml-3 space-y-0.5">
                    <li>• <strong>name</strong> - Buyer's full name (text)</li>
                    <li>• <strong>email</strong> - Valid email address (text)</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium">Location (choose one):</p>
                  <ul className="ml-3 space-y-0.5">
                    <li>• Chandigarh, Mohali, Zirakpur, Panchkula, Other</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium">Property Type (choose one):</p>
                  <ul className="ml-3 space-y-0.5">
                    <li>• Apartment, Villa, Plot, Office, Retail</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium">Intent (choose one):</p>
                  <ul className="ml-3 space-y-0.5">
                    <li>• Buy, Rent</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium">Timeline (choose one):</p>
                  <ul className="ml-3 space-y-0.5">
                    <li>• 0-3m, 3-6m, {`>`}6m, Exploring</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium">Source (choose one):</p>
                  <ul className="ml-3 space-y-0.5">
                    <li>• Website, Referral, Walk-in, Call, Other</li>
                  </ul>
                </div>
                
                {/* <div className="mt-2 pt-2 border-t">
                  <p className="font-medium text-amber-600">⚠️ Important:</p>
                  <ul className="ml-3 space-y-0.5 text-amber-700">
                    <li>• All dropdown values must match exactly (case-sensitive)</li>
                    <li>• Empty cells will cause validation errors</li>
                    <li>• Include column headers in the first row</li>
                  </ul>
                  
                  <DownloadTestCsv/>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}