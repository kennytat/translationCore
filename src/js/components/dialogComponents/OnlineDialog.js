import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Checkbox } from 'material-ui';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';

const styles = {
  checkboxIconStyle: {
    fill: 'var(--accent-color-dark)'
  },
};

const OnlineDialog = ({translate, checked, onChecked}) => {
  return (
    <MuiThemeProvider>
      <div>
        <Translate id='using_internet' style={{fontSize: 15}} />
        <div style={{display: 'flex'}}>
          <Checkbox
            style={{width: '0px', marginRight: -10}}
            checked={checked}
            labelStyle={{
              color: 'var(--reverse-color)',
              opacity: '0.7',
              fontWeight: '500'
            }}
            iconStyle={styles.checkboxIconStyle}
            onCheck={(e) => {
              onChecked(e.target.checked);
            }}
          />
          {translate('do_not_show_again')}
        </div>
      </div>
    </MuiThemeProvider>
  );
};
OnlineDialog.propTypes = {
  translate: PropTypes.func,
  checked: PropTypes.bool,
  onChecked: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  checked: state.settingsReducer.onlineMode
});

export default connect(mapStateToProps)(OnlineDialog);
