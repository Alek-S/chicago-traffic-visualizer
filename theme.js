/**
 * default theme passed in with theme provider
 */

const theme = {
    font: {
        main: `'Quicksand', sans-serif`,
        size: {
            header: '18px',
            subheader: '15px',
            main: '14px',
            small: '12px',
        },
        weight: {
            main: 300,
            strong: 700,
        },
        color: {
            header: '#1AB8C4',
            main: '#C5C6C7',
        }
    },
    panel: {
        background: `rgba(39, 44, 53, 0.85)`,
        headerGradient: `linear-gradient(to bottom, #4c5566 0%, #343b47 100%)`,
        boxShadow: `0px 0px 50px rgba(0,0,0,0.4)`,
        width: `18rem`,
        color: {
            light: `#4c5566`,
            dark: `#343b47`,
            select: `#505a6d`,
        },
    },
    slider: {
        height: `1rem`,
    }
}

export default theme;