# Orbital Temple

**The first purely artistic orbital satellite from the Global South.**

Orbital Temple is a sculpture, a technology platform, and a radical act of inclusion. On November 28, 2025, this satellite will launch from India aboard an ISRO rocket, carrying a golden dome into orbit where it will remain for a decade as a temple in the sky.

Anyone, anywhere, can send a name to Orbital Temple. When their name is transmitted to the satellite, it will blink in acknowledgment, creating a brief but eternal connection between Earth and space.

This repository contains the official website for Orbital Temple.

---

## About the Project

Orbital Temple reimagines the sacred for the space age. It asks: **What makes a temple?** Not walls, not location, but the act of remembrance. A temple exists wherever names are spoken, wherever the living honor those who came before, wherever connection bridges distance.

The satellite measures just 5cm³, weighs 245g, and features a dome made of gold. But its significance is vast. It represents:

- **Radical Inclusion**: Space as a place for everyone, not just astronauts or the wealthy
- **Open Source Technology**: All hardware and software freely available for others to learn and build
- **Educational Mission**: Teaching Global South teenagers to build satellites
- **Sustainability**: Carbon neutral launch with responsible deorbiting after 10 years

This is art that doesn't just reflect the future. It creates it.

---

## The Website

This is the digital home for Orbital Temple, built to be as inclusive and accessible as the mission itself.

### Key Features

- **Send a Name Ritual**: Interactive experience allowing anyone to send a name to space
- **Multilingual Support**: Available in 246+ languages through i18next
- **Educational Content**: Information about satellite technology and space accessibility
- **Responsive Design**: Works seamlessly on all devices
- **Accessibility First**: Designed with WCAG compliance and screen reader support
- **Fast & Performant**: Built with Astro for optimal loading speeds

---

## Technology Stack

Built with modern, sustainable web technologies:

- **[Astro](https://astro.build)** - Static site generator optimized for content-focused websites
- **[React](https://react.dev)** - Interactive components for the ritual experience
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first styling
- **[i18next](https://www.i18next.com/)** - Internationalization framework
- **[Firebase](https://firebase.google.com)** - Hosting and backend services
- **[Playwright](https://playwright.dev)** - End-to-end testing

---

## Getting Started

### Prerequisites

- Node.js 18+ (check `.nvmrc` for exact version)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-org]/orbitaltemple-ws-clean.git
cd orbitaltemple-ws-clean

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

The site will be available at `http://localhost:4321`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run check        # Run Astro diagnostics

# Translation
npm run translate           # Translate using DeepL
npm run translate:google    # Translate using Google Translate
npm run translate:lang      # Translate specific language

# Testing
npm run test         # Run Playwright tests
npm run test:ui      # Run tests with UI
npm run test:report  # View test report
```

---

## Project Structure

```
/
├── src/
│   ├── components/     # Reusable UI components
│   ├── layouts/        # Page layout templates
│   ├── lib/            # Utilities and i18n setup
│   ├── pages/          # Route pages (Astro file-based routing)
│   ├── scripts/        # Translation and build scripts
│   └── styles/         # Global styles and design tokens
├── public/             # Static assets (images, fonts, etc.)
├── functions/          # Firebase Cloud Functions
└── dist/               # Production build output
```

---

## Internationalization

Orbital Temple is available in 246+ languages, making it one of the most accessible art projects in history.

Translation files are located in `public/locales/{lang}/translation.json`

See [TRANSLATION_GUIDE.md](./TRANSLATION_GUIDE.md) for detailed translation workflow and [I18N_SETUP.md](./I18N_SETUP.md) for technical implementation.

---

## Contributing

Orbital Temple is open source because we believe space should be accessible to everyone.

If you find bugs, have suggestions, or want to contribute code:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code:
- Maintains accessibility standards
- Includes appropriate tests
- Follows the existing code style
- Updates documentation as needed

---

## Sustainability Commitment

This project mirrors the values of the Orbital Temple mission:

- Carbon neutral operations
- Accessible to all (246+ languages, WCAG compliant)
- Open source hardware and software
- Educational resources freely available
- Built to last (10-year mission timeline)

Learn more about our sustainability practices at [orbitaltemple.art/sustainability](https://orbitaltemple.art/sustainability)

---

## The Team

**Edson Pavoni** - Artist & Technologist
Creator of Orbital Temple. Award-winning artist exploring human intimacy at the intersection of art and technology.

**Sathi Roy** - Strategic Partner
Founder of The Roy Foundation. Building the infrastructure to sustain this 10-year mission and reach underserved communities worldwide.

---

## Links

- **Website**: [orbitaltemple.art](https://orbitaltemple.art)
- **Support**: [orbitaltemple.art/support](https://orbitaltemple.art/support)
- **Education**: [orbitaltemple.art/education](https://orbitaltemple.art/education)
- **Press Kit**: [orbitaltemple.art/press](https://orbitaltemple.art/press)

---

## License

This project is open source. The satellite hardware designs, software, and educational materials are freely available for learning and non-commercial use.

For commercial use or partnership inquiries, contact: edson@spacesandcreatures.com

---

## Acknowledgments

Orbital Temple is made possible by:

- **ISRO** - Indian Space Research Organisation
- **Pearmill** - Founding supporter
- **The Field** - Fiscal sponsor (501(c)(3))
- **The Roy Foundation** - Strategic partner
- And the thousands of individuals who believe space should belong to everyone

---

**Launch Date**: November 28, 2025
**Launch Site**: ISRO Space Center, Sriharikota, India
**Mission Duration**: 10 years in orbit

Art doesn't just reflect the future, it creates it.
