import React, {Component} from 'react';
import {connect} from 'react-redux';
import fs from 'fs-extra';
import PropTypes from 'prop-types';
import path from 'path-extra';
import ospath from 'ospath';
import {Grid, Row} from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {withLocalize} from 'react-localize-redux';
// container
import AlertContainer from '../containers/AlertContainer';
import ScreenDimmerContainer from '../containers/ScreenDimmerContainer';
import KonamiContainer from '../containers/KonamiContainer';
import StatusBarContainer from '../containers/StatusBarContainer';
import BodyContainer from '../containers/home/BodyContainer';
import PopoverContainer from '../containers/PopoverContainer';
import AlertDialogContainer from '../containers/AlertDialogContainer';
import ProjectValidationContainer from '../containers/projectValidation/ProjectValidationContainer';
// actions
import * as OnlineModeActions from '../actions/OnlineModeActions';
import * as MigrationActions from '../actions/MigrationActions';
import * as SettingsMigrationActions from '../actions/SettingsMigrationActions';
import {loadLocalization, APP_LOCALE_SETTING} from '../actions/LocaleActions';
import {getLocaleLoaded, getSetting} from '../selectors';
import {loadTools} from "../actions/ToolActions";
import packageJson from '../../../package.json';
import {injectFileLogging} from "../helpers/logger";
//consts
import {LOG_FILES_PATH} from "../common/constants";

const version = `v${packageJson.version} (${process.env.BUILD})`;
injectFileLogging(LOG_FILES_PATH, version);

class Main extends Component {
  constructor(props) {
    super(props);
    // load app locale
    const localeDir = path.join(__dirname, '../../locale');
    props.loadLocalization(localeDir, props.appLanguage, props.initialize, props.addTranslationForLanguage, props.setActiveLanguage);
  }

  shouldComponentUpdate(nextProps) {
    const {loadingProject} = nextProps.reducers.homeScreenReducer;
    if (loadingProject === true) {
      return false;
    } else return true;
  }

  componentWillMount() {
    const tCDir = path.join(ospath.home(), 'translationCore', 'projects');
    fs.ensureDirSync(tCDir);
  }

  componentDidMount() {
    const {
      migrateResourcesFolder,
      migrateToolsSettings,
      getAnchorTags,
      loadTools
    } = this.props;

    loadTools(path.join(__dirname, '../../../tC_apps'));

    if (localStorage.getItem('version') !== packageJson.version) {
      localStorage.setItem('version', packageJson.version);
    }

    migrateResourcesFolder();
    // migration logic for toolsSettings in settings.json
    migrateToolsSettings();
    getAnchorTags();
  }

  render() {
    const {isLocaleLoaded} = this.props;
    if (isLocaleLoaded) {
      return (
        <MuiThemeProvider>
          <div className="fill-height">
            <ScreenDimmerContainer />
            <ProjectValidationContainer />
            <AlertContainer />
            <AlertDialogContainer />
            <KonamiContainer />
            <PopoverContainer />
            <Grid fluid style={{padding: 0, display: 'flex', flexDirection: 'column', height: '100%'}}>
              <Row style={{margin: 0}}>
                <StatusBarContainer />
              </Row>
              <BodyContainer />
            </Grid>
          </div>
        </MuiThemeProvider>
      );
    } else {
      // wait for locale to finish loading.
      // this should be less than a second.
      return null;
    }
  }
}

Main.propTypes = {
  loadLocalization: PropTypes.func.isRequired,
  addTranslationForLanguage: PropTypes.func.isRequired,
  setActiveLanguage: PropTypes.func.isRequired,
  migrateResourcesFolder: PropTypes.func.isRequired,
  migrateToolsSettings: PropTypes.func.isRequired,
  getAnchorTags: PropTypes.func.isRequired,
  isLocaleLoaded: PropTypes.bool,
  appLanguage: PropTypes.any,
  loadTools: PropTypes.func.isRequired,
  reducers: PropTypes.object.isRequired,
  initialize: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    reducers: {
      homeScreenReducer: state.homeScreenReducer
    },
    isLocaleLoaded: getLocaleLoaded(state),
    appLanguage: getSetting(state, APP_LOCALE_SETTING)
  };
};

const mapDispatchToProps = {
  getAnchorTags: OnlineModeActions.getAnchorTags,
  migrateToolsSettings: SettingsMigrationActions.migrateToolsSettings,
  migrateResourcesFolder: MigrationActions.migrateResourcesFolder,
  loadLocalization,
  loadTools
};

export default withLocalize(connect(
  mapStateToProps,
  mapDispatchToProps
)(Main));
