"use client"

import * as React from "react"

/**
 * Field — the one labelled-input primitive for the shop funnel.
 *
 * Replaces the ad-hoc `Input` / `Select` that CheckoutForm reinvented locally
 * (mono uppercase labels + dashed-2px borders). Premium-for-kids pass:
 *   - label = CLEAN SANS (font-sans, small, medium) — NOT mono.
 *   - border = solid HAIRLINE (doodle-ink/15) — NOT a 2px dashed stitch.
 *   - focus = soft orange ring (the one accent) + ink border, no harsh outline.
 *   - error = doodle-red border + small sans message below.
 *   - radius = rounded-lg (16px cap, the organic DOODLE corner) — respected.
 *
 * Two render modes via `as`: a text-style `input` (default) or a `select`.
 * Both share the exact same chrome so the form reads as one system.
 */

const BASE_CONTROL =
  "mt-1.5 block w-full h-11 px-3 rounded-lg bg-doodle-stitch text-doodle-ink " +
  "font-sans text-base border transition-[border-color,box-shadow] duration-200 " +
  "focus:outline-none focus-visible:outline-none " +
  "focus:ring-4 focus:ring-doodle-orange/30 focus:border-doodle-orange"

function controlBorder(error?: boolean) {
  return error ? "border-doodle-red" : "border-doodle-ink/15 hover:border-doodle-ink/30"
}

type FieldLabelProps = {
  label: React.ReactNode
  error?: string | null
  hint?: string
  className?: string
  children: React.ReactNode
}

function FieldShell({ label, error, hint, className = "", children }: FieldLabelProps) {
  return (
    <label className={`block ${className}`}>
      <span className="font-sans text-[13px] font-medium text-doodle-ink/70">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block font-sans text-xs text-doodle-red">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block font-sans text-xs text-doodle-ink/50">{hint}</span>
      ) : null}
    </label>
  )
}

type InputFieldProps = {
  label: React.ReactNode
  value: string
  onChange: (v: string) => void
  type?: string
  maxLength?: number
  placeholder?: string
  error?: string | null
  hint?: string
  className?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  autoComplete?: string
}

/** Labelled text/email/tel input on shared chrome. */
export function Field({
  label,
  value,
  onChange,
  type = "text",
  maxLength,
  placeholder,
  error,
  hint,
  className,
  inputMode,
  autoComplete,
}: InputFieldProps) {
  return (
    <FieldShell label={label} error={error} hint={hint} className={className}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={`${BASE_CONTROL} ${controlBorder(Boolean(error))}`}
      />
    </FieldShell>
  )
}

type SelectFieldProps = {
  label: React.ReactNode
  value: string
  onChange: (v: string) => void
  options: readonly string[]
  placeholder?: string
  error?: string | null
  hint?: string
  className?: string
}

/** Labelled select on the same shared chrome as `Field`. */
export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  error,
  hint,
  className,
}: SelectFieldProps) {
  return (
    <FieldShell label={label} error={error} hint={hint} className={className}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        className={`${BASE_CONTROL} ${controlBorder(Boolean(error))}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}
