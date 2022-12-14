import React from 'react';

export type ButtonProps = {
  className?: string;
  buttonText: string;
  clickHandler: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export type RoutesConfig = {
  path: string;
  element: JSX.Element;
}[];
