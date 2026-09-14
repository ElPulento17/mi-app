const Styles = {
    badge: {
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 6,
        padding: '4px 10px',
        fontFamily: 'var(--mono)',
        fontSize: 12,
        color: 'var(--text-h)',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 4,
    },

    key: {
        fontSize: 9,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--accent)',
        fontWeight: 700,
    },

    num: {
        fontWeight: 700,
        letterSpacing: '0.04em',
    },
}

function Badge({ prefix = 'Badge', value, style }) {
    return (
        <span style={{ ...Styles.badge, ...style }}>
      <span style={Styles.key}>{prefix}</span>
      <span style={Styles.num}>{value}</span>
    </span>
    )
}

export default Badge