import React from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

const SIZES = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export default function Button({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  icon: Icon,
  iconRight: IconRight,
  className = "",
  children,
  disabled,
  ...rest
}) {
  const classes = `${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && <Icon className="w-4 h-4" />}
      {children}
      {!loading && IconRight && <IconRight className="w-4 h-4" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
}
