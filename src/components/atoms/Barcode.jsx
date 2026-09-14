const Styles = {
    barcode: {
        flex: '1 1 auto',
        background:
            'repeating-linear-gradient(90deg, var(--text-h) 0 1px, transparent 1px 3px, var(--text-h) 3px 4px, transparent 4px 7px, var(--text-h) 7px 9px, transparent 9px 10px, var(--text-h) 10px 11px, transparent 11px 13px)',
        opacity: 0.85,
    },
}

function Barcode({ height = 22, maxWidth = 160, style }) {
    return (
        <span
            aria-hidden="true"
            style={{ ...Styles.barcode, height, maxWidth, ...style }}
        />
    )
}
export default Barcode