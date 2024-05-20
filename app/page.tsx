import { sql } from "@vercel/postgres";
import React from "react";

type Message = {
  id: number;
  user_id: string;
  message: string;
};

export default async function MessagesPage(): Promise<JSX.Element> {
  const { rows } = await sql<Message[]>`SELECT * FROM MESSAGES`;

  console.log(rows);

  return <div></div>;
}
