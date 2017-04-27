import React from 'react';
import { connect } from 'react-redux';
// actions
import { showNotification } from '../actions/NotificationActions.js';
import { showPopover } from '../actions/PopoverActions.js';
import { addNewResource, addNewBible } from '../actions/ResourcesActions.js';
import { addComment } from '../actions/CommentsActions.js';
import { addVerseEdit } from '../actions/VerseEditActions.js';
import { toggleReminder } from '../actions/RemindersActions.js';
import { changeSelections, validateSelections } from '../actions/SelectionsActions.js';
import {changeCurrentContextId, loadCurrentContextId, changeToNextContextId, changeToPreviousContextId} from '../actions/ContextIdActions.js';
import {addGroupData} from '../actions/GroupsDataActions.js';
import {setGroupsIndex} from '../actions/GroupsIndexActions.js';
import {setModuleSettings, changeModuleSettings} from '../actions/ModulesSettingsActions.js';
import { sendProgressForKey } from '../actions/LoaderActions';
import { setProjectDetail } from '../actions/projectDetailsActions';
import { setDataFetched } from '../actions/currentToolActions';


class ToolsContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    let { contextId } = nextProps.contextIdReducer
    let { toolName } = nextProps.currentToolReducer
    // if contextId does not match current tool, then remove contextId
    if (contextId && contextId.tool !== toolName) {
      nextProps.actions.changeCurrentContextId(undefined)
    }
    // check to see if groupData and groupIndex
    if (!contextId) nextProps.actions.loadCurrentContextId()
  }

  render() {
    let Tool = this.props.currentTool
    return (
      <Tool {...this.props} />
    );
  }
}

const mapStateToProps = state => {
  return {
    modules: state.coreStoreReducer.modules,
    checkStoreReducer: state.checkStoreReducer,
    loginReducer: state.loginReducer,
    settingsReducer: state.settingsReducer,
    statusBarReducer: state.statusBarReducer,
    loaderReducer: state.loaderReducer,
    resourcesReducer: state.resourcesReducer,
    commentsReducer: state.commentsReducer,
    remindersReducer: state.remindersReducer,
    contextIdReducer: state.contextIdReducer,
    projectDetailsReducer: state.projectDetailsReducer,
    selectionsReducer: state.selectionsReducer,
    verseEditReducer: state.verseEditReducer,
    groupsIndexReducer: state.groupsIndexReducer,
    groupsDataReducer: state.groupsDataReducer,
    modulesSettingsReducer: state.modulesSettingsReducer,
    currentToolReducer: state.currentToolReducer
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: {
      goToNext: () => {
        dispatch(changeToNextContextId());
      },
      goToPrevious: () => {
        dispatch(changeToPreviousContextId());
      },
      showNotification: (message, duration) => {
        dispatch(showNotification(message, duration));
      },
      showPopover: (title, bodyText, positionCoord) => {
        dispatch(showPopover(title, bodyText, positionCoord));
      },
      addNewResource: (resourceName, resourceData) => {
        dispatch(addNewResource(resourceName, resourceData));
      },
      addNewBible: (bibleName, bibleData) => {
        dispatch(addNewBible(bibleName, bibleData));
      },
      progress: (label, progress) => {
        dispatch(sendProgressForKey(label, progress));
      },
      addComment: (text, userName) => {
        dispatch(addComment(text, userName));
      },
      changeSelections: (selections, userName) => {
        dispatch(changeSelections(selections, userName));
      },
      validateSelections: (targetVerse) => {
        dispatch(validateSelections(targetVerse));
      },
      toggleReminder: (userName) => {
        dispatch(toggleReminder(userName));
      },
      addVerseEdit: (before, after, tags, userName) => {
        dispatch(addVerseEdit(before, after, tags, userName));
      },
      changeCurrentContextId: (contextId) => {
        dispatch(changeCurrentContextId(contextId));
      },
      loadCurrentContextId: () => {
        dispatch(loadCurrentContextId());
      },
      addGroupData: (groupId, groupData) => {
        dispatch(addGroupData(groupId, groupData));
      },
      setGroupsIndex: (groupsIndex) => {
        dispatch(setGroupsIndex(groupsIndex));
      },
      setModuleSettings: (NAMESPACE, settingsPropertyName, moduleSettingsData) => {
        dispatch(setModuleSettings(NAMESPACE, settingsPropertyName, moduleSettingsData));
      },
      changeModuleSettings: (NAMESPACE, settingsPropertyName, moduleSettingsData) => {
        dispatch(changeModuleSettings(NAMESPACE, settingsPropertyName, moduleSettingsData));
      },
      setProjectDetail: (key, value) => {
        dispatch(setProjectDetail(key, value));
      },
      isDataFetched: val => {
        dispatch(setDataFetched(val));
      },
      doneLoading: () => {
        dispatch({type: "DONE_LOADING"})
      }
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolsContainer);
