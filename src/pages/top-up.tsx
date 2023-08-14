import { useState } from "react";
import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthInput } from "@/components/auth/Input";
import { api } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";

const validationSchema = z.object({
  amount: z.number().positive({ message: "amount-positive" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function TopUp() {
  const t = useTranslations("pages.Top-Up");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = ({ amount }) => {
    mutation.mutate(amount);
  };

  const { login } = useAuth();

  const mutation = api.authed.topUp.useMutation({
    onSuccess: ({ user, amount }) => {
      setToppedUpAmount(amount);
      login(user);
    },
    onError: (error) => {
      setMutationError(error.message);
    },
    onMutate: () => {
      setMutationError("");
      setToppedUpAmount(0);
    },
  });

  const [toppedUpAmount, setToppedUpAmount] = useState(0);
  const [mutationError, setMutationError] = useState("");
  return (
    <div className="flex min-h-[var(--h-antinav)] flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">
          {t("title")}
        </h2>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        >
          <div className="-space-y-px rounded-md shadow-sm">
            <AuthInput
              id="amount"
              type="number"
              autoComplete="top-up-amount"
              placeholder={t("amount")}
              {...register("amount", { valueAsNumber: true })}
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
          <button
            type="submit"
            disabled={!isValid && Object.keys(errors).length > 0}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-primary-200 disabled:text-gray-600"
          >
            {isValid ? t("top-up-btn") : t("fill-in-the-form")}
          </button>
          {mutationError && (
            <div className="text-sm text-red-500">{mutationError}</div>
          )}
          <div
            className={`text-sm text-green-500 ${
              !toppedUpAmount && "invisible"
            }`}
          >
            {t("successfully-topped-up", { amount: toppedUpAmount })}
          </div>
        </form>
      </div>
    </div>
  );
}
