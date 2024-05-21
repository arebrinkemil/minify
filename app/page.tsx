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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
    <div className="text-center sm:mt-10">
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      Minify
    </h2>
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      URL Shortener
    </h4>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
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
    <Accordion type="single" collapsible className="pt-8">
      <AccordionItem value="item-1">
        <AccordionTrigger>What happens to my link</AccordionTrigger>
          <AccordionContent style={{maxWidth: '320px'}}>
            All links are stored in our Database and then removed when their timer runs out.
          </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>For how long is it active?</AccordionTrigger>
          <AccordionContent>
            For as long as you choose in the form field!
          </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Will anyone else have access to my link?</AccordionTrigger>
          <AccordionContent style={{maxWidth: '320px'}}>
            No your link is secure with us and will not be accessible for other users.
          </AccordionContent>
      </AccordionItem>
    </Accordion>



    </div>
  )
};

export default HomePage;
