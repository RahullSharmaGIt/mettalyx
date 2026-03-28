"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, X, Loader2, Check } from "lucide-react";

interface ProfileCardProps {
    title: string;
    children: (editing: boolean, setEditing: (v: boolean) => void) => React.ReactNode;
    onSave?: () => Promise<void>;
    readonlyView?: React.ReactNode;
    hideSaveCancel?: boolean;
}

export const ProfileCard = ({
    title,
    children,
    onSave,
    readonlyView,
    hideSaveCancel = false,
}: ProfileCardProps) => {
    const [editing, setEditing] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const handleSave = () => {
        if (!onSave) return;
        setError(undefined);
        startTransition(async () => {
            try {
                await onSave();
                setSuccess(true);
                setEditing(false);
                setTimeout(() => setSuccess(false), 2500);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Save failed");
            }
        });
    };

    const handleCancel = () => {
        setEditing(false);
        setError(undefined);
    };

    return (
        <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-5">
                <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
                <div className="flex items-center gap-2">
                    {success && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <Check className="h-3.5 w-3.5" /> Saved
                        </span>
                    )}
                    {!editing ? (
                        <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="h-8 gap-1.5 text-slate-600 hover:text-slate-900">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                    ) : !hideSaveCancel ? (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 text-slate-500">
                                <X className="h-3.5 w-3.5 mr-1" /> Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={isPending}
                                className="h-8 bg-slate-900 hover:bg-slate-800 text-white"
                            >
                                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Check className="h-3.5 w-3.5 mr-1" />}
                                Save
                            </Button>
                        </div>
                    ) : null}
                </div>
            </CardHeader>

            {error && (
                <div className="mx-5 mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}

            <CardContent className="px-5 pb-5">
                {editing ? children(editing, setEditing) : (readonlyView ?? children(editing, setEditing))}
            </CardContent>
        </Card>
    );
};
