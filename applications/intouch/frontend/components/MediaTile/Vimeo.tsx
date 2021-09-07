// import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
// import Modal from "@material-ui/core/Modal";
// import Fade from "@material-ui/core/Fade";
// // TODO:
// // - Pull out all the modal logic from here now it's working and get it in the
// //   Media Grid component as a carousel
// // - Clean up the styles and stick them in the module as SCSS

// function getModalStyle() {
//   const top = 50;
//   const left = 50;

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`
//   };
// }

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     paper: {
//       position: "absolute",
//       width: 640,
//       backgroundColor: theme.palette.background.paper,
//       boxShadow: theme.shadows[5],
//       padding: 0,
//       outline: 0
//     }
//   })
// );
// const classes = useStyles();
// const [modalStyle] = React.useState(getModalStyle);
// const [open, setOpen] = React.useState(false);

// const handleOpen = () => {
//   setOpen(true);
// };

// const handleClose = () => {
//   setOpen(false);
// }; // WIP: I'm not certain how robust this will be
// function getVimeoEmbed(url) {
//   let id = url.split("/").pop();
//   return `https://player.vimeo.com/video/${id}?title=0&portrait=0`;
// }

// function VideoModal() {
//   if (url.includes("vimeo"))
//     return (
//       <div style={modalStyle} className={classes.paper}>
//         <iframe
//           src={getVimeoEmbed(url)}
//           width="640"
//           height="360"
//           frameBorder="0"
//           allow="autoplay; fullscreen; picture-in-picture"
//           allowFullScreen
//           style={{ display: "block" }}
//         ></iframe>
//       </div>
//     );
//   else
//     return (
//       <div style={modalStyle} className={classes.paper}>
//         <img src={url} style={{ maxWidth: "100%", display: "block" }} />
//       </div>
//     );
// }

/* <Modal open={open} onClose={handleClose}>
  <Fade in={open}>
    <VideoModal />
  </Fade>
</Modal> */
