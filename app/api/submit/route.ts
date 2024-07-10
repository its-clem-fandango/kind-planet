import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";

/* Zod Form Schema */
// NOTES: validating on both the FE and BE ensures data integrity even if frontend is bypassed
const formSchema = z.object({
  content: z.string().min(5, { message: "Must be 5 of more characters long" }),
  email: z.optional(z.string()),
});

//@desc create a new post
//@route POST /api/submit
export async function POST(request: Response) {
  try {
    // Extract the JSON data sent in the request body
    const body = await request.json();

    //Validate the parsed JSON data before saving in DB
    const validatedData = formSchema.parse(body);

    //If validated, save post to DB
    const result = await prisma.post.create({
      data: validatedData,
    });
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    // check for zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    // catch any other type of error
    return NextResponse.json(
      { success: false, error: "An error occured" },
      { status: 500 }
    );
  }
}

/* Certainly! Let's break this down line by line:

```typescript
return NextResponse.json({ success: true, data: result });
```
- `NextResponse` is Next.js's way of creating HTTP responses in API routes.
- `.json()` method creates a JSON response.
- `success: true` is a custom field indicating the operation was successful.
- `data: result` includes the data returned from the database operation.
- This is the "happy path" response when everything works as expected.

```typescript
} catch (error) {
```
- This begins the error handling section.

```typescript
if (error instanceof z.ZodError) {
  return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
}
```
- This checks if the error is a Zod validation error.
- If so, it returns a response with `success: false` and the validation errors.
- `status: 400` indicates a Bad Request (client error).

```typescript
return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 });
```
- This is a catch-all for any other type of error.
- It returns a generic error message.
- `status: 500` indicates an Internal Server Error.

Now, addressing your questions:

1. Why no 201 for a new post?
   - You're right, a 201 status would be more appropriate for a resource creation. We can modify the successful response to:
     ```typescript
     return NextResponse.json({ success: true, data: result }, { status: 201 });
     ```

2. Why two error returns?
   - The first (400) is for validation errors, which are client-side issues.
   - The second (500) is for server-side errors.

3. Why `error.errors` vs a string?
   - `error.errors` for Zod errors provides detailed validation feedback.
   - The string is a generic message for unexpected server errors.

To improve this, we could:
1. Use 201 for successful creation.
2. Log server-side errors for debugging.
3. Provide more specific error messages when possible.

Here's an improved version:

```typescript
try {
  const body = await request.json();
  const validatedData = formSchema.parse(body);
  const result = await prisma.post.create({ data: validatedData });
  return NextResponse.json({ success: true, data: result }, { status: 201 });
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
  }
  console.error('Server error:', error);
  return NextResponse.json(
    { success: false, error: 'An unexpected error occurred' },
    { status: 500 }
  );
}
```

This version includes proper status codes, error logging, and maintains the distinction between client and server errors.
 */
