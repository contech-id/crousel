import { useEffect, useState } from "react";
import { normalizeWhatsapp } from "@/lib/locations";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
};
export function WhatsappInput({ value, onChange, className = "", placeholder = "82329322353", required }: Props) {
  const [focused, setFocused] = useState(false);
  const toLocal = (phone: string) => phone.replace(/^\+?62/, "");
  const [localValue, setLocalValue] = useState(() => toLocal(value));

  useEffect(() => {
    if (!focused) setLocalValue(toLocal(value));
  }, [focused, value]);

  return (
    <div
      className={`flex items-center overflow-hidden rounded-xl border border-input bg-background focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 ${className}`}
    >
      <span className="border-r border-input px-3 text-sm font-semibold text-muted-foreground">+62</span>
      <input
        required={required}
        type="tel"
        inputMode="numeric"
        value={localValue}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          const normalized = normalizeWhatsapp(localValue);
          setLocalValue(toLocal(normalized));
          onChange(normalized);
        }}
        onChange={(event) => {
          const next = event.target.value.replace(/\D/g, "");
          setLocalValue(next);
          onChange(next);
        }}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
      />
    </div>
  );
}
