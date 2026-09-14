import roboImg from '../../assets/RoboMurph1987.webp'

import Emblem from '../atoms/Emblem'
import Chip from '../atoms/Chip'
import PhotoFrame from '../atoms/PhotoFrame'
import Field from '../atoms/Field'
import Barcode from '../atoms/Barcode'
import Badge from '../atoms/Badge'

const DEFAULT_NAME = 'RoboCop'
const DEFAULT_ROLE = 'Oficial de la policía cibernética'
const DEFAULT_BADGE = '6042'
const DEFAULT_ISSUER = 'Detroit Police Department'
const DEFAULT_DOC = 'OFFICER IDENTITY CARD'
const DEFAULT_IMAGE = roboImg
const DEFAULT_ALT = 'RoboCop, unidad policial robótica CPD de Detroit'

const DEFAULT_DETAILS = [
    { label: 'Identidad', value: 'Alex J. Murphy' },
    { label: 'Año', value: '1987' },
]

const Styles = {
    mainContainer: {
        marginTop: 32,
        marginBottom: 32,
    },

    card: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 420,
        margin: '16px auto 0',
        boxSizing: 'border-box',
        textAlign: 'left',
        overflow: 'hidden',
        color: 'var(--text)',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        boxShadow:
            '0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.08) inset, var(--shadow)',
        backgroundImage:
            'repeating-linear-gradient(-45deg, transparent 0 6px, rgba(127,127,127,0.035) 6px 7px)',
    },

    header: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        color: '#fff',
        background:
            'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 55%, rgba(0,0,0,0.15)), linear-gradient(180deg, #0f1e3a, #0a1526)',
        borderBottom: '1px solid var(--border)',
    },

    issuer: {
        flex: '1 1 auto',
        fontFamily: 'var(--heading)',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
    },

    body: {
        display: 'flex',
        gap: 16,
        padding: 16,
    },

    info: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minWidth: 0,
    },

    name: {
        margin: 0,
        fontFamily: 'var(--heading)',
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.1,
        color: 'var(--text-h)',
    },

    role: {
        margin: 0,
        fontSize: 12.5,
        fontWeight: 500,
        color: 'var(--accent)',
    },

    fields: {
        margin: '6px 0 0',
        padding: '8px 0 0',
        borderTop: '1px dashed var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },

    footer: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        borderTop: '1px solid var(--border)',
        background:
            'repeating-linear-gradient(90deg, transparent 0 3px, rgba(127,127,127,0.05) 3px 5px), var(--code-bg)',
    },
}

function ProfileCard({
                         name = DEFAULT_NAME,
                         role = DEFAULT_ROLE,
                         badge = DEFAULT_BADGE,
                         issuer = DEFAULT_ISSUER,
                         doc = DEFAULT_DOC,
                         image = DEFAULT_IMAGE,
                         alt = DEFAULT_ALT,
                         details = DEFAULT_DETAILS,
                     }) {
    return (
        <div style={Styles.mainContainer}>
            <article
                style={Styles.card}
                aria-label={`Identificación de ${name}`}
            >
                <header style={Styles.header}>
                    <Emblem />

                    <span style={Styles.issuer}>
            {issuer}
          </span>

                    <Chip variant="inverse" aria-hidden="true">
                        {doc}
                    </Chip>
                </header>

                <div style={Styles.body}>
                    <PhotoFrame
                        src={image}
                        alt={alt}
                    />

                    <div style={Styles.info}>
                        <h3 style={Styles.name}>
                            {name}
                        </h3>

                        <p style={Styles.role}>
                            {role}
                        </p>

                        <dl style={Styles.fields}>
                            {details.map(({ label, value }) => (
                                <Field
                                    key={label}
                                    label={label}
                                    value={value}
                                />
                            ))}
                        </dl>
                    </div>
                </div>

                <footer style={Styles.footer}>
                    <Barcode />

                    <Badge value={`#${badge}`} />

                    <Chip
                        variant="accent"
                        aria-hidden="true"
                    >
                        AUTHORIZED
                    </Chip>
                </footer>
            </article>
        </div>
    )
}

export default ProfileCard