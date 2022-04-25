import mockConsole from "jest-mock-console";
import "@testing-library/jest-dom";

mockConsole(["error", "warn"]);
