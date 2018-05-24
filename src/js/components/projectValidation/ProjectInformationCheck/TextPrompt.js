import React from 'react';
import PropTypes from 'prop-types';
// components
import { Glyphicon } from 'react-bootstrap';
import { TextField } from 'material-ui';

const TextPrompt = ({
  text,
  title,
  updateText,
  getErrorMessage
}) => {
  return (
    <div>
      <TextField
        id="resource-id-textfield"
        value={text}
        style={{ width: '200px', marginTop: text === "" ? '30px' : '' }}
        errorText={getErrorMessage(text)}
        errorStyle={{ color: '#cd0033' }}
        underlineFocusStyle={{ borderColor: "var(--accent-color-dark)" }}
        floatingLabelFixed={true}
        floatingLabelStyle={{ color: '#000', fontSize: '22px', fontWeight: 'bold' }}
        floatingLabelText={
          <div style={{ width: '300px' }}>
            <Glyphicon glyph={"book"} style={{ color: "#000000", fontSize: '22px' }} />&nbsp;
            <span>{title}</span>&nbsp;
            <span style={{ color: '#cd0033'}}>*</span>
          </div>
        }
        onChange={(event, value) => {
          updateText(value);
        }}
      >
      </TextField>
    </div>
  );
};

TextPrompt.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  updateText: PropTypes.func.isRequired,
  getErrorMessage: PropTypes.func.isRequired
};

export default TextPrompt;
