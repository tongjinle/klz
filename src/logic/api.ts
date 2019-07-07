import * as rangeApi from "./rangeApi";

const genUniqueId = () => {
  return Math.random()
    .toString()
    .slice(2);
};

export { rangeApi, genUniqueId };
