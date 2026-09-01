const VARIANT_CLASSES = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  outline: 'btn-outline',
};

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
};

export default Button;
