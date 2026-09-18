import React from "react";

export function Field({ label, htmlFor, error, hint, required, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="field-label">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="field-error">{error}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = React.forwardRef(function Input(
  { label, error, hint, required, className = "", id, ...rest },
  ref
) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <input
        ref={ref}
        id={id}
        className={`field-input ${error ? "border-rose-400 focus:ring-rose-500/30 focus:border-rose-500" : ""} ${className}`}
        {...rest}
      />
    </Field>
  );
});

export const Textarea = React.forwardRef(function Textarea(
  { label, error, hint, required, className = "", id, rows = 4, ...rest },
  ref
) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={`field-input resize-none ${error ? "border-rose-400 focus:ring-rose-500/30 focus:border-rose-500" : ""} ${className}`}
        {...rest}
      />
    </Field>
  );
});

export const Select = React.forwardRef(function Select(
  { label, error, hint, required, className = "", id, children, ...rest },
  ref
) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <select
        ref={ref}
        id={id}
        className={`field-input pr-10 ${error ? "border-rose-400" : ""} ${className}`}
        {...rest}
      >
        {children}
      </select>
    </Field>
  );
});
