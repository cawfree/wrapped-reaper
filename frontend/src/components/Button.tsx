import * as React from 'react';

export const Button = React.memo(
  function Button({
    children,
    disabled,
    onClick,
  }: React.PropsWithChildren<{
    readonly disabled: boolean;
    readonly onClick: () => void;
  }>): JSX.Element {
    return (
      <button
        disabled={disabled}
        children={children}
        onClick={onClick}
        className={`font-bold text-3xl uppercase bg-${disabled ? 'white' : 'black'} text-${disabled ? 'gray-200' : 'white'} inline-block w-full text-center p-2`}
      />
    );
  }
);
