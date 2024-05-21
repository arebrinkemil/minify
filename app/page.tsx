'use client';
import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Input } from '../components/ui/input';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from '@hookform/resolvers/zod';

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
    <div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Paste your link here..." type='email' />
              </FormControl>
              <Select defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How long should link be active?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='24'>24 hours</SelectItem>
                  <SelectItem value='48'>48 hours</SelectItem>
                  <SelectItem value='200'>200 hours</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    <div className="pt-10">
      <Input placeholder="This is where your new link will arrive"/>
    </div>
    </div>
  )
};

export default HomePage;