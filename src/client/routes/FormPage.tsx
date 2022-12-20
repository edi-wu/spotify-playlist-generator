import React, { useState, ChangeEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import DropDownMenu from '../components/DropDownMenu';
import Alert from '../components/Alert';
import isPositiveIntegerString from '../utils/inputValidation';
import { FormData } from '../types';
import SPOTIFY_GENRE_SEEDS from '../constants';

// TODO: if attempting to access this page before auth, should trigger redirect
// implement by updating route with auth wrapper
// should pass redirect flag to homepage upon redirect to display "auth required" message

const SubmitButton = styled(Button)`
  background-color: pink;
  // opacity: 25%;
  text-align: center;
  font-size: 36px;
  color: #0d2426;
  &:hover {
    opacity: 75%;
  }
  border-radius: 5px;
`;

const FormPage = () => {
  // NB will need to convert duration inputs to numbers -- do it on BE?
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    durationHours: '',
    durationMinutes: '',
    genres: '',
  });
  const [isValidInput, setIsValidInput] = useState<boolean>(true);
  const navigate = useNavigate();
  const goToPlayer = (): void => {
    navigate('/player');
  };

  // NB state is still updated in case of invalid input; need to check flag before making api call
  const handleFormInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    const sourceName = event.target.name;
    const sourceValue = event.target.value;
    if (sourceName === 'durationHours' || sourceName === 'durationMinutes') {
      if (!isPositiveIntegerString(sourceValue)) {
        setIsValidInput(false);
      } else {
        setIsValidInput(true);
      }
    }
    setFormData({ ...formData, [sourceName]: sourceValue });
  };

  const handleDropDownInput: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const sourceName = event.target.name;
    const sourceValue = event.target.value;
    setFormData({ ...formData, [sourceName]: sourceValue });
  };

  return (
    <>
      <h1>This is the placeholder for user input form</h1>
      <TextInput
        label="title"
        name="title"
        value={formData.title}
        changeHandler={handleFormInput}
      />
      <br />
      <TextInput
        label="description"
        name="description"
        value={formData.description}
        changeHandler={handleFormInput}
      />
      <br />
      playlist length
      <TextInput
        label="hour(s)"
        name="durationHours"
        value={formData.durationHours}
        changeHandler={handleFormInput}
        fieldBeforeLabel
      />
      <TextInput
        label="minutes"
        name="durationMinutes"
        value={formData.durationMinutes}
        changeHandler={handleFormInput}
        fieldBeforeLabel
      />
      {isValidInput ? null : (
        <Alert message="Please input positive integers for playlist duration" />
      )}
      <br />
      <DropDownMenu
        label="genres"
        defaultOptionLabel="select a genre"
        name="genres"
        value={formData.genres}
        changeHandler={handleDropDownInput}
        menuOptions={SPOTIFY_GENRE_SEEDS}
      />
      <br />
      <SubmitButton buttonText="Generate my playlist" clickHandler={goToPlayer} />
    </>
  );
};

export default FormPage;
