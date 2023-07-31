import React from "react";

function beautifyNumber(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface NumberSpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  number: number;
}

interface PriceSpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  price: number;
}

export function NumberSpan({ number, ...props }: NumberSpanProps) {
  return <span {...props}>{beautifyNumber(number)}</span>;
}

export function PriceSpan({ price, className, ...props }: PriceSpanProps) {
  return (
    <span {...props} className={`italic ${className}`}>
      {beautifyNumber(price)}&nbsp;₴
    </span>
  );
}
