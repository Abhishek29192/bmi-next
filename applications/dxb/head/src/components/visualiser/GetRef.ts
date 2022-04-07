/*
 * Content refs are handled by the frontend because they can also have custom handlers.
 * for example, youtube:8hWsalYQhWk or fa:fa-user are valid refs too.
 * This method converts a textual ref to either a HTML representation or a URL, depending on if you have options.url set to true.
 * Specific ref protocols (like public: private: fa: youtube: etc) use the options as they wish.
 */

type Options = {
  size?: string;
  contentSource: string;
  dirs?: string[];
  apiHost?: string;
};

type Ref = {
  scheme: string;
  handler: (ref: string, options: Options, r: Ref) => string;
  ref: string;
  fileType: string | null;
  fileParts: string[] | null;
};

export default (ref: string, options: Options) => {
  const r = parse(ref);
  return r?.handler(r.ref, options, r) || undefined;
};

const basicUrl = (url: string) => url;

const contentFile = (ref: string, options: Options, r: Ref) => {
  let url = r.scheme == "public" ? "/content/" : "/content-private/";

  let dirs = ref.split("/");
  ref = dirs.pop()!;
  if (options && options.dirs) {
    dirs = dirs.concat(options.dirs);
  }

  let hadServer = false;

  if (dirs.length > 0) {
    // If dirs[0] contains . then it's a server address (for example, public:mycdn.com/123.jpg
    if (dirs[0].indexOf(".") != -1) {
      const addr = dirs.shift();
      url = "//" + addr + url;
      hadServer = true;
    }

    url += dirs.join("/") + "/";
  }

  if (!hadServer && options && options.contentSource) {
    url = options.contentSource + url;
  }

  const fileParts = ref.split(".");
  const id = fileParts.shift();
  const type = fileParts.join(".");

  const video =
    type == "mp4" || type == "ogg" || type == "webm" || type == "avi";

  url =
    url +
    id +
    "-" +
    (video || type == "svg" || type == "apng" || type == "gif"
      ? "original"
      : (options && options.size) || "original") +
    "." +
    type;

  if (options && options.apiHost) {
    url = options.apiHost + url;
  }

  return url;
};

const protocolHandlers: {
  [index: string]: (ref: string, options: Options, r: Ref) => string;
} = {
  public: contentFile,
  private: contentFile,
  url: basicUrl,
  http: basicUrl,
  https: basicUrl,
  fa: basicUrl,
  fas: basicUrl,
  far: basicUrl,
  fad: basicUrl,
  fal: basicUrl,
  fab: basicUrl,
  fr: basicUrl, // Four Roads icon fonts use "fr" as opposed to "fa"
  emoji: basicUrl
};

const parse = (ref: string): Ref | undefined => {
  const protoIndex = ref.indexOf(":");

  if (protoIndex == -1) {
    return undefined;
  }

  const scheme = ref.substring(0, protoIndex);
  // eslint-disable-next-line security/detect-object-injection
  const handler = protocolHandlers[scheme];

  if (!handler) {
    return undefined;
  }

  ref = ref.substring(protoIndex + 1);
  let fileParts = null;
  let fileType = null;

  if (ref.indexOf(".") != -1) {
    fileParts = ref.split(".");
    fileType = fileParts[fileParts.length - 1];
  }

  return {
    scheme,
    handler,
    ref,
    fileType,
    fileParts
  };
};
