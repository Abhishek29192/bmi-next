import Migration from "contentful-migration";

export const description = "Add social-media links to Service";

type Fields = { [index: string]: string };

const fields: Fields = {
  facebook: "Facebook",
  twitter: "Twitter",
  instagram: "Instagram",
  linkedIn: "LinkedIn"
};

const keys = Object.keys(fields);

module.exports.up = (migration: Migration) => {
  const roofer = migration.editContentType("roofer");

  keys.forEach((key, index) => {
    roofer.createField(key).name(fields[key]).type("Symbol");

    roofer.changeFieldControl(key, "builtin", "singleLine", {
      helpText: `Please add the ID of the social media, e.g.: for 'https://www.${key}.com/bmigroupcom/' use 'bmigroupcom'`
    });

    const afterField = index ? keys[index - 1] : "website";
    roofer.moveField(key).afterField(afterField);
  });
};

module.exports.down = (migration: Migration) => {
  const roofer = migration.editContentType("roofer");

  keys.forEach((key) => {
    roofer.deleteField(key);
  });
};
