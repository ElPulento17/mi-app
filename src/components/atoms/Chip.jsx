const base = {
    flex: 'none',
    padding: '3px 8px',
    fontFamily: 'var(--mono)',
    fontSize: 10,
    letterSpacing: '0.18em',
    borderRadius: 3,
}

const variants = {
    inverse: {
        color: 'rgba(255,255,255,0.85)',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.25)',
    },

    accent: {
        fontSize: 9.5,
        letterSpacing: '0.2em',
        fontWeight: 700,
        color: 'var(--accent)',
        background: 'var(--accent-bg)',
        border: '1px solid var(--accent-border)',
    },
}

function Chip({ variant = 'inverse', style, children }) {
    return (
        <span style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </span>
    )
}

export default Chip