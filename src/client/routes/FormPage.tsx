import React, { useState, ChangeEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import DropDownMenu from '../components/DropDownMenu';
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
  // NB will need to convert duration inputs to numbers
  // will need to validate user input is int
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    durationHours: '',
    durationMinutes: '',
    genres: '',
  });
  const navigate = useNavigate();
  const goToPlayer = (): void => {
    navigate('/player');
  };

  const handleFormInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    const sourceName = event.target.name;
    setFormData({ ...formData, [sourceName]: event.target.value });
    console.log(formData);
  };

  const handleDropDownInput: ChangeEventHandler<HTMLSelectElement> = (event) => {
    console.log('handling dropdown input yeah', event.target.value);
    setFormData({ ...formData, [event.target.name]: event.target.value });
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
      <TextInput
        label="playlist length"
        name="durationHours"
        value={formData.durationHours}
        changeHandler={handleFormInput}
      />
      <span>hours</span>
      <TextInput
        name="durationMinutes"
        value={formData.durationMinutes}
        changeHandler={handleFormInput}
      />
      <span>minutes</span>
      <br />
      <DropDownMenu
        label="genres"
        defaultOptionLabel="select a genre"
        name="genres"
        value={formData.genres}
        changeHandler={handleDropDownInput}
        options={SPOTIFY_GENRE_SEEDS}
      />
      <br />
      <SubmitButton buttonText="Generate my playlist" clickHandler={goToPlayer} />
    </>
  );
};

export default FormPage;
