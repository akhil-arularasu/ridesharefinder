import React from 'react';
import { Modal, Backdrop, Fade } from '@material-ui/core';

function LoomVideoModal(props) {
  const handleClose = () => {
    props.close();
  };

  // Styles for fullscreen modal content
  const modalStyle = {
    position: 'relative',
    width: '50%', // Width of the modal (90% of the screen width)
    height: '60%', // Height of the modal (80% of the screen height)
    backgroundColor: 'transparent',
    padding: '10px',
    borderRadius: '4px',
    overflow: 'hidden', // This ensures no scrollbars appear
    display: 'flex', // Ensures content is centered
    alignItems: 'center', // Vertically center
    justifyContent: 'center', // Horizontally center
  };

  // Calculate aspect ratio for the iframe
  const iframeStyle = {
    width: '100%', // Take full width of the modal content div
    height: '100%', // Take full height of the modal content div
    border: 'none'
  };

  return (
    <Modal
      open={props.isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Fade in={props.isOpen}>
        <div style={modalStyle}>
          <iframe
            src="https://www.loom.com/embed/bf21430ff95e44a9b1be2495dcbaaef5?sid=7bb5b5d5-7f5e-4ce5-9a6a-741fef79b4a0"
            allowFullScreen
            style={iframeStyle}
            title="Loom Video"
          ></iframe>
        </div>
      </Fade>
    </Modal>
  );
}

export default LoomVideoModal;
