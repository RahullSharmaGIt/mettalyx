import { Menu, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export const DashboardHeader = () => {
    return (
        <header className="flex items-center justify-between p-4 border-b-2 border-slate-900 bg-white sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                    <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
                    OEM Dashboard
                </h1>
            </div>
            {/* <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full border-2 border-slate-900 bg-slate-100 shadow-[2px_2px_0px_#0F172A] overflow-hidden">
                    <User className="h-5 w-5" />
                </Button>
            </div> */}
            <Link href="/oem/post-job">
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                </Button>
            </Link>
        </header>
    );
};
