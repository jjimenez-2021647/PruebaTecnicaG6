export function Field({
  id,
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <label className={`field ${className}`} htmlFor={id}>
      {Icon ? (
        <span className="field-icon" aria-hidden="true">
          <Icon size={18} strokeWidth={1.8} />
        </span>
      ) : null}
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder=" "
        {...props}
      />
      <span className="field-label">{label}</span>
      {error ? (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
