import React from "react";
import type { InputHTMLAttributes } from "react";

export const AuthInput = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ id, placeholder, ...props }, ref) => {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        ref={ref}
        id={id}
        className="relative w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
});
AuthInput.displayName = "AuthInput";
