import { Composition } from 'remotion';
import { OceanPlunge } from './OceanPlunge';

export const RemotionRoot = () => {
  return (
    <Composition
      component={OceanPlunge}
      durationInFrames={156}
      fps={30}
      height={900}
      id="OceanPlunge"
      width={1600}
    />
  );
};
