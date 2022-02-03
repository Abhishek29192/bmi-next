import { spreadObjectKeys, getNestedValue } from "../object";

describe("spreadObjectKeys utility", () => {
  it("spreads key paths", () => {
    const output = spreadObjectKeys({
      foo: "this is overwritten by foo.bar",
      "foo.bar": "valueA"
    });

    expect(output).toEqual({
      foo: {
        bar: "valueA"
      }
    });
  });

  it("handles empty object", () => {
    const output = spreadObjectKeys({});

    expect(output).toEqual({});
  });

  it("does not modify input", () => {
    const input = {
      "foo.bar.baz": "value"
    };

    const output = spreadObjectKeys(input);

    expect({ input, output }).toMatchSnapshot();
  });

  it("handles custom output value formatting", () => {
    const input = {
      "user.name": "Joe",
      "user.age": "42",
      "user.phoneNumber": "07987654321"
    };

    const output = spreadObjectKeys(input, (key, value) => {
      if (key === "user.age") {
        return Number.parseInt(value);
      }

      return value;
    });

    expect(output).toMatchSnapshot();
  });

  it("skips keys with undefined values", () => {
    const input = {
      "user.name": "Joe",
      "user.age": "42",
      "user.phoneNumber": undefined
    };

    const output = spreadObjectKeys(input, (key, value) => {
      if (key === "user.age") {
        return undefined;
      }

      return value;
    });

    expect(output).toMatchSnapshot();
  });

  describe("getNestedValue", () => {
    it("normal case", () => {
      const input = {
        id: "2",
        user: {
          name: "Joe",
          details: {
            email: "userEmail"
          }
        }
      };

      expect(getNestedValue(input, "user.name")).toBe("Joe");
      expect(getNestedValue(input, "user.details.email")).toBe("userEmail");
      expect(getNestedValue(input, "id")).toBe("2");
    });

    it("provide keyString that isn't in the object", () => {
      const input = {
        id: "2",
        account: {
          id: 2
        }
      };

      expect(getNestedValue(input, "user.name")).toBe(null);
      expect(getNestedValue(input, "account.user")).toBe(null);
    });
  });
});
