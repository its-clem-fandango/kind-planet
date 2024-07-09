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

/* Zod Form Schema */
const formSchema = z.object({
  content: z.string().min(5, { message: "Must be 5 of more characters long" }),
  email: z.optional(z.string()),
});

export default function SubmissionForm() {
  /* React Hook Form */
  // uses the useForm function from react hook form to handle state/validation/submission
  // uses zod to define the form types in typescript
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      email: "",
    },
  });

  /* Submit Handler */
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
