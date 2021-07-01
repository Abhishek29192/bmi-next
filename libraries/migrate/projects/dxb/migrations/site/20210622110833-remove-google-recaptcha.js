const {
  down: removeRecaptcha,
  up: addRecaptcha
} = require("./20210208143734-add-google-recaptcha");

module.exports.description = "Remove Recaptcha configuration";

module.exports.up = (migration) => {
  removeRecaptcha(migration);
};

module.exports.down = (migration) => {
  addRecaptcha(migration);
};
