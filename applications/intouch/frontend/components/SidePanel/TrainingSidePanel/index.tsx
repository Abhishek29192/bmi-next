import React from "react";
import Typography from "@bmi/typography";
import { FilterResult } from "../../FilterResult";
import { SidePanel } from "../";

const trainingFilters = [
  { label: "All", attr: "all" },
  { label: "Flat", attr: "flat" },
  { label: "Pitched", attr: "pitched" }
];
const trainingDetails = [
  { label: "Specialised Training Moisture and Ventilation" },
  { label: "E-Learning course" },
  { label: "Course title" },
  { label: "Course title" }
];

//Dummy courses for training page
const courses = trainingDetails.map((course) => (
  <FilterResult label={course.label} key={course.label}>
    <Typography>GRADE</Typography>
  </FilterResult>
));
export const TrainingSidePanel = () => (
  <SidePanel searchLabel="Search for training" filters={trainingFilters}>
    {courses}
  </SidePanel>
);
