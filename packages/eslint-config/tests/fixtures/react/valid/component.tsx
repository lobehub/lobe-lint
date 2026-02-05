interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ children, disabled, onClick }: ButtonProps) {
  return (
    <button disabled={disabled} onClick={onClick} type="button">
      {children}
    </button>
  );
}
