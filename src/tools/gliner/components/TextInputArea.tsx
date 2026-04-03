interface TextInputAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}

export default function TextInputArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 8,
}: TextInputAreaProps) {
  return (
    <section>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="input-field mono-output mt-2 w-full p-3 text-sm"
      />
    </section>
  );
}
