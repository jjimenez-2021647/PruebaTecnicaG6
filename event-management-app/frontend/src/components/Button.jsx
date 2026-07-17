export function Button({ children, isLoading = false, className = '', ...props }) {
  return (
    <button className={`button ${className}`} disabled={isLoading || props.disabled} {...props}>
      <span className="button-label">{isLoading ? 'Procesando' : children}</span>
      <span className="button-label button-label-next" aria-hidden="true">
        {children}
      </span>
    </button>
  );
}
