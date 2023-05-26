import * as React from 'react';

export const Ellipses = React.memo(
  function Ellipses({children}: React.PropsWithChildren): JSX.Element {
    const [state, setState] = React.useState('');

    React.useEffect(() => {
      const i = setInterval(
        () => setState(currentState => {
          const nextState = `${currentState}.`;
          return nextState.length > 3 ? '' : nextState;
        }),
        1000
      );
      return () => void clearInterval(i);
    }, []);

    return <>{children}{state}</>
  }
);
