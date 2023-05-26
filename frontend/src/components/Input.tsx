import * as React from 'react';

export const Input = React.memo(
  function Input({
    value,
    onChange,
    disabled,
    placeholder,
    autoFocus = false,
  }: {
    readonly disabled: boolean;
    readonly value: string;
    readonly onChange: (nextValue: string) => void;
    readonly placeholder: string;
    readonly autoFocus?: boolean;
  }): JSX.Element {
    return (
      <input
        className={`w-full text-3xl mb-6 text-center bg-white text-${disabled ? 'gray-200' : 'black'}`}
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value}
        onChange={React.useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
          [onChange],
        )}
        disabled={disabled}
      />
    );
  }
);
