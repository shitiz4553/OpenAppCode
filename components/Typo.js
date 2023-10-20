import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Theme from '../src/Theme';


const Typo = ({
  numberOfLines,
  light,
  grey,
  children,
  xl,
  l,
  m,
  s,
  xs,
  fontFamily,
  center,
  bold,
  style,
  ...props
}) => {
  const getFontSizeStyle = () => {
    if (xl) return { fontSize: 24 };
    if (l) return { fontSize: 18 };
    if (m) return { fontSize: 16 };
    if (s) return { fontSize: 14 };
    if (xs) return { fontSize: 12 };
    return { fontSize: 16 }; // Default font size
  };

  const fontStyles = {
    fontFamily: light ? Theme.PoppinsLight : bold ? Theme.PoppinsBold : Theme.PoppinsMedium,
    color: grey ? Theme.lightTextcolor : 'black',
    textAlign:center ? 'center' : 'left'
  };

  // Merge the font size styles, font family, and provided styles
  const mergedStyles = [getFontSizeStyle(), fontStyles, style];

  return (
    <Text
      numberOfLines={numberOfLines ? numberOfLines :100}
      style={mergedStyles}
      {...props}
    >
      {children}
    </Text>
  );
};

export default Typo;
