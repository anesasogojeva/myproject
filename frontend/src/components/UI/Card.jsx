import React from "react";

export default function Card({
  children,
  className = "",
  padding = "p-6",
  hoverable = false,
  as: Tag = "div",
  ...rest
}) {
  return (
    <Tag
      className={`card ${padding} ${
        hoverable ? "transition hover:shadow-card hover:-translate-y-0.5" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
