'use client';
import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FormSchema = z.object({
  link: z.string().min(2, {
    message: "Link must be at least 2 characters.",
  }),
  duration: z.string().min(1, {
    message: "Duration is required."
  }),
  clickAmount: z.string().min(1, {
    message: "Clicks is required."
  })
});

const HomePage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      link: '',
      duration: '',
      clickAmount: '',
    }
  });

  const [shortUrl, setShortUrl] = React.useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await fetch('/api/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          original_url: data.link,
          expires_at: calculateExpiryDate(data.duration),
          max_views: parseInt(data.clickAmount)
        })
      });

      if (!response.ok) {
        throw new Error('Response was not ok');
      }

      const result = await response.json();
      setShortUrl(result.data.short_url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculateExpiryDate = (duration: string) => {
    const now = new Date();
    now.setHours(now.getHours() + parseInt(duration));
    return now.toISOString();
  };

  return (
    <main className="text-center py-[120px] flex flex-col max-w-[500px] mx-auto">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0" >
        Minify
      </h2>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        URL Shortener
      </h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Paste your link here..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Controller
                    name="duration"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="How long should link be active?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 hours</SelectItem>
                          <SelectItem value="48">48 hours</SelectItem>
                          <SelectItem value="200">200 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clickAmount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                <Controller
                    name="clickAmount"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="How many max clicks?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 click</SelectItem>
                          <SelectItem value="10">10 clicks</SelectItem>
                          <SelectItem value="100">100 clicks</SelectItem>
                          <SelectItem value="1000">1000 clicks</SelectItem>
                          <SelectItem value="10000">10 000 clicks</SelectItem>
                          <SelectItem value="99999999">Unlimited amount of clicks</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {shortUrl && (
        <a href={`localhost:3000/url/${shortUrl}`}>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-4">
          Shortened URL: localhost:3000/url/{shortUrl}
        </h4>
        </a>
      )}
      <Accordion type="single" collapsible className="pt-8">
        <AccordionItem value="item-1">
          <AccordionTrigger>What happens to my link</AccordionTrigger>
          <AccordionContent style={{ maxWidth: "320px" }}>
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
          <AccordionContent style={{ maxWidth: "320px" }}>
            No your link is secure with us and will not be accessible for other users.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>What does max amount of clicks mean?</AccordionTrigger>
          <AccordionContent style={{ maxWidth: "320px" }}>
            If your max amount of clicks is 5, after the link has been clicked 5 times it will expire.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default HomePage;
