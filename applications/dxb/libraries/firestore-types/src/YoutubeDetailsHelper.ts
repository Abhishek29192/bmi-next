const createYoutubeDetails = () => ({
  uploadStatus: "processed",
  thumbnails: {
    default: {
      height: 90,
      url: "https://i.ytimg.com/vi/item-id/default.jpg",
      width: 120
    },
    medium: {
      height: 180,
      url: "https://i.ytimg.com/vi/item-id/mqdefault.jpg",
      width: 320
    },
    high: {
      height: 360,
      url: "https://i.ytimg.com/vi/item-id/hqdefault.jpg",
      width: 480
    },
    standard: {
      height: 480,
      url: "https://i.ytimg.com/vi/item-id/sddefault.jpg",
      width: 640
    },
    maxres: {
      height: 720,
      url: "https://i.ytimg.com/vi/item-id/maxresdefault.jpg",
      width: 1280
    }
  },
  embedWidth: 17776,
  embedHeight: 9999
});

export default createYoutubeDetails;
