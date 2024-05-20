'use client';
import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Input } from "postcss";
import { Button } from "@/components/ui/button";
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})
 
const HomePage = () => {

const form = useForm<z.infer<typeof FormSchema>>({
  resolver: zodResolver(FormSchema),
})

const onSubmit = () => {
  console.log('submitted')
}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input placeholder="hej" type='email' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
};

export default HomePage;