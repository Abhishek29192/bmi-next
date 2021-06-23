import TileViewer from "./Visualiser/TileViewer/TileViewer.jsx";
import HouseViewer from "./Visualiser/HouseViewer/HouseViewer.jsx";
import GetRef from "./Visualiser/Functions/GetRef/GetRef";
import "./style.scss";

export { GetRef, TileViewer, HouseViewer };

// -- contentSource --
// * The above json has "refs" in it. For example, normalMapRef: "public:14.jpg"
// * 14.jpg was resized when it was uploaded, meaning the content directory contains, for example, 14-256.jpg. The original unedited upload is 14-original.jpg.
// * "Refs" are our compact way of representing this little set of files, without storing a rigid URL in the database.
// * When a ref is converted into an actual URL, contentSource is prepended.
// * A "public:" ref is mapped to {contentSource}/content/{id}-{wantedSize}.{type}
//   For example, requesting the original size 14.jpg and a content source of https://mybucket.s3.amazonaws.com would result in the URL https://mybucket.s3.amazonaws.com/content/14-original.jpg
// * Can always change the mapping behaviour by editing the Source/Visualiser/Functions/GetRef/GetRef.js function.
