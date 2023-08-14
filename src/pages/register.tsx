import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { username } from "@/utils/schemas";
import { AuthInput } from "@/components/auth/Input";
import { api } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";

const validationSchema = z.object({
  username,
  email: z.string().email({ message: "fill-in-real-email" }),
  password: z
    .string()
    .min(8, { message: "min-password-length" })
    .max(40, { message: "max-password-length" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function Register() {
  const t = useTranslations("pages.Auth");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    mutation.mutate(data);
  };

  const router = useRouter();

  const { login } = useAuth();
  const [mutationError, setMutationError] = useState("");

  const mutation = api.public.register.useMutation({
    onSuccess: async ({ user }) => {
      login(user);
      await router.push("/");
    },
    onError: (error) => {
      setMutationError(error.message);
    },
    onMutate: () => {
      setMutationError("");
    },
  });

  return (
    <div
      className={`flex min-h-[var(--h-antinav)] flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8`}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">
          {t("register")}
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
              placeholder={t("username")}
              {...register("username")}
            />
            <AuthInput
              id="email-address"
              type="email"
              autoComplete="email"
              placeholder={t("email-address")}
              {...register("email")}
            />
            <AuthInput
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={t("password")}
              {...register("password")}
            />
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="text-sm text-red-500">
              {Object.values(errors).map((error) => (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                <div key={error.message}>{t(error.message)}</div>
              ))}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={!isValid && Object.keys(errors).length > 0}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-primary-200 disabled:text-gray-600"
            >
              {isValid ? t("register") : t("fill-in-the-form")}
            </button>
          </div>
          {mutationError && (
            <div className="text-sm text-red-500">{mutationError}</div>
          )}
          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t("already-have-an-account")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
