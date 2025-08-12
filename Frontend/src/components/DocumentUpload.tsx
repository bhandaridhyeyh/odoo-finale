import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { DocumentsAPI } from "@/api/documents";

export default function DocumentUpload({ tripId }: { tripId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedDoc = await DocumentsAPI.upload(tripId, file);
      console.log("Uploaded document:", uploadedDoc);
      alert("Document uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload document.");
    }

    // Reset the file input so the same file can be re-uploaded if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="hidden"
        ref={fileInputRef}
        onChange={handleUpload}
      />
      <Button variant="outline" size="sm" onClick={handleFileSelect}>
        <Upload className="w-4 h-4 mr-2" /> Upload
      </Button>
    </>
  );
}
