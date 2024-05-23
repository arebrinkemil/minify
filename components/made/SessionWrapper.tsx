"use client"

import { SessionProvider } from 'next-auth/react';
import { FC, ReactNode } from 'react';

type SessionWrapperProps = {
    children: ReactNode;
};

const SessionWrapper: FC<SessionWrapperProps> = ({ children }) => {
    return <SessionProvider>
        {children}
    </SessionProvider>
};

export default SessionWrapper;