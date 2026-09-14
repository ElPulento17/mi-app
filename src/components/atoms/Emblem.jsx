const Styles = {
    emblem: {
        flex: 'none',
        borderRadius: '50%',
        background:
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(255,255,255,0) 55%), linear-gradient(180deg, #4a5e7a, #1a2a44)',
        border: '1px solid rgba(255,255,255,0.25)',
        boxShadow:
            '0 0 0 2px rgba(255,255,255,0.08) inset, 0 1px 0 rgba(255,255,255,0.35) inset',
    },
}

function Emblem({ size = 26, style }) {
    return (
        <span
            aria-hidden="true"
            style={{ ...Styles.emblem, width: size, height: size, ...style }}
        />
    )
}

export default Emblem