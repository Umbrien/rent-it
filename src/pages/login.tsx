import Link from "next/link";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const validationSchema = z.object({
  email: z.string().email({ message: "Fill in real email" }),
  password: z
    .string()
    .min(8, { message: "Minimal password length is 8" })
    .max(40, { message: "Maximum password length is 40" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    console.log(data);
    // process login..
  };

  return (
    <div className="flex min-h-[calc(100vh-76px)]  flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">
          Login
        </h2>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        >
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                className="relative w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                placeholder="Email address"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="relative w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                placeholder="Password"
                {...register("password", { required: true })}
              />
            </div>
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
              {isValid ? "Login" : "Fill in the form"}
            </button>
          </div>
          <div className="text-center">
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Don&apos;t have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
