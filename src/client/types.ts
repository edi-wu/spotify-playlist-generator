import React, { ChangeEventHandler } from 'react';

export type ButtonProps = {
  className?: string;
  buttonText: string;
  clickHandler: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export type InputProps = {
  className?: string;
  label?: string;
  defaultOptionLabel?: string;
  name: string;
  value: string;
  changeHandler: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  options?: string[];
};

export type AlertProps = {
  className?: string;
  message: string;
};

export type FormData = {
  title: string;
  description: string;
  durationHours: string;
  durationMinutes: string;
  genres: string;
};

export type RoutesConfig = {
  path: string;
  element: JSX.Element;
}[];
