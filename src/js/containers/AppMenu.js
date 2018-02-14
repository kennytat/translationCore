import React from 'react';
import PropTypes from 'prop-types';
import TranslateIcon from 'material-ui/svg-icons/action/translate';
// import FeedbackIcon from 'material-ui/svg-icons/action/question-answer';
import SyncIcon from 'material-ui/svg-icons/notification/sync';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import PopoverMenu from '../components/PopoverMenu';
import MenuItem from 'material-ui/MenuItem';
import LocaleSettingsDialogContainer from './LocaleSettingsDialogContainer';
import FeedbackDialogContainer from './FeedbackDialogContainer';
import SoftwareUpdatesDialog from './SoftwareUpdateDialog/index';

const APP_UPDATE = 'app_update';
const FEEDBACK = 'feedback';
const APP_LOCALE = 'app_locale';

/**
 * This component renders the global application menu.
 * Items in the menu trigger the display of dialog components.
 *
 * @property {func} translate - the localization function
 * @property {string} [variant=primary] - the style variant of the menu.
 */
class AppMenu extends React.Component {

  constructor(props) {
    super(props);
    this.closeDialog = this.closeDialog.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.isDialogOpen = this.isDialogOpen.bind(this);

    this.state = {
      dialog: {
        [APP_UPDATE]: false,
        [FEEDBACK]: false,
        [APP_LOCALE]: false
      }
    };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }


  /**
   * Opened the named dialog
   *
   * @private
   * @param {string} dialog
   * @return {function()}
   */
  closeDialog(dialog) {
    return () => {
      this.setState({
        ...this.state,
        dialog: {
          ...this.state.dialog,
          [dialog]: false
        }
      });
    };
  }

  /**
   * Opens the named dialog
   *
   * @private
   * @param {string} dialog
   * @return {function()}
   */
  openDialog(dialog) {
    return () => {
      this.setState({
        ...this.state,
        dialog: {
          ...this.state.dialog,
          [dialog]: true
        }
      });
    };
  }

  /**
   * Checks if the named dialog is open
   *
   * @private
   * @param {string} dialog
   * @return {bool}
   */
  isDialogOpen(dialog) {
    return this.state.dialog[dialog];
  }

  render() {
    const {variant, translate} = this.props;

    return (
      <div>
        <PopoverMenu label={translate('app_menu.actions')}
                     variant={variant}
                     icon={<SettingsIcon/>}>
          <MenuItem onClick={this.openDialog(APP_UPDATE)}
                    primaryText={translate('app_menu.check_app_updates')}
                    leftIcon={<SyncIcon/>}/>
          {/*<MenuItem onClick={this.openDialog(FEEDBACK)}*/}
                    {/*primaryText={translate('app_menu.user_feedback')}*/}
                    {/*leftIcon={<FeedbackIcon/>}/>*/}
          <MenuItem onClick={this.openDialog(APP_LOCALE)}
                    primaryText={translate('app_menu.change_app_locale')}
                    leftIcon={<TranslateIcon/>}/>
        </PopoverMenu>

        <FeedbackDialogContainer open={this.isDialogOpen(FEEDBACK)}
                                 translate={translate}
                                 onClose={this.closeDialog(FEEDBACK)}/>

        <LocaleSettingsDialogContainer open={this.isDialogOpen(APP_LOCALE)}
                                       translate={translate}
                                       onClose={this.closeDialog(APP_LOCALE)}/>

        <SoftwareUpdatesDialog open={this.isDialogOpen(APP_UPDATE)}
                               translate={translate}
                               onClose={this.closeDialog(APP_UPDATE)}/>
      </div>

    );
  }
}
AppMenu.propTypes = {
  translate: PropTypes.func.isRequired,
  variant: PropTypes.string
};
AppMenu.defaultProps = {
  variant: 'primary'
};


export default AppMenu;
