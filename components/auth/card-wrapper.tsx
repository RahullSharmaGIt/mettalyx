"use client";

import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] border-2 border-slate-900 shadow-neo rounded-none bg-white">
      <CardHeader className="border-b-2 border-slate-900 bg-industrial-orange py-8">
        <div className="w-full flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">
            Auth
          </h1>
          <p className="font-mono text-slate-900 font-bold uppercase text-sm mt-2">
            {headerLabel}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        {children}
      </CardContent>
      <CardFooter className="border-t-2 border-slate-900 bg-slate-50 py-6">
        <a href={backButtonHref} className="text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-cyan-600 transition-colors w-full text-center">
            {backButtonLabel}
        </a>
      </CardFooter>
    </Card>
  );
};
