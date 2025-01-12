import os from 'os';
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import semver from 'semver';
import { connect } from 'react-redux';
// import appPackage from '../../../../package';
import { confirmOnlineAction } from '../../actions/OnlineModeConfirmActions';
import SoftwareUpdateDialog, {
  STATUS_ERROR, STATUS_OK, STATUS_LOADING, STATUS_UPDATE,
} from '../../components/dialogComponents/SoftwareUpdateDialog';
import { APP_VERSION } from '../../common/constants';

/**
 * Returns the correct update asset for this operating system.
 * If the update is not newer than the installed version null will be returned.
 *
 * @see {@link SoftwareUpdateDialog} for component details
 *
 * @param {object} response - the network response
 * @param {string} installedVersion - the installed version of the application
 * @param {string} osArch - the operating system architecture
 * @param {string} osPlatform - the operating system.
 * @return {*} the update object
 */
export function getUpdateAsset(response, installedVersion, osArch, osPlatform) {
  const platformNames = {
    'aix': 'linux',
    'darwin': 'macos',
    'freebsd': 'linux',
    'linux': 'linux',
    'openbsd': 'linux',
    'sunos': 'linux',
    'win32': 'win',
  };

  // TRICKY: some architectures will return ia32 instead of x32
  if (osArch === 'ia32') {
    osArch = 'x32';
  }

  const platform = `${platformNames[osPlatform]}-${osArch}`;
  let update = null;

  for (const asset of response.assets) {
    if (asset.name.includes(platform)) {
      update = {
        ...asset,
        latest_version: response.tag_name,
        installed_version: installedVersion,
      };
      break;
    }
  }

  // validate version
  if (update) {
    const latest = semver.valid(semver.coerce(update.latest_version));
    const installed = semver.valid(semver.coerce(update.installed_version));

    if (!semver.gt(latest, installed)) {
      update = null;
    }
  }
  return update;
}

/**
 * This container renders a dialog that checks for available software updates
 *
 * @see SoftwareUpdateDialog
 *
 * @class
 *
 * @property {func} onClose - callback when the dialog is closed
 * @property {bool} open - controls whether the dialog is open or closed
 * @property {func} translate - the localization function
 * @property {func} onDownload - callback when the download is requested
 */
class SoftwareUpdateDialogContainer extends React.Component {
  constructor(props) {
    super(props);
    this._handleClose = this._handleClose.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._startSoftwareCheck = this._startSoftwareCheck.bind(this);
    this._stopSoftwareCheck = this._stopSoftwareCheck.bind(this);
    this.initialState = {
      status: STATUS_LOADING,
      update: null,
      cancelToken: null,
    };
    this.state = { ...this.initialState };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const openChanged = newProps.open !== this.props.open;

    if (openChanged && newProps.open) {
      const { confirmOnlineAction } = this.props;

      confirmOnlineAction(() => {
        this._startSoftwareCheck();
      }, ()=> {
        this._handleClose();
      });
    } else if (openChanged && !newProps.open) {
      this._stopSoftwareCheck();
    }
  }

  componentDidCatch(error, info) {
    console.error(error, info);
    this._stopSoftwareCheck();
  }

  componentWillUnmount() {
    this._stopSoftwareCheck();
  }

  /**
   * Initiates checking for software updates
   * @private
   */
  _startSoftwareCheck() {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const request = {
      cancelToken: source.token,
      method: 'GET',
      url: `https://api.github.com/repos/unfoldingWord-dev/translationCore/releases/latest`,
    };

    this.setState({
      ...this.initialState,
      cancelToken: source,
    });

    this.request = axios(request).then(response => {
      const update = getUpdateAsset(response.data, APP_VERSION, os.arch(), os.platform());

      if (update) {
        this.setState({
          status: STATUS_UPDATE,
          update,
        });
      } else {
        this.setState({ status: STATUS_OK });
      }
    }).catch(error => {
      if (axios.isCancel(error)) {
        // user canceled
        this._handleClose();
      } else {
        console.error(error);
        this.setState({ status: STATUS_ERROR });
      }
    });
  }

  /**
   * Cancels the software update checks
   * @private
   */
  _stopSoftwareCheck() {
    const { cancelToken } = this.state;

    if (cancelToken !== null) {
      cancelToken.cancel('Operation canceled by user');
    }
  }

  /**
   * Handles closing the dialog
   * @private
   */
  _handleClose() {
    const { onClose } = this.props;

    this.setState({ ...this.initialState });
    onClose();
  }

  /**
   * Handles the download request
   * @private
   */
  _handleSubmit() {
    const { update } = this.state;
    const { onDownload } = this.props;

    if (update) {
      onDownload({
        content_type: update.content_type,
        name: update.name,
        version: update.latest_version,
        size: update.size,
        url: update.browser_download_url,
      });
    } else {
      this._handleClose();
    }
  }

  render() {
    const { open, translate } = this.props;
    const { status, update } = this.state;

    return (
      <SoftwareUpdateDialog onClose={this._handleClose}
        translate={translate}
        open={open}
        onSubmit={this._handleSubmit}
        status={status}
        update={update}/>
    );
  }
}

SoftwareUpdateDialogContainer.propTypes = {
  translate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  confirmOnlineAction: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default connect(null, { confirmOnlineAction })(SoftwareUpdateDialogContainer);
