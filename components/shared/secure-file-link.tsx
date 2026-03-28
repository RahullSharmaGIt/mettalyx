"use client";

import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecureFileLinkProps {
    fileId: string;
    originalName: string;
}

/**
 * Downloads a file by fetching a 10-minute presigned S3 URL from our
 * authenticated API, then immediately opening it in a new tab.
 * The presigned URL is NEVER stored in state — it's consumed once and discarded.
 */
export const SecureFileLink = ({ fileId, originalName }: SecureFileLinkProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const handleDownload = async () => {
        setLoading(true);
        setError(undefined);

        try {
            const res = await fetch(`/api/files/${fileId}/download`);
            if (!res.ok) {
                const body = await res.text();
                throw new Error(body || "Unable to generate download link");
            }
            const { url } = (await res.json()) as { url: string };

            // Open immediately — browser starts download via the presigned URL
            window.open(url, "_blank", "noopener,noreferrer");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Download failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleDownload}
                disabled={loading}
                className="flex items-center gap-2.5 w-full p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="flex-1 text-sm font-medium text-slate-700 truncate">{originalName}</span>
                {loading ? (
                    <Loader2 className="h-4 w-4 text-slate-400 animate-spin shrink-0" />
                ) : (
                    <Download className="h-4 w-4 text-slate-400 shrink-0" />
                )}
            </button>
            {error && (
                <p className="text-xs text-red-500 mt-1 ml-3">⚠ {error}</p>
            )}
        </div>
    );
};
