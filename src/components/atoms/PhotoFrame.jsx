const Styles = {
    photo: {
        flex: 'none',
        objectFit: 'cover',
        border: '1px solid var(--border)',
        borderRadius: 6,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.08))',
        boxShadow:
            '0 0 0 2px rgba(255,255,255,0.4) inset, 0 2px 4px rgba(0,0,0,0.12)',
    },
}

function PhotoFrame({ src, alt = '', width = 118, height = 154, style }) {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            style={{ ...Styles.photo, width, height, ...style }}
        />
    )
}

export default PhotoFrame