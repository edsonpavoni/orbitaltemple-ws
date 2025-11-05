import { useTranslation } from 'react-i18next';

export default function MenuContent() {
  const { t, ready } = useTranslation('common');

  if (!ready) {
    return null;
  }

  const handleLinkClick = () => {
    // Close the drawer after clicking a link
    const drawer = document.querySelector('#menu-drawer');
    const btnMenu = document.querySelector('#btn-menu');
    if (drawer && btnMenu) {
      drawer.setAttribute('data-open', 'false');
      btnMenu.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  const linkStyle = {
    color: 'var(--color-ot-gold600)',
    textDecoration: 'none',
    transition: 'color 0.2s'
  };

  return (
    <nav aria-labelledby="menu-title" className="menu-drawer-content">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <h2 id="menu-title" style={{ fontSize: 'var(--text-display-md)', lineHeight: 'var(--text-display-md-lh)', fontWeight: 700, margin: 0 }}>
          <a href="/artwork" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.theArtwork')}
          </a>
        </h2>
        <h2 style={{ fontSize: 'var(--text-display-md)', lineHeight: 'var(--text-display-md-lh)', fontWeight: 700, margin: 0 }}>
          <a href="/send-a-name" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.sendAName')}
          </a>
        </h2>
        <h2 style={{ fontSize: 'var(--text-display-md)', lineHeight: 'var(--text-display-md-lh)', fontWeight: 700, margin: 0 }}>
          <a href="/artist" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.fromTheArtist')}
          </a>
        </h2>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href="/#dome" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.yetAnotherTemple')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href="/how-it-works" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.howItWorks')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href="/space-launch" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.spaceLaunch')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href="/brief-history" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.briefHistory')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href="/education" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.education')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href="/sustainability" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.sustainability')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href="/press" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.press')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href="/team" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.team')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href="/partners" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.partners')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href="/support" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.support')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href="/technical" style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.technicalInfo')}
          </a>
        </li>
      </ul>
    </nav>
  );
}
