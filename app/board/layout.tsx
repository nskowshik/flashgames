import React from "react";

export default function BoardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {children}
        </div>
    );
}