import { TagData } from "../../components/Tag";

const createTagData = (tag?: Partial<TagData>): TagData => ({
  type: "Group",
  title: "Tag Title",
  ...tag
});

export default createTagData;
