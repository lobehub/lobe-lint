interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Props should be sorted: shorthand first, then alphabetical, callbacks last, multiline last
export function Button({ children, className, disabled, type = 'button', onClick }: ButtonProps) {
  return (
    <button className={className} disabled={disabled} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
