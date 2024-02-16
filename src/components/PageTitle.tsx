import React, { type ReactNode } from 'react';

function PageTitle({ children }: { readonly children: ReactNode }) {
    return (
        <h1 className="justify-center py-2 text-center align-middle font-mono text-2xl font-bold tracking-wide text-foreground">
            {children}
        </h1>
    );
}

export default PageTitle;
