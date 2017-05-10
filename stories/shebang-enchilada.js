import React from 'react';
import { storiesOf } from '@kadira/storybook';
import ShebangEnchiladaComponent from '../src/components/shebang-enchilada';
import ConnectedShebangEnchiladaComponent from '../src/components/';

storiesOf('ShebangEnchiladaComponent', module)
  .add('connected to store', () => <ConnectedShebangEnchiladaComponent />)
  .add('initial', () => <ShebangEnchiladaComponent status="enabled" />)
  .add('complete', () => <ShebangEnchiladaComponent status="disabled" />);
