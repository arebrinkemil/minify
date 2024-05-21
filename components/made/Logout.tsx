"use client"

import { ButtonHTMLAttributes, FC } from 'react';
import { signOut } from "next-auth/react";

type LogoutProps = ButtonHTMLAttributes<HTMLButtonElement> & {}

const Logout: FC<LogoutProps> = ({ children, ...props }) => {
  return <button onClick={() => signOut()} {...props}>{children}</button>;
};

export default Logout;