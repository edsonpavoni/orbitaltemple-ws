# Ritual Button

A reusable button component with a 3D orbit animation effect. Built with vanilla TypeScript and Motion.dev, with a React wrapper for easy integration into Astro or React projects.

## Features

- 🎨 **Pure CSS/SVG/TS** - No raster images required
- 🎭 **3D Orbit Illusion** - Animated ellipse that appears to pass behind and in front of the button
- ♿ **Fully Accessible** - WCAG compliant with keyboard navigation and reduced motion support
- 🎯 **Framework Agnostic** - Vanilla TypeScript with optional React wrapper
- 🌙 **Dark Mode** - Built-in dark theme support
- 📱 **Responsive** - Works on all screen sizes with proper touch targets
- ⚡ **Performant** - Transform-only animations, 60fps

## Demo

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:5173` to see the interactive demo.

## Installation

### For Vanilla JS/TS Projects

```typescript
import { RitualButton } from './src/ritual-button.ts';
import './styles.css';

const button = new RitualButton({
  label: 'ritual',
  onClick: (ev) => console.log('Clicked!'),
});

button.mount(document.getElementById('container'));
```

### For React/Astro Projects

```tsx
import RitualButtonReact from './src/ritual-button.react.tsx';
import './styles.css';

function App() {
  return (
    <RitualButtonReact
      label="ritual"
      onClick={() => console.log('Clicked!')}
    />
  );
}
```

### In Astro with Client Directive

```astro
---
import RitualButtonReact from './src/ritual-button.react.tsx';
import './styles.css';
---

<RitualButtonReact
  client:load
  label="ritual"
  onClick={() => console.log('Clicked!')}
/>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `"ritual"` | Button text content |
| `size` | `number` | `170` | Button diameter in pixels |
| `ringRx` | `number` | `85` | Horizontal radius of orbit ellipse |
| `ringRy` | `number` | `55` | Vertical radius of orbit ellipse |
| `ringAzimuthDeg` | `number` | `18` | Rotation angle of ellipse plane |
| `strokeColor` | `string` | `"#6B5727"` | Color of orbit line |
| `strokeWidth` | `number` | `2.5` | Width of orbit line |
| `diskColor` | `string` | `"#FFF7E6"` | Background color of button |
| `textColor` | `string` | `"#3C2A00"` | Color of button text |
| `rotationSec` | `number` | `8` | Duration of one orbit rotation (seconds) |
| `hoverRotationSec` | `number` | `3` | Duration during hover/focus (seconds) |
| `easing` | `"linear" \| "ease-in-out"` | `"linear"` | Animation easing function |
| `wobble` | `boolean` | `true` | Enable azimuth precession animation |
| `wobbleSec` | `number` | `6` | Duration of wobble cycle (seconds) |
| `shadow` | `boolean` | `true` | Enable button drop shadow |
| `ariaLabel` | `string` | `label` | Accessible label for screen readers |
| `className` | `string` | `""` | Additional CSS class names |
| `onClick` | `(ev: MouseEvent) => void` | `undefined` | Click handler |

### Methods (Vanilla Class Only)

```typescript
// Update props dynamically
button.update({ label: 'new label', size: 200 });

// Clean up animations and listeners
button.destroy();

// Get the DOM element
const element = button.getElement();
```

## Customization Examples

### Large Button with Fast Rotation

```typescript
new RitualButton({
  size: 250,
  ringRx: 120,
  ringRy: 80,
  rotationSec: 4,
  hoverRotationSec: 1.5,
});
```

### Tilted Orbit

```typescript
new RitualButton({
  ringAzimuthDeg: 45,
  ringRy: 40,
  wobble: false, // Disable wobble for cleaner look
});
```

### Custom Colors

```typescript
new RitualButton({
  diskColor: '#FF6B6B',
  textColor: '#FFFFFF',
  strokeColor: '#C92A2A',
  shadow: true,
});
```

### Tall Ellipse (Like Reference Screenshot)

```typescript
new RitualButton({
  ringRx: 60,
  ringRy: 75,
  ringAzimuthDeg: 25,
});
```

## Accessibility

- ✅ Keyboard navigable (Tab, Enter, Space)
- ✅ Screen reader compatible with proper ARIA labels
- ✅ High contrast mode support
- ✅ `prefers-reduced-motion` support (stops continuous animation, rotates 45° on hover)
- ✅ Minimum 44px touch target
- ✅ Visible focus indicators

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with ES2020 support

## How It Works

The 3D orbit illusion is created using:

1. **Two SVG layers**: One behind the button, one in front
2. **Stroke dash patterns**: `stroke-dasharray="0.5 0.5"` creates a 50% visible line
3. **Dash offsets**: Back layer uses `stroke-dashoffset="0.5"`, front uses `0`
4. **Synchronized rotation**: Both layers rotate at the same speed
5. **Result**: The orbit line appears to pass behind and emerge in front of the button

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## File Structure

```
ritual-button-component/
├── src/
│   ├── ritual-button.ts          # Vanilla TS class
│   ├── ritual-button.react.tsx   # React wrapper
│   ├── types.d.ts                # TypeScript definitions
│   └── utils/
│       └── motion.ts             # Motion.dev helpers
├── styles.css                    # Component styles
├── index.html                    # Demo page
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## License

MIT

## Credits

Built with [Motion.dev](https://motion.dev) for smooth, performant animations.
