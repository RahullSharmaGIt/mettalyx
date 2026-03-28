"use client";

import React, { useState } from "react";
import { UploadCloud, X, File as FileIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    onUpload: (urls: string[]) => void;
    multiple?: boolean;
    value?: string[];
    title?: string;
    accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onUpload,
    multiple = false,
    value = [],
    title = "Upload Document",
    accept = "application/pdf,image/*"
}) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);

        // Simulated upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulated upload URLs
        const newFiles = Array.from(e.target.files).map(
            file => `https://dummy-storage.com/${Date.now()}-${file.name}`
        );

        const updatedFiles = multiple ? [...value, ...newFiles] : [newFiles[0]];
        onUpload(updatedFiles);
        setIsUploading(false);
    };

    const removeFile = (urlToRemove: string) => {
        onUpload(value.filter(url => url !== urlToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 border-slate-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 mb-3 text-slate-500 animate-spin" />
                        ) : (
                            <UploadCloud className="w-8 h-8 mb-3 text-slate-500" />
                        )}
                        <p className="mb-2 text-sm text-slate-500 font-semibold">
                            {isUploading ? "Uploading..." : <><span className="font-bold text-slate-900">Click to upload</span> or drag and drop</>}
                        </p>
                        <p className="text-xs text-slate-500">{title}</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        multiple={multiple}
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </label>
            </div>

            {value.length > 0 && (
                <div className="space-y-2">
                    {value.map((url, i) => {
                        const fileName = url.split("-").pop() || `File ${i + 1}`;
                        return (
                            <div key={url} className="flex items-center justify-between p-2 text-sm border rounded-md bg-white">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                    <span className="truncate max-w-[200px]">{fileName}</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-500 hover:text-red-500"
                                    onClick={() => removeFile(url)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
