"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

//TODO: This should probably be refactored because with next its best to use server components as much as possible. We dont need the entire page to useclient, just the form: https://youtu.be/nSfu7sHPE9M?si=qnwOhZfsAV30sLE-&t=150

/* Zod Form Schema */
const formSchema = z.object({
  content: z.string().min(5, { message: "Must be 5 of more characters long" }),
  email: z.optional(z.string()),
});

export default function SubmissionForm() {
  /* React Hook Form */
  // uses the useForm hook from react-hook-form to handle state/validation/submission
  // uses zod to define the form types in typescript
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      email: "",
    },
  });

  /* Submit Handler */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      /* NOTES: fetch sends the request, but what is returned is a response, hence the name const res
      the response contains metadata about the response such as status code, headers, and actual data. 
      This is why we call const data to get the response object and extract the data from it */
      const res = await fetch(`/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values), // notes: values comes from shadcn form setup
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      console.log("Submitted Successfully: ", data);
    } catch (error) {
      console.error("fetch error", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Write here</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about a time when a strangers random act of kindness impacted your life"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>form description</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Give us your email if you want to be notified when your post is live"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
