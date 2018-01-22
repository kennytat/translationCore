const exec = require('child_process').exec;
const branchName = process.argv[2];
if (!branchName) {
  throw Error('No branch name specified');
} else {
  var script = `git checkout ${branchName}; git pull;`;
  script += `git submodule foreach --recursive '(git_res=$(git checkout ${branchName} 2>&1); if [[ $git_res != *"error"* ]]; then git pull; git reset --hard HEAD; fi;)'`;
  exec(script, (err, stdout) => {
    console.log(stdout);
  });
}
