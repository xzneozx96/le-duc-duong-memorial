"use client";

// Reusable form fields for the Lưu bút: one look for every control (8 px corners, 56 px tall,
// 21 px serif text), a label above, an optional hint, and a worded message when something is
// wrong. Each field wires its own aria-invalid and aria-describedby.
import type { InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { ChevronDown, CircleAlert } from "lucide-react";
import { classes } from "../cls";

const s = classes("lbk");

export function FieldMessage({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className={s.fieldError}>
      <CircleAlert aria-hidden size={24} strokeWidth={2} />
      <span>{text}</span>
    </p>
  );
}

type Common = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  className?: string;
  /** shown under the control, e.g. a character counter */
  after?: ReactNode;
};

const describedBy = (id: string, hint: unknown, error: unknown) =>
  [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;

function Frame({ id, label, hint, error, className, after, children }: Common & { children: ReactNode }) {
  return (
    <div className={`${s.field} ${className ?? ""}`}>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className={s.hint}>
          {hint}
        </p>
      )}
      {children}
      {after}
      <FieldMessage id={`${id}-error`} text={error} />
    </div>
  );
}

export function TextField({
  id,
  label,
  hint,
  error,
  className,
  after,
  inputRef,
  ...rest
}: Common & { inputRef?: Ref<HTMLInputElement> } & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">) {
  return (
    <Frame id={id} label={label} hint={hint} error={error} className={className} after={after}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        className={s.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </Frame>
  );
}

export function TextArea({
  id,
  label,
  hint,
  error,
  className,
  after,
  inputRef,
  ...rest
}: Common & { inputRef?: Ref<HTMLTextAreaElement> } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">) {
  return (
    <Frame id={id} label={label} hint={hint} error={error} className={className} after={after}>
      <textarea
        ref={inputRef}
        id={id}
        className={`${s.control} ${s.controlArea}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </Frame>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  className,
  after,
  placeholder,
  options,
  ...rest
}: Common & {
  placeholder: string;
  options: { value: string; label: string }[];
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className">) {
  return (
    <Frame id={id} label={label} hint={hint} error={error} className={className} after={after}>
      <span className={s.selectWrap}>
        <select
          id={id}
          className={`${s.control} ${s.controlSelect}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          data-empty={!rest.value || undefined}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className={s.selectIcon} size={24} strokeWidth={2} />
      </span>
    </Frame>
  );
}
