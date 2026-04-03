import Button from "../../../components/ui/button";

interface ExtractButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function ExtractButton({
  onClick,
  disabled,
  loading,
}: ExtractButtonProps) {
  return (
    <Button type="button" variant="primary" onClick={onClick} disabled={disabled}>
      {loading ? "Extracting..." : "Extract"}
    </Button>
  );
}
