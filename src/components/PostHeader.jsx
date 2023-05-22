import { MoreHoriz } from '@mui/icons-material';
import { ListItemButton, ListItemText, Modal } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import CustomeAvatar from './CustomeAvatar';

import classes from './PostHeader.module.css';
const PostHeader = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const handleclose = () => setOpenModal(false);

  return (
    <div className={`${classes.container} ${props.className}`}>
      <Modal
        disableAutoFocus
        open={openModal}
        onClose={handleclose}
        className={classes.center}
      >
        <Box className={classes.modalBox}>
          <ListItemButton divider={true} className={classes.listitembtn}>
            <ListItemText
              onClick={handleclose}
              className={`${classes.listitemtext} ${classes.listitemtextimportant}`}
              disableTypography={true}
            >
              Report
            </ListItemText>
          </ListItemButton>
          <ListItemButton divider={true} className={classes.listitembtn}>
            <ListItemText
              onClick={handleclose}
              className={`${classes.listitemtext} ${classes.listitemtextimportant}`}
              disableTypography={true}
            >
              Unfollow
            </ListItemText>
          </ListItemButton>
          <ListItemButton
            divider={true}
            className={classes.listitembtn}
            onClick={props.bookmark}
          >
            <ListItemText
              onClick={handleclose}
              className={classes.listitemtext}
              disableTypography={true}
            >
              {props.bookmarked ? 'Remove from' : 'Add to'} favorites
            </ListItemText>
          </ListItemButton>
          <ListItemButton divider={true} className={classes.listitembtn}>
            <ListItemText
              onClick={handleclose}
              className={classes.listitemtext}
              disableTypography={true}
            >
              Go to post
            </ListItemText>
          </ListItemButton>
          <ListItemButton divider={true} className={classes.listitembtn}>
            <ListItemText
              onClick={handleclose}
              className={classes.listitemtext}
              disableTypography={true}
            >
              Share to...
            </ListItemText>
          </ListItemButton>
          <ListItemButton divider={true} className={classes.listitembtn}>
            <ListItemText
              onClick={handleclose}
              className={classes.listitemtext}
              disableTypography={true}
            >
              Copy link
            </ListItemText>
          </ListItemButton>
          <ListItemButton divider={true} className={classes.listitembtn}>
            <ListItemText
              onClick={handleclose}
              className={classes.listitemtext}
              disableTypography={true}
            >
              Embed
            </ListItemText>
          </ListItemButton>
          <ListItemButton
            divider={true}
            className={classes.listitembtn}
            onClick={handleclose}
          >
            <ListItemText
              className={classes.listitemtext}
              disableTypography={true}
            >
              Cancel
            </ListItemText>
          </ListItemButton>
        </Box>
      </Modal>
      <CustomeAvatar
        src={props.src}
        dispalyUsername={true}
        userName={props.userName}
        id={props.id}
      />
      <MoreHoriz
        className={classes.more}
        fontSize="small"
        onClick={() => setOpenModal(true)}
      />
    </div>
  );
};

export default PostHeader;
