import React from 'react';
import { Image } from 'react-native';
import UMassAmherstLogo from '@/assets/images/UMassAmherst_horiz.png'

const HomeHeaderLogo = () => (
  <Image
    source={UMassAmherstLogo}
    style={{
      width: 200,
      height: 80,
      resizeMode: 'contain',
    }}
  />
);

export default HomeHeaderLogo;
