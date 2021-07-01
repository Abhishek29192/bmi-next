// TODO: resolve eslint issues:
/* eslint-disable */
/*
 * Content refs are handled by the frontend because they can also have custom handlers.
 * for example, youtube:8hWsalYQhWk or fa:fa-user are valid refs too.
 * This method converts a textual ref to either a HTML representation or a URL, depending on if you have options.url set to true.
 * Specific ref protocols (like public: private: fa: youtube: etc) use the options as they wish.
 */
import React from "react";

export default function getRef(ref, options) {
  var r = getRef.parse(ref);
  return r ? r.handler(r.ref, options || {}, r) : null;
}

function basicUrl(url, options) {
  if (options.url) {
    return url;
  }

  // React component by default:
  return <img src={url} {...options.attribs} />;
}

function contentFile(ref, options, r) {
  var url = r.scheme == "public" ? "/content/" : "/content-private/";

  var dirs = ref.split("/");
  ref = dirs.pop();
  if (options.dirs) {
    dirs = dirs.concat(options.dirs);
  }

  var hadServer = false;

  if (dirs.length > 0) {
    // If dirs[0] contains . then it's a server address (for example, public:mycdn.com/123.jpg
    if (dirs[0].indexOf(".") != -1) {
      var addr = dirs.shift();
      url = "//" + addr + url;
      hadServer = true;
    }

    url += dirs.join("/") + "/";
  }

  if (!hadServer && options.contentSource) {
    url = options.contentSource + url;
  }

  var fileParts = ref.split(".");
  var id = fileParts.shift();
  var type = fileParts.join(".");

  var video = type == "mp4" || type == "ogg" || type == "webm" || type == "avi";

  url =
    url +
    id +
    "-" +
    (video || type == "svg" || type == "apng" || type == "gif"
      ? "original"
      : options.size || "original") +
    "." +
    type;

  if (options.apiHost) {
    url = options.apiHost + url;
  }

  if (options.url) {
    return url;
  }

  if (video) {
    return (
      <video
        src={url}
        width={options.size || 256}
        controls
        {...options.attribs}
      />
    );
  }

  // React component by default:
  return (
    <img src={url} width={options.size || undefined} {...options.attribs} />
  );
}

function fontAwesomeIcon(ref, options, r) {
  // Note: doesn't support options.url (yet!)
  if (options.url) {
    return "";
  }

  // allows us to specify FontAwesome modifier classes, e.g. fa-fw
  var className = r.scheme + " " + ref;

  if (options.className) {
    className += " " + options.className;
  }

  return <i className={className} {...options.attribs} />;
}

function emojiStr(ref, options) {
  // Note: doesn't support options.url (yet!)
  if (options.url) {
    return "";
  }
  var emojiString = String.fromCodePoint.apply(
    String,
    ref.split(",").map((num) => parseInt("0x" + num))
  );
  return (
    <span className="emoji" {...options.attribs}>
      {emojiString}
    </span>
  );
}

var protocolHandlers = {
  public: contentFile,
  private: contentFile,
  url: basicUrl,
  http: basicUrl,
  https: basicUrl,
  fa: fontAwesomeIcon,
  fas: fontAwesomeIcon,
  far: fontAwesomeIcon,
  fad: fontAwesomeIcon,
  fal: fontAwesomeIcon,
  fab: fontAwesomeIcon,
  fr: fontAwesomeIcon, // Four Roads icon fonts use "fr" as opposed to "fa"
  emoji: emojiStr
};

getRef.parse = (ref) => {
  if (!ref) {
    return null;
  }
  if (ref.scheme) {
    return ref;
  }
  var protoIndex = ref.indexOf(":");

  if (protoIndex == -1) {
    return null;
  }

  var scheme = ref.substring(0, protoIndex);
  var handler = protocolHandlers[scheme];

  if (!handler) {
    return null;
  }

  ref = ref.substring(protoIndex + 1);
  var fileParts = null;
  var fileType = null;

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

/*
 * Convenience method for identifying visual refs (including videos).
 */
var imgTypes = [
  "png",
  "jpeg",
  "jpg",
  "gif",
  "mp4",
  "svg",
  "bmp",
  "apng",
  "avif",
  "webp"
];

getRef.isImage = (ref) => {
  var info = getRef.parse(ref);
  if (!info) {
    return false;
  }

  if (info.scheme == "private") {
    return false;
  } else if (
    info.scheme == "url" ||
    info.scheme == "http" ||
    info.scheme == "https" ||
    info.scheme == "public"
  ) {
    return imgTypes.indexOf(info.fileType) != -1;
  }

  // All other ref types are visual:
  return true;
};