import React from "react";
import { Typography } from "@bmi-digital/components";
import { FilterResult } from "../FilterResult";
import { SidePanel } from ".";

export default {
  title: "Side Panel",
  component: SidePanel
};

const projectFilters = [
  { label: "Not started", attr: "notStarted" },
  { label: "In progress", attr: "inProgress" },
  { label: "Completed", attr: "completed" },
  { label: "Flat", attr: "flat" },
  { label: "Pitched", attr: "pitched" }
];

const projectDetails = [
  { name: "Old Brompton Library", company: "JS Roofers" },
  { name: "Kensington School", company: "Mark's Roofing" },
  { name: "Greenwich Observatory", company: "Horizon Roofing Co" },
  { name: "Camden Crown Pub", company: "JS Roofers" },
  { name: "Leyton Sports Hall", company: "JS Roofers" }
];

const trainingFilters = [
  { label: "All", attr: "all" },
  { label: "Flat", attr: "flat" },
  { label: "Pitched", attr: "pitched" }
];

const peopleDetails = [
  {
    name: "Mike Harold",
    jobTitle: "Owner",
    companyName: "JS Roofers"
  },
  {
    name: "Lisa Simpson",
    jobTitle: "Installer",
    companyName: "Skylight Roofing Ltd"
  },
  {
    name: "Malcolm Little",
    jobTitle: "Installer",
    companyName: "Skylight Roofing Ltd"
  },
  {
    name: "Tom Cruise",
    jobTitle: "Installer",
    companyName: "Skylight Roofing Ltd"
  },
  {
    name: "Malcolm Little",
    jobTitle: "Installer",
    companyName: "Skylight Roofing Ltd"
  },
  {
    name: "Tobey Maguire",
    jobTitle: "Installer",
    companyName: "Skylight Roofing Ltd"
  }
];

const trainingDetails = [
  { label: "Specialised Training Moisture and Ventilation" },
  { label: "E-Learning course" },
  { label: "Course title" },
  { label: "Course title" },
  { label: "Course title" },
  { label: "Course title" },
  { label: "Course title" },
  { label: "Course title" },
  { label: "Course title" }
];

const projects = projectDetails.map((project) => (
  <FilterResult label={project.name} key={project.name}>
    <Typography>{project.company}</Typography>
  </FilterResult>
));

const people = peopleDetails.map((person) => (
  <FilterResult label={person.name} key={person.name}>
    <Typography>{person.jobTitle}</Typography>
  </FilterResult>
));

const courses = trainingDetails.map((course) => (
  <FilterResult label={course.label} key={course.label}>
    <Typography>GRADE</Typography>
  </FilterResult>
));

export const Projects = () => (
  <SidePanel searchLabel="Search for a project" filters={projectFilters}>
    {projects}
  </SidePanel>
);

export const Training = () => (
  <SidePanel searchLabel="Search for training" filters={trainingFilters}>
    {courses}
  </SidePanel>
);

export const Team = () => (
  <SidePanel searchLabel="Search team">{people}</SidePanel>
);
