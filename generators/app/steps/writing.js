const path = require('path');
const walkDir = require('../../../utils/walkDir');

module.exports = function() {
  const files = walkDir(path.join(`${__dirname}/../templates/`));
  const newFiles = files.map(pth =>
    pth.replace(RegExp(`.+${this.answers.authType}`), ''),
  );

  newFiles.forEach(file => {
    this.fs.copyTpl(
      this.templatePath('./'),
      this.destinationPath(`${this.answers.identifier}/`),
      { config: this.answers },
    );
  });
};
