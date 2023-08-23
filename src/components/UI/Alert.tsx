import type colors from "tailwindcss/colors";
import { IconInfoCircle } from "@tabler/icons-react";
// import { useTranslations } from "next-intl";

export const Alert = ({
  message,
  color,
}: {
  message: string;
  color: keyof typeof colors;
}) => {
  // const t = useTranslations("components.Alert");
  return (
    <div
      className={`rounded-b border-t-4 border-${color}-500 bg-${color}-100 my-5 px-4 py-3 text-${color}-700 shadow-md`}
      role="alert"
    >
      <div className="flex">
        <div className="py-1">
          <IconInfoCircle className={`mr-4 h-6 w-6 text-${color}-500`} />
        </div>
        <div>
          {/*<p className="font-bold">{t("notice")}</p>*/}
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};
