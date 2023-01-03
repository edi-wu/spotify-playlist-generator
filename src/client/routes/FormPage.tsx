import React, { useState, ChangeEventHandler, MouseEventHandler, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import DropDownMenu from '../components/DropDownMenu';
import Alert from '../components/Alert';
import isPositiveIntegerString from '../utils/inputValidation';
import refreshToken from '../services/oauthService';
import { generatePlaylist } from '../services/playlistService';
import { FormData } from '../types';
import { SPOTIFY_GENRE_SEEDS, ERROR_MESSAGES, ONE_MIN_IN_MS } from '../constants';

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

const FormPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    durationHours: '',
    durationMinutes: '',
    genres: '',
  });
  const [invalidHours, setInvalidHours] = useState<boolean>(false);
  const [invalidMinutes, setInvalidMinutes] = useState<boolean>(false);
  const [missingDuration, setMissingDuration] = useState<boolean>(true);
  const [missingGenre, setMissingGenre] = useState<boolean>(true);
  const [hasClicked, setHasClicked] = useState<boolean>(false);

  // Once user logs in and arrived at form, schedule refreshing access token every 55 min
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshToken();
    }, 55 * ONE_MIN_IN_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleFormInput: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
    const sourceName = event.target.name;
    const sourceValue = event.target.value;
    if (sourceName === 'durationHours') {
      if (!isPositiveIntegerString(sourceValue)) {
        setInvalidHours(true);
      } else {
        setInvalidHours(false);
      }
    }
    if (sourceName === 'durationMinutes') {
      if (!isPositiveIntegerString(sourceValue)) {
        setInvalidMinutes(true);
      } else {
        setInvalidMinutes(false);
      }
    }
    setFormData({ ...formData, [sourceName]: sourceValue });
  };

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    let validationPassed = true;
    setHasClicked(true);
    if (!formData.genres) {
      setMissingGenre(true);
      validationPassed = false;
    } else {
      setMissingGenre(false);
    }
    if (!parseInt(formData.durationHours, 10) && !parseInt(formData.durationMinutes, 10)) {
      setMissingDuration(true);
      validationPassed = false;
    } else {
      setMissingDuration(false);
    }
    if (invalidHours || invalidMinutes) {
      validationPassed = false;
    }
    if (!validationPassed) {
      return;
    }
    const serverResponse: string | Error = await generatePlaylist(formData);
    if (serverResponse instanceof Error) {
      navigate('/error', { state: { error: serverResponse } });
      return;
    }
    navigate('/player', { state: { playlistId: serverResponse, playlistTitle: formData.title } });
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
      {invalidHours || invalidMinutes ? <Alert message={ERROR_MESSAGES.invalidDuration} /> : null}
      {hasClicked && missingDuration ? <Alert message={ERROR_MESSAGES.missingDuration} /> : null}
      <br />
      <DropDownMenu
        label="genres"
        defaultOptionLabel="select a genre"
        name="genres"
        value={formData.genres}
        changeHandler={handleFormInput}
        menuOptions={SPOTIFY_GENRE_SEEDS}
      />
      {hasClicked && missingGenre ? <Alert message={ERROR_MESSAGES.missingGenre} /> : null}
      <br />
      <SubmitButton buttonText="Generate my playlist" clickHandler={handleSubmit} />
    </>
  );
};

export default FormPage;
