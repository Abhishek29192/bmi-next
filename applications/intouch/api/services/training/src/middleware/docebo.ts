import { Docebo } from "../apis";

export default (req, res, next) => {
  req.docebo = new Docebo();
  return next();
};
