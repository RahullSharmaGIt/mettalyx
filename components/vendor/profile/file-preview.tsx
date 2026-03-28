"use client";

import { FileText, Image, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
    url: string;
    label?: string;
}

const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
const isPdf = (url: string) => /\.pdf$/i.test(url);

const getFileName = (url: string) => {
    try {
        return decodeURIComponent(url.split("/").pop() ?? url);
    } catch {
        return url;
    }
};

export const FilePreview = ({ url, label }: FilePreviewProps) => {
    const name = label ?? getFileName(url);

    return (
        <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2.5 min-w-0">
                {isImage(url) ? (
                    // Thumbnail for images
                    <div className="relative h-10 w-10 shrink-0 rounded overflow-hidden border border-slate-200 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={name} className="h-full w-full object-cover" />
                    </div>
                ) : (
                    <div className="h-10 w-10 shrink-0 rounded flex items-center justify-center bg-slate-200">
                        {isPdf(url)
                            ? <FileText className="h-5 w-5 text-slate-500" />
                            : <Image className="h-5 w-5 text-slate-500" />}
                    </div>
                )}
                <p className="text-sm text-slate-700 truncate max-w-[200px]">{name}</p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
                <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-slate-500 hover:text-slate-900">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </Button>
                <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-slate-500 hover:text-slate-900">
                    <a href={url} download>
                        <Download className="h-3.5 w-3.5" />
                    </a>
                </Button>
            </div>
        </div>
    );
};
