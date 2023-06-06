import { useThemeMode } from 'antd-style';
import React from 'react';

import { darkLogo, lightLogo } from '@/components/Header/style';

interface LogoProps {
  size?: number;

  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ size = 20, style }) => {
  const { isDarkMode } = useThemeMode();
  return (
    <img alt="logo" src={isDarkMode ? darkLogo : lightLogo} style={{ height: size, ...style }} />
  );
};

export default React.memo(Logo);
