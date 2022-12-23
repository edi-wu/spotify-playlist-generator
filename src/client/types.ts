import { ChangeEventHandler, MouseEventHandler } from 'react';

export type ButtonProps = {
  className?: string;
  buttonText: string;
  clickHandler: MouseEventHandler<HTMLButtonElement>;
};

export type InputProps = {
  className?: string;
  label?: string;
  defaultOptionLabel?: string;
  name: string;
  value: string;
  changeHandler: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  fieldBeforeLabel?: boolean;
  menuOptions?: string[];
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
