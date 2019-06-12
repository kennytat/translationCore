/* eslint-env jest */
/* eslint-disable no-console */
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../src/js/reducers';
import fs from 'fs-extra';
import path from 'path-extra';
// actions
import * as csvExportActions from '../src/js/actions/CSVExportActions';
import * as ProjectImportStepperActions
  from '../src/js/actions/ProjectImportStepperActions';
import * as AlertModalActions from '../src/js/actions/AlertModalActions';
// helpers
import * as csvHelpers from '../src/js/helpers/csvHelpers';
import * as ResourcesHelpers from '../src/js/helpers/ResourcesHelpers';

jest.mock('../src/js/selectors', () => ({
  ...require.requireActual('../src/js/selectors'),
  getActiveLocaleLanguage: () => {
    return {code: 'en'};
  },
  getTranslate: () => {
    return jest.fn((code) => {
      return code;
    });
  }
}));

// data
const noChecksPerformedPath = path.join(__dirname,
  'fixtures/project/csv/no_checks_performed/fr_eph_text_ulb');
const checksPerformedPath = path.join(__dirname,
  'fixtures/project/csv/checks_performed/fr_eph_text_ulb');
const bogusFilesInCheckDataPath = path.join(__dirname,
  'fixtures/project/csv/bogus_files/abu_tit_text_reg');
const projectOpenedAutographa = path.join(__dirname,
  'fixtures/project/csv/project_opened_autographa/ar_eph_text_ulb');
const testOutputPath = path.join(__dirname, 'output');

const fixtures = path.join(__dirname, 'fixtures');
const project = path.join(fixtures, 'project');
const resourcesDir = path.join(__dirname,
  '../tcResources/en/translationHelps');
const outDir = path.join(testOutputPath, '1');

beforeAll(() =>
{
  fs.__resetMockFS();
  fs.ensureDirSync(outDir);
  fs.__loadDirIntoMockFs(project, project);
  fs.__loadDirIntoMockFs(resourcesDir, resourcesDir);
  fs.__loadDirIntoMockFs(path.join(fixtures, 'resources'), ResourcesHelpers.USER_RESOURCES_PATH);
});

describe('csv export actions', () => {

  describe('csvExportActions.saveToolDataToCSV', () => {

    test('should resolve true for checksPerformedPath', () => {
      const translate = (key) => key;
      return csvExportActions.saveToolDataToCSV('translationWords',
        checksPerformedPath, translate)
        .then((value) => {
          expect(value).toEqual(true);
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        })
        .catch(err => {
          console.log(err);
          expect(err).toEqual('');
          const dataPath = csvHelpers.dataPath(checksPerformedPath);
          const filePath = path.join(dataPath, 'output',
            'translationWords_CheckData.csv');
          expect(fs.existsSync(filePath)).toEqual(true);
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        });
    });

    test('should resolve true for bogusFilesInCheckDataPath', () => {
      const translate = (key) => key;
      return csvExportActions.saveToolDataToCSV('translationWords',
        bogusFilesInCheckDataPath, translate)
        .then((resolve) => {
          expect(resolve).toEqual(true);
          csvHelpers.cleanupTmpPath('translationWords',
            bogusFilesInCheckDataPath);
        })
        .catch(err => {
          console.log(err);
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(bogusFilesInCheckDataPath);
        });
    });
  });

  describe('csvExportActions.saveVerseEditsToCSV', () => {
    test('should resolve true for checksPerformedPath', () => {
      return csvExportActions.saveVerseEditsToCSV(checksPerformedPath)
        .then((value) => {
          expect(value).toEqual(true);
          const dataPath = csvHelpers.dataPath(checksPerformedPath);
          const filePath = path.join(dataPath, 'output', 'VerseEdits.csv');
          expect(fs.existsSync(filePath)).toEqual(true);
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        });
    });

    test('should resolve true for bogusFilesInCheckDataPath', () => {
      return csvExportActions.saveVerseEditsToCSV(bogusFilesInCheckDataPath)
        .then((value) => {
          expect(value).toEqual(true);
          const dataPath = csvHelpers.dataPath(bogusFilesInCheckDataPath);
          const filePath = path.join(dataPath, 'output', 'VerseEdits.csv');
          expect(fs.existsSync(filePath)).toEqual(true);
          csvHelpers.cleanupTmpPath(bogusFilesInCheckDataPath);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(bogusFilesInCheckDataPath);
        });
    });
  });

  describe('csvExportActions.saveCommentsToCSV', () => {
    test('should resolve true for checksPerformedPath', () => {
      return csvExportActions.saveCommentsToCSV(checksPerformedPath)
        .then((value) => {
          expect(value).toEqual(true);
          const dataPath = csvHelpers.dataPath(checksPerformedPath);
          const filePath = path.join(dataPath, 'output', 'Comments.csv');
          expect(fs.existsSync(filePath)).toEqual(true);
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        });
    });

    test('should resolve true for bogusFilesInCheckDataPath', () => {
      return csvExportActions.saveCommentsToCSV(bogusFilesInCheckDataPath)
        .then((value) => {
          expect(value).toEqual(true);
          const dataPath = csvHelpers.dataPath(bogusFilesInCheckDataPath);
          const filePath = path.join(dataPath, 'output', 'Comments.csv');
          expect(fs.existsSync(filePath)).toEqual(true);
          csvHelpers.cleanupTmpPath(bogusFilesInCheckDataPath);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(bogusFilesInCheckDataPath);
        });
    });
  });

  describe('csvExportActions.saveSelectionsToCSV', () => {
    test('should resolve true for checksPerformedPath', () => {
      return csvExportActions.saveSelectionsToCSV(checksPerformedPath)
        .then((value) => {
          expect(value).toEqual(true);
          const dataPath = csvHelpers.dataPath(checksPerformedPath);
          const filePath = path.join(dataPath, 'output', 'Selections.csv');

          // verify that gatewayLanguageQuote might exist if test files were created correctly
          let csvData = fs.readFileSync(filePath, 'utf8' );
          expect(csvData).toContain('1,adoption,eph'); // quote is between instance and bookid in csv data
          expect(fs.existsSync(filePath)).toEqual(true);
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        });
    });

    test('should resolve true for bogusFilesInCheckDataPath', () => {
      return csvExportActions.saveSelectionsToCSV(bogusFilesInCheckDataPath)
        .then((value) => {
          expect(value).toEqual(true);
          const dataPath = csvHelpers.dataPath(bogusFilesInCheckDataPath);
          const filePath = path.join(dataPath, 'output', 'Selections.csv');
          expect(fs.existsSync(filePath)).toEqual(true);
          csvHelpers.cleanupTmpPath(bogusFilesInCheckDataPath);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(bogusFilesInCheckDataPath);
        });
    });
  });

  describe('csvExportActions.saveRemindersToCSV', () => {
    test('should resolve true', () => {
      return csvExportActions.saveRemindersToCSV(checksPerformedPath)
        .then((value) => {
          expect(value).toEqual(true);
          const dataPath = csvHelpers.dataPath(checksPerformedPath);
          const filePath = path.join(dataPath, 'output', 'Reminders.csv');
          expect(fs.existsSync(filePath)).toEqual(true);
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        });
    });

    test('should resolve true for bogusFilesInCheckDataPath', () => {
      return csvExportActions.saveRemindersToCSV(bogusFilesInCheckDataPath)
        .then((value) => {
          expect(value).toEqual(true);
          const dataPath = csvHelpers.dataPath(bogusFilesInCheckDataPath);
          const filePath = path.join(dataPath, 'output', 'Reminders.csv');
          expect(fs.existsSync(filePath)).toEqual(true);
          csvHelpers.cleanupTmpPath(bogusFilesInCheckDataPath);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(bogusFilesInCheckDataPath);
        });
    });
  });

  describe('csvExportActions.saveAllCSVData', () => {
    test('should resolve true for checksPerformedPath', () => {
      const translate = (key) => key;
      return csvExportActions.saveAllCSVData(checksPerformedPath, translate)
        .then((resolve) => {
          expect(resolve).toEqual(true);
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(checksPerformedPath);
        });
    });

    test('should resolve true for noChecksPerformedPath', () => {
      const translate = (key) => key;
      return csvExportActions.saveAllCSVData(noChecksPerformedPath, translate)
        .then((resolve) => {
          expect(resolve).toEqual(true);
          csvHelpers.cleanupTmpPath(noChecksPerformedPath);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(noChecksPerformedPath);
        });
    });

    test('should resolve true for bogusFilesInCheckDataPath', () => {
      const translate = (key) => key;
      return csvExportActions.saveAllCSVData(bogusFilesInCheckDataPath, translate)
        .then((resolve) => {
          expect(resolve).toEqual(true);
          csvHelpers.cleanupTmpPath(bogusFilesInCheckDataPath);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(bogusFilesInCheckDataPath);
        });
    });

    test('should resolve true for projectOpenedAutographa', () => {
      const translate = (key) => key;
      return csvExportActions.saveAllCSVData(projectOpenedAutographa, translate)
        .then((resolve) => {
          expect(resolve).toEqual(true);
          csvHelpers.cleanupTmpPath(projectOpenedAutographa);
        })
        .catch(err => {
          expect(err).toEqual('');
          csvHelpers.cleanupTmpPath(projectOpenedAutographa);
        });
    });
  });

  describe('csvExportActions.exportToCSVZip', () => {
    test('should resolve true for checksPerformedPath', async () => {
      const testFolder = path.join(testOutputPath, '1'); // make unique test folder
      fs.ensureDirSync(testFolder);
      const zipPath = path.join(testFolder, 'export.zip');
      expect.assertions(1);
      try {
        const translate = (key) => key;
        const resolve = await csvExportActions.exportToCSVZip(
          checksPerformedPath, zipPath, translate);
        if (fs.existsSync(testFolder)) {
          fs.removeSync(testFolder);
        }
        expect(resolve).toEqual(true);
      } catch (err) {
        expect(err).toEqual('');
      }
    });

    test('should resolve true for noChecksPerformedPath', async () => {
      const testFolder = path.join(testOutputPath, '2'); // make unique test folder
      fs.ensureDirSync(testFolder);
      const zipPath = path.join(testFolder, 'export.zip');
      expect.assertions(1);
      try {
        const translate = (key) => key;
        const resolve = await csvExportActions.exportToCSVZip(
          noChecksPerformedPath, zipPath, translate);
        if (fs.existsSync(testFolder)) {
          fs.removeSync(testFolder);
        }
        expect(resolve).toEqual(true);
      } catch (err) {
        expect(err).toEqual('');
      }
    });

    test('should resolve true for bogusFilesInCheckDataPath', async () => {
      const testFolder = path.join(testOutputPath, '3'); // make unique test folder
      fs.ensureDirSync(testFolder);
      const zipPath = path.join(testFolder, 'export.zip');
      expect.assertions(1);
      try {
        const translate = (key) => key;
        const resolve = await csvExportActions.exportToCSVZip(
          bogusFilesInCheckDataPath, zipPath, translate);
        if (fs.existsSync(testFolder)) {
          fs.removeSync(testFolder);
        }
        expect(resolve).toEqual(true);
      } catch (err) {
        expect(err).toEqual('');
      }
    });
  });

  describe('csvExportActions.exportToCSV', () => {
    let store;
    beforeEach(() => {
      // create a new store instance for each test
      store = createStore(
        reducers,
        applyMiddleware(thunk)
      );
    });
    test('should fail to export a project that has merge conflicts', () => {
      let projectPath = path.join(__dirname,
        'fixtures/project/mergeConflicts/two_merge_conflicts_project');
      let spy_cancel_stepper = jest.spyOn(ProjectImportStepperActions,
        'cancelProjectValidationStepper');
      let spy_open_dialog = jest.spyOn(AlertModalActions, 'openAlertDialog');
      store.dispatch(csvExportActions.exportToCSV(projectPath));
      expect(spy_cancel_stepper).toHaveBeenCalled();
      expect(spy_open_dialog).toBeCalledWith('projects.merge_export_error');
    });
  });

});
