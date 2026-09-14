const Styles = {
    row: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 12,
        padding: '4px 0',
    },

    label: {
        flex: '1 1 auto',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--text)',
        opacity: 0.8,
    },

    value: {
        flex: '1 1 auto',
        margin: 0,
        fontFamily: 'var(--heading)',
        fontSize: 12.5,
        fontWeight: 600,
        textAlign: 'right',
        color: 'var(--text-h)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
}

function Field({ label, value, style }) {
    return (
        <div style={{ ...Styles.row, ...style }}>
            <dt style={Styles.label}>{label}</dt>
            <dd style={Styles.value}>{value}</dd>
        </div>
    )
}

export default Field