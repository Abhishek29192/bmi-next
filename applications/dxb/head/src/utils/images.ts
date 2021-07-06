const getJpgImage = (ogImageUrl: string) => {
  let ogImageUrlJpg = ogImageUrl;
  if (ogImageUrlJpg) {
    if (
      ogImageUrlJpg.toLowerCase().indexOf("https://images.ctfassets.net/") > -1
    ) {
      ogImageUrlJpg += (ogImageUrlJpg.indexOf("?") > -1 ? "&" : "?") + "fm=jpg";
    }
  }
  return ogImageUrlJpg;
};

export default getJpgImage;
