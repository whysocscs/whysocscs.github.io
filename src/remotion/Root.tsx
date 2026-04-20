import { Composition } from 'remotion';
import { OceanPlunge } from './OceanPlunge';

export const RemotionRoot = () => {
  return (
    <Composition
      component={OceanPlunge}
      durationInFrames={246}
      fps={30}
      height={900}
      id="OceanPlunge"
      width={1600}
    />
  );
};
