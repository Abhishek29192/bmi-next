import React, { useRef } from "react";
import { render, screen } from "@testing-library/react";
import { Note } from "@bmi/intouch-api-types";
import { NoteTab } from "..";

jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

describe("NoteTab Components", () => {
  describe("render correct number of notes", () => {
    it("none", () => {
      render(<NoteTab notes={[]} />);
      expect(screen.queryByTestId("note-item")).toBeNull();
    });
    it("one note", () => {
      const notes: Note[] = [
        {
          nodeId: "1",
          id: 1,
          body: "Note body",
          createdAt: "01/01/01",
          updatedAt: "01/01/01"
        }
      ];
      render(<NoteTab notes={notes} />);
      expect(screen.getAllByTestId("note-item")).toHaveLength(1);
    });
    it("3 notes", () => {
      const notes: Note[] = [
        {
          nodeId: "1",
          id: 1,
          body: "Note body",
          createdAt: "01/01/01",
          updatedAt: "01/01/01"
        },
        {
          nodeId: "2",
          id: 2,
          body: "Note body",
          createdAt: "01/01/01",
          updatedAt: "01/01/01"
        },
        {
          nodeId: "3",
          id: 3,
          body: "Note body",
          createdAt: "01/01/01",
          updatedAt: "01/01/01"
        }
      ];
      render(<NoteTab notes={notes} />);
      expect(screen.getAllByTestId("note-item")).toHaveLength(3);
    });
  });
});
