/* eslint-disable no-undef */
declare module "@elastic/elasticsearch" {
  export const value: Indices["value"];
  export const callstack: Callstack[];
  export const config: unknown;
  export const reset: () => void;
  export const bulk: jest.Mock<
    Promise<{
      body: {
        errors: string[] | null;
        items?: unknown;
      };
    }>
  >;
  export const cat: {
    indices: jest.Mock<any, any>;
  };
}

export interface Indices<
  T = { settings?: unknown; mappings?: unknown; name: string }
> {
  value: Record<string, T>;
  getAlias: (props: { name: string }) => Promise<{ body: Record<string, T> }>;
  delete: ({ index }: { index: string }) => Promise<void>;
  create: ({ index }: { index: string }) => Promise<void>;
  open: (props: unknown) => Promise<void>;
  close: (props: unknown) => Promise<void>;
  putSettings: ({
    index,
    body
  }: {
    index: string;
    body: { settings: unknown };
  }) => Promise<void>;

  putMapping: ({
    index,
    body
  }: {
    index: string;
    body: unknown;
  }) => Promise<void>;

  putAlias: ({ index, name }: { index: string; name: string }) => Promise<void>;
}

export class Client {
  constructor(props: unknown) {
    Object.assign(config, props);
  }
  cat = cat;

  bulk = bulk;

  indices: Indices = {
    value,
    getAlias,
    delete: deleteAlias,
    create,

    open,
    close,

    putSettings,

    putMapping,

    putAlias
  };
}

type Callstack = { name: string; props: unknown };
export const callstack: Callstack[] = [];

const addToCallstack = (name: string, props: unknown) =>
  callstack.push({ name, props });

const INITIAL_INDICES_VALUE = {
  "alias-1_2": { name: "alias-old" }
};

export const value: Indices["value"] = INITIAL_INDICES_VALUE;
export const getAlias: Indices["getAlias"] = jest.fn(
  async (props: { name: string }) => {
    addToCallstack("getAlias", props);

    if (props.name === "alias-2") {
      throw new Error(`Alias with ${props.name} not found`);
    }
    if (props.name === "alias-3") {
      return { body: { "alias-3_1": { name: "alias-3" } } };
    }

    return { body: value };
  }
);

export const deleteAlias: Indices["delete"] = jest.fn(async (props) => {
  addToCallstack("delete", props);
  delete value[props.index.toString()];
});

export const create: Indices["create"] = jest.fn(async (props) => {
  addToCallstack("create", props);
  Object.assign(value, { [props.index]: {} });
});

export const open: Indices["open"] = jest.fn(async (props) => {
  addToCallstack("open", props);
});
export const close: Indices["close"] = jest.fn(async (props) => {
  addToCallstack("close", props);
});

export const putSettings: Indices["putSettings"] = jest.fn(async (props) => {
  addToCallstack("putSettings", props);
  value[props.index.toString()].settings = props.body.settings;
});

export const putMapping: Indices["putMapping"] = jest.fn(async (props) => {
  addToCallstack("putMapping", props);
  value[props.index.toString()].mappings = props.body;
});

export const putAlias: Indices["putAlias"] = jest.fn(async (props) => {
  addToCallstack("putAlias", props);
  Object.assign(value, { [props.index]: { name: props.name } });
});

export const bulk = jest.fn(async (props: unknown) => {
  addToCallstack("bulk", props);

  return { body: { errors: null } };
});

export const config = {};

export const reset = () => {
  const clearObject = (obj: any) => {
    Object.keys(obj).forEach((key) => delete obj[key.toString()]);
  };

  clearObject(value);
  Object.assign(value, INITIAL_INDICES_VALUE);
  clearObject(config);

  [...callstack].forEach(() => callstack.pop());
};

export const cat = {
  indices: jest.fn().mockResolvedValue({
    body: "alias-0_2\nalias-1_0\nalias-1_1"
  })
};
