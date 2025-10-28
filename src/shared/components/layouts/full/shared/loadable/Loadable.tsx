import { Suspense, ComponentType } from 'react';
import Spinner from '@/shared/components/common/Spinner';

// ===========================|| LOADABLE - LAZY LOADING ||=========================== //

const Loadable = <P extends object>(Component: ComponentType<P>) => {
  const LoadableComponent = (props: P) => (
    <Suspense fallback={<Spinner />}>
      <Component {...props} />
    </Suspense>
  );

  return LoadableComponent;
};

export default Loadable;
