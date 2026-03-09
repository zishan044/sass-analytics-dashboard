"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { useRegister } from "@/hooks/useRegister";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const registerSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters.")
    .max(50, "Username must be at most 50 characters."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { mutate: register, isPending } = useRegister();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: RegisterValues) {
    register(data);
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          {form.formState.errors.root && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
              {form.formState.errors.root.message}
            </div>
          )}
          <FieldGroup className="space-y-4">
            {/* Username Field */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reg-username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="reg-username"
                    placeholder="felix_dev"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reg-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="reg-email"
                    type="email"
                    placeholder="felix@example.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reg-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="register-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Creating account..." : "Register"}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <a href="/login" className="text-primary underline">
            Login
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
