import { sql } from "@vercel/postgres";
import React from "react";
import { Button } from "@/components/ui/button"
 


type Message = {
  id: number;
  user_id: string;
  message: string;
};

export default async function MessagesPage(): Promise<JSX.Element> {
  const { rows } = await sql<Message[]>`SELECT * FROM MESSAGES`;

  console.log(rows);
  return <Button>Button</Button>
 
}




