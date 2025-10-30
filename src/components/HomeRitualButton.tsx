import { useTranslation } from 'react-i18next';
import RitualButtonV6React from './RitualButton';
import type { RitualButtonReactProps } from './ritual-button-types';

export default function HomeRitualButton() {
  const { t } = useTranslation('home');

  return (
    <RitualButtonV6React
      label={t('ritual.label')}
      orbitRotationAxis="y"
      orbitTiltX={25}
      rotationSec={12.5}
      hoverRotationSec={5}
      hoverSlowToFlat={true}
      size={123}
    />
  );
}
