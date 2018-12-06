/* eslint-disable no-console */
import fs from 'fs-extra';
import path from 'path-extra';
import types from './ActionTypes';
import {getTranslate} from '../selectors';
import ospath from 'ospath';
// actions
import * as AlertModalActions from './AlertModalActions';
import * as GroupsDataActions from './GroupsDataActions';
import * as GroupsIndexActions from './GroupsIndexActions';
import * as LoaderActions from './LoaderActions';
import * as BodyUIActions from './BodyUIActions';
// helpers
import * as ResourcesHelpers from '../helpers/ResourcesHelpers';
import { loadCurrentContextId } from './ContextIdActions';
import {throttle} from 'lodash';
/**
 * @description function that handles both getGroupsIndex and
 * getGroupsData with promises.
 * @param {string} toolName - name of the tool being loaded.
 * @return {object} object action.
 */
export function loadProjectData(toolName) {
  return ((dispatch, getState) => {
    const translate = getTranslate(getState());
    return new Promise((resolve, reject) => {
      let { projectDetailsReducer } = getState();
      let { projectSaveLocation, manifest, selectedCategories } = projectDetailsReducer;
      let bookAbbreviation = manifest.project.id;
      const gatewayLanguage = projectDetailsReducer.currentProjectToolsSelectedGL[toolName]?projectDetailsReducer.currentProjectToolsSelectedGL[toolName]:'en';
      const dataDirectory = path.join(projectSaveLocation, '.apps', 'translationCore', 'index', toolName);
      const toolResourceDirectory = path.join(ospath.home(), 'translationCore', 'resources', gatewayLanguage, 'translationHelps', toolName);
      const versionDirectory = ResourcesHelpers.getLatestVersionInPath(toolResourceDirectory) || toolResourceDirectory;
      const categoryGroupsLoadActions = [];
      selectedCategories.forEach((category, index) => {
      // if resource in the below path doesn't exist, an empty groups index will be generated by getGroupsIndex().
      // wordAlignment is a tool that this happens with.
        const glDataDirectory = path.join(versionDirectory, category);
        categoryGroupsLoadActions.push(
          new Promise((resolve) => {
            getGroupsIndex(dispatch, glDataDirectory, translate)
              .then(
                () => getGroupsData(dispatch, dataDirectory, toolName, bookAbbreviation, category, index)
              ).then(resolve)
              .catch(reject);
          })
        );
      });
      Promise.all(categoryGroupsLoadActions).then(() => {
        dispatch(GroupsDataActions.verifyGroupDataMatchesWithFs());
        dispatch(loadCurrentContextId());
        dispatch({type: types.TOGGLE_LOADER_MODAL, show: false});
        dispatch(BodyUIActions.toggleHomeView(false));
        resolve();
      }).catch(reject);
    })
      .catch(err => {
        console.warn(err);
        AlertModalActions.openAlertDialog(translate('projects.error_loading', {email: translate('_.help_desk_email')}));
      });
  });
}

/**
 * @description loads the group index from the filesystem.
 * @param {function} dispatch - redux action dispatcher.
 * @param {string} dataDirectory - group index data path location in the filesystem.
 * @param {function} translate
 * @return {object} object action / Promises.
 */
export function getGroupsIndex(dispatch, dataDirectory, translate) {
  return new Promise((resolve) => {
    const groupIndexDataDirectory = path.join(dataDirectory, 'index.json');
    let groupIndexData;
    try {
      groupIndexData = fs.readJsonSync(groupIndexDataDirectory);
      dispatch(GroupsIndexActions.loadGroupsIndex(groupIndexData));
      resolve(true);
    } catch (err) {
      console.log('No GL based index found for tool, will use a generated chapterGroupsIndex.');
      groupIndexData = ResourcesHelpers.chapterGroupsIndex(translate);
      dispatch(GroupsIndexActions.loadGroupsIndex(groupIndexData));
      resolve(true);
    }
  });
}

/**
 * @description loads the group index from the filesystem.
 * @param {function} dispatch - redux action dispatcher.
 * @param {String} dataDirectory - group data path or save location in the filesystem.
 * @param {String} toolName - name if the tool being loaded.
 * @param {String} bookAbbreviation - book abbreviation stinrg.
 * @return {object} object action / Promises.
 */
export function getGroupsData(dispatch, dataDirectory, toolName, bookAbbreviation, category, index) {
  return new Promise((resolve) => {
    let groupsDataDirectory = path.join(dataDirectory, bookAbbreviation);
    const groupsDataLoadedIndex = path.join(groupsDataDirectory, '.index');
    let groupsDataAlreadyLoaded = '';
    if (fs.existsSync(groupsDataLoadedIndex)) {
      groupsDataAlreadyLoaded = fs.readFileSync(groupsDataLoadedIndex).toString();
    }
    if (groupsDataAlreadyLoaded.includes(category)) {
      // read in the groupsData files and load groupsData to reducer
      loadAllGroupsData(groupsDataDirectory, toolName, dispatch, index);
      resolve(true);
    } else {
      // The groups data files were not found in the directory thus copy
      // them from User resources folder to project resources folder.
      ResourcesHelpers.copyGroupsDataToProjectResources(toolName, groupsDataDirectory, bookAbbreviation, category);
      // read in the groupsData files and load groupsData to reducer
      //TODO: Read in the groups data object from above rather than from the FS
      loadAllGroupsData(groupsDataDirectory, toolName, dispatch, index);
      groupsDataAlreadyLoaded  = groupsDataAlreadyLoaded + ' ' + category;
      fs.writeFileSync(path.join(groupsDataDirectory, '.index'), groupsDataAlreadyLoaded);
      console.log('Generated and Loaded group data data from fs');
      resolve(true);
    }
  });
}

/**
 * @description loads all the groups data files from filesystem.
 * @param {array} groupDataFolderObjs -
 * @param {string} groupsDataDirectory - groups data save location in the filesystem.
 * @param {string} toolName - name of the current tool being selected/used.
 * @param {function} dispatch - redux dispatch function.
 * @return {object} object action / Promises.
 */
export function loadAllGroupsData(groupsDataDirectory, toolName, dispatch, index) {
  // read in the groupsData files
  let groupDataFolderObjs = fs.readdirSync(groupsDataDirectory);
  let allGroupsData = {};
  let total = groupDataFolderObjs.length;
  let i = 0;
  for (let groupId in groupDataFolderObjs) {
    if (path.extname(groupDataFolderObjs[groupId]) !== '.json' || groupDataFolderObjs[groupId][0] === '.') {
      total--;
      continue;
    }
    let groupName = groupDataFolderObjs[groupId].split('.')[0];
    let groupData = loadGroupData(groupName, groupsDataDirectory);
    if (groupData) {
      allGroupsData[groupName] = groupData;
    }
    throttle(() => {
      dispatch(LoaderActions.sendProgressForKey(toolName, i / total * 100 * (index + 1)));
    }, 500);
    i++;
  }
  // load groupsData to reducer
  dispatch({
    type: types.LOAD_GROUPS_DATA_FROM_FS,
    allGroupsData
  });
}

/**
 * @description helper function that loads a group data file
 * from the filesystem.
 * @param {string} groupName - group data name.
 * @param {string} groupDataFolderPath - group data save location in the filesystem.
 * @return {object} object action / Promises.
 */
export function loadGroupData(groupName, groupDataFolderPath) {
  const groupPath = path.join(groupDataFolderPath, groupName + '.json');
  let groupData;
  try {
    groupData = fs.readJsonSync(groupPath);
  } catch (err) {
    console.warn('failed loading group data for ' + groupName);
  }
  return groupData;
}
