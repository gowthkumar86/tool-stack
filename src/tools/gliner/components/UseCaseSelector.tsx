import type { UseCaseDefinition } from "../types";

interface UseCaseSelectorProps {
  useCases: UseCaseDefinition[];
  selectedUseCase: string;
  onSelectUseCase: (value: string) => void;
  disabled?: boolean;
}

export default function UseCaseSelector({
  useCases,
  selectedUseCase,
  onSelectUseCase,
  disabled = false,
}: UseCaseSelectorProps) {
  return (
    <section>
      <label htmlFor="gliner-use-case" className="block text-sm font-medium text-slate-300">
        Use Case
      </label>
      <select
        id="gliner-use-case"
        value={selectedUseCase}
        disabled={disabled || useCases.length === 0}
        onChange={(event) => onSelectUseCase(event.target.value)}
        className="input-field mt-2 p-2 text-sm"
      >
        {useCases.length === 0 ? (
          <option value="">No use cases available</option>
        ) : (
          <>
            <option value="">Select a use case</option>
            {useCases.map((useCase) => (
              <option key={useCase.key} value={useCase.key}>
                {useCase.name}
              </option>
            ))}
          </>
        )}
      </select>
    </section>
  );
}
