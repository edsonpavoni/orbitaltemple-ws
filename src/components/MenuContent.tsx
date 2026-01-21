import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../lib/i18n';

export default function MenuContent() {
  const { t, i18n, ready } = useTranslation('common');

  // Get current language from URL path
  const getCurrentLang = () => {
    if (typeof window === 'undefined') return 'en';
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const urlLang = pathParts[0];
    const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === urlLang);
    return isSupported ? urlLang : i18n.language || 'en';
  };

  const lang = getCurrentLang();

  // Helper to build language-prefixed URLs
  const localePath = (path: string) => `/${lang}${path}`;

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
          <a href={localePath('/artwork')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.theArtwork')}
          </a>
        </h2>
        <h2 style={{ fontSize: 'var(--text-display-md)', lineHeight: 'var(--text-display-md-lh)', fontWeight: 700, margin: 0 }}>
          <a href={localePath('/send-a-name')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.sendAName')}
          </a>
        </h2>
        <h2 style={{ fontSize: 'var(--text-display-md)', lineHeight: 'var(--text-display-md-lh)', fontWeight: 700, margin: 0 }}>
          <a href={localePath('/updates')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.updates')}
          </a>
        </h2>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href={localePath('/how-it-works')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.howItWorks')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href={localePath('/space-launch')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.spaceLaunch')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href={localePath('/brief-history')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.briefHistory')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href={localePath('/education')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.education')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href={localePath('/sustainability')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.sustainability')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href={localePath('/press')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.press')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href={localePath('/team')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.team')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href={localePath('/partners')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.partners')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href={localePath('/support')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.support')}
          </a>
        </li>
        <li style={{ fontSize: 'var(--text-display-sm)', lineHeight: 'var(--text-display-sm-lh)' }}>
          <a href={localePath('/technical')} style={linkStyle} onClick={handleLinkClick}
             onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-ot-gold300)'}
             onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-ot-gold600)'}>
            {t('nav.technicalInfo')}
          </a>
        </li>
      </ul>
    </nav>
  );
}
