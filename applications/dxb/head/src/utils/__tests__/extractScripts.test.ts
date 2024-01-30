import { extractScripts } from "../extractScripts";

describe("extractScripts", () => {
  it("should extract script properties and content", () => {
    const htmlString = `
      <script src="https://www.example.com/script1.js"></script>
      <script src="https://www.example.com/script2.js"></script>
      <script type="module">
        console.log('Hello, World!');
      </script>
    `;

    const result = extractScripts(htmlString);

    expect(result).toEqual([
      {
        props: { src: "https://www.example.com/script1.js" },
        content: ""
      },
      {
        props: { src: "https://www.example.com/script2.js" },
        content: ""
      },
      {
        props: { type: "module" },
        content: "console.log('Hello, World!');"
      }
    ]);
  });

  it("should handle scripts with no properties", () => {
    const htmlString = `
      <script>
        console.log('No props!');
      </script>
    `;

    const result = extractScripts(htmlString);

    expect(result).toEqual([
      {
        props: {},
        content: "console.log('No props!');"
      }
    ]);
  });

  it("should return empty array if no script tag is found", () => {
    const htmlString = `
        console.log('No scripts!');
    `;

    const result = extractScripts(htmlString);

    expect(result).toEqual([]);
  });
});
