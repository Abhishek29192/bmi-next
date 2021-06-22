import {
  down as removeRecaptcha,
  up as addRecaptcha
} from "./20210208143734-add-google-recaptcha";

module.exports.description = "Remove Recaptcha configuration";

module.exports.up = (migration) => {
  removeRecaptcha();
};

module.exports.down = (migration) => {
  addRecaptcha();
};
