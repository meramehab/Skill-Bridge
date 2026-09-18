const Card = ({ eyebrow, title, children, footer, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && <h3 className="mt-1 text-lg font-semibold text-ink">{title}</h3>}
      <div className="mt-3 text-sm text-charcoal/80">{children}</div>
      {footer && <div className="mt-4 border-t border-line pt-4">{footer}</div>}
    </div>
  );
};

export default Card;
