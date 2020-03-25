import fs from 'fs-extra';
import path from 'path-extra';
import env from 'tc-electron-env';
import ResourceAPI from './ResourceAPI';
// constants
const USER_RESOURCES_PATH = path.join(env.home(), 'translationCore', 'resources');

/**
 * get Lexicon Data
 * @param {string} lexiconId
 * @param {string} entryId
 */
export function getLexiconData(lexiconId, entryId) {
  try {
    const languageId = 'en'; // TODO: need to add other language support
    // generate path from resourceType and articleId and get latest version
    const latestVersionPath = ResourceAPI.getLatestVersion(path.join(USER_RESOURCES_PATH, languageId, 'lexicons', lexiconId));
    const entryPath = path.join(latestVersionPath, 'content', entryId + '.json');
    let entryData;

    if (fs.existsSync(entryPath)) {
      entryData = fs.readJsonSync(entryPath, 'utf8'); // get file from fs
    }
    return { [lexiconId]: { [entryId]: entryData } };
  } catch (error) {
    console.error(error);
  }
}
