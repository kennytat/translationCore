import fs from 'fs-extra';
import path from 'path-extra';
import ospath from 'ospath';
import ResourceAPI from "./ResourceAPI";
// constants
const USER_RESOURCES_PATH = path.join(ospath.home(), 'translationCore', 'resources');

export function getLexiconData(lexiconId, entryId) {
  try {
    const languageId = 'en'; // TODO: need to add other language support
    // generate path from resourceType and articleId and get latest version
    const latestVersion = ResourceAPI.getLatestVersion(path.join(USER_RESOURCES_PATH, languageId, 'lexicons', lexiconId));
    const entryPath = path.join(latestVersion, 'content', entryId + '.json');
    let entryData;
    if (fs.existsSync(entryPath)) {
      entryData = fs.readJsonSync(entryPath, 'utf8'); // get file from fs
    }
    return {
      [lexiconId]: {
        [entryId]: entryData
      }
    };
  } catch (error) {
    console.error(error);
  }
}
