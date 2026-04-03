interface LabelsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LabelsInput({ value, onChange }: LabelsInputProps) {
  return (
    <section>
      <label htmlFor="gliner-labels" className="block text-sm font-medium text-slate-300">
        Labels (comma separated)
      </label>
      <input
        id="gliner-labels"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="person, organization, date, location"
        className="input-field mt-2 p-2 text-sm"
      />
    </section>
  );
}
