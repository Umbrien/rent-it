import Link from "next/link";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { headerHeight } from "@/components/MainLayout";
import { AuthInput } from "@/components/auth/Input";

const validationSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(20, { message: "Maximum username length is 20" })
    .refine(
      (username) =>
        username
          .split("")
          .every((char) =>
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-".includes(
              char
            )
          ),
      {
        message: "Username can only contain english letters, numbers, _ and -",
      }
    ),
  email: z.string().email({ message: "Fill in real email" }),
  password: z
    .string()
    .min(8, { message: "Minimal password length is 8" })
    .max(40, { message: "Maximum password length is 40" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    console.log(data);
    alert("Register");
    // process login..
  };

  return (
    <div
      className={`flex min-h-[calc(100vh-${headerHeight})] flex-col justify-center bg-gray-50 py-12 pb-[${headerHeight}] sm:px-6 lg:px-8`}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">
          Register
        </h2>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        >
          <div className="-space-y-px rounded-md shadow-sm">
            <AuthInput
              id="username-input"
              type="text"
              autoComplete="username"
              placeholder="Username"
              {...register("username", { required: true })}
            />
            <AuthInput
              id="email-address"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              {...register("email", { required: true })}
            />
            <AuthInput
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="text-sm text-red-500">
              {Object.values(errors).map((error) => (
                <div key={error.message}>{error.message}</div>
              ))}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={!isValid && Object.keys(errors).length > 0}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-primary-200 disabled:text-gray-600"
            >
              {isValid ? "Register" : "Fill in the form"}
            </button>
          </div>
          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
