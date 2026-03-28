"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES: Record<string, string[]> = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "model/step": [".step", ".stp"],
    "application/sla": [".stl"],
    "application/iges": [".iges", ".igs"],
    "image/vnd.dwg": [".dwg"],
    "image/vnd.dxf": [".dxf"],
    "application/octet-stream": [".step", ".stp", ".stl", ".dwg", ".dxf", ".iges", ".igs"],
};

type FileStatus = "pending" | "uploading" | "done" | "error";

interface FileEntry {
    file: File;
    status: FileStatus;
    progress: number;     // 0-100
    fileId?: string;      // set after confirm — the ONLY thing we keep
    error?: string;
}

interface FileDropzoneProps {
    jobId: string;
    onFileIdsChange: (ids: string[]) => void;
}

export const FileDropzone = ({ jobId, onFileIdsChange }: FileDropzoneProps) => {
    const [entries, setEntries] = useState<FileEntry[]>([]);

    // Sync confirmed fileIds to parent after every render
    useEffect(() => {
        const confirmedIds = entries.flatMap((e) => (e.fileId ? [e.fileId] : []));
        onFileIdsChange(confirmedIds);
    }, [entries, onFileIdsChange]);

    // Update a single file entry — never calls parent directly (useEffect handles that)
    const updateEntry = (index: number, patch: Partial<FileEntry>) => {
        setEntries((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], ...patch };
            return next;
        });
    };

    const uploadFile = async (file: File, index: number) => {
        updateEntry(index, { status: "uploading", progress: 0 });

        try {
            // Step 1: Get presigned upload URL
            const presignRes = await fetch(
                `/api/files/presign-upload?filename=${encodeURIComponent(file.name)}&mimeType=${encodeURIComponent(file.type || "application/octet-stream")}`
            );
            if (!presignRes.ok) throw new Error("Failed to get upload URL");
            const { uploadUrl, fileKey } = (await presignRes.json()) as {
                uploadUrl: string;
                fileKey: string;
            };

            // Step 2: Upload directly to S3 with progress tracking via XMLHttpRequest
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("PUT", uploadUrl);
                xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        updateEntry(index, { progress: Math.round((e.loaded / e.total) * 95) });
                    }
                };
                xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`S3 upload failed: ${xhr.status}`)));
                xhr.onerror = () => reject(new Error("Network error during upload"));
                xhr.send(file);
            });

            // Step 3: Confirm with our server — promotes file, validates MIME
            const confirmRes = await fetch("/api/files/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileKey,
                    originalName: file.name,
                    mimeType: file.type || "application/octet-stream",
                    size: file.size,
                    jobId,
                }),
            });

            if (!confirmRes.ok) {
                const data = await confirmRes.json().catch(() => ({}));
                throw new Error(data.error ?? "Confirm failed");
            }

            const { fileId } = (await confirmRes.json()) as { fileId: string };
            updateEntry(index, { status: "done", progress: 100, fileId });
        } catch (err) {
            updateEntry(index, {
                status: "error",
                error: err instanceof Error ? err.message : "Upload failed",
            });
        }
    };

    const onDrop = useCallback(
        (accepted: File[]) => {
            const startIndex = entries.length;
            const newEntries: FileEntry[] = accepted.map((file) => ({
                file,
                status: "pending",
                progress: 0,
            }));
            setEntries((prev) => [...prev, ...newEntries]);
            // Start uploads immediately
            accepted.forEach((file, i) => {
                uploadFile(file, startIndex + i);
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [entries.length, jobId]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_TYPES,
        multiple: true,
    });

    const removeEntry = (index: number) => {
        setEntries((prev) => prev.filter((_, i) => i !== index));
    };

    const formatBytes = (b: number) =>
        b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

    return (
        <div className="space-y-3">
            {/* Drop zone */}
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-none px-6 py-10 text-center cursor-pointer transition-colors",
                    isDragActive
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-400 hover:border-slate-600 hover:bg-slate-50"
                )}
            >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">
                    {isDragActive ? "Drop files here…" : "Drag & drop files, or click to select"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    PDF, JPG, PNG, STEP, STL, DWG, DXF · Max 50MB per file
                </p>
            </div>

            {/* File list */}
            {entries.length > 0 && (
                <ul className="space-y-2">
                    {entries.map((entry, i) => (
                        <li key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-md bg-white">
                            <FileText className="h-5 w-5 text-slate-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700 truncate pr-2">{entry.file.name}</span>
                                    <span className="text-xs text-slate-400 shrink-0">{formatBytes(entry.file.size)}</span>
                                </div>
                                {/* Progress bar */}
                                {(entry.status === "uploading" || entry.status === "done") && (
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all duration-300",
                                                entry.status === "done" ? "bg-emerald-500" : "bg-orange-500"
                                            )}
                                            style={{ width: `${entry.progress}%` }}
                                        />
                                    </div>
                                )}
                                {entry.status === "error" && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                                        <AlertCircle className="h-3 w-3" /> {entry.error}
                                    </p>
                                )}
                            </div>

                            {/* Status icon */}
                            <div className="shrink-0">
                                {entry.status === "done" ? (
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                ) : entry.status === "error" ? (
                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => removeEntry(i)}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
