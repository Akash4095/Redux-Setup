import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItem: {
    display: 'inline-block',
    // marginRight: theme.spacing(2),
  },
  nested: {
    // paddingLeft: theme.spacing(4),
  },
}));

const TopMenuItem = ({ label, subMenuItems }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem button onClick={handleClick} className={classes.listItem}>
        <ListItemText primary={label} />
      </ListItem>
      {label === 'Master' && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding style={{display: "flex"}}>
            {subMenuItems.map((item) => (
              <React.Fragment key={item.label}>
                <ListItem button component={item.subMenuItems ? 'div' : Link} to={`/${item.label.toLowerCase()}`} className={classes.nested}>
                  <ListItemText primary={item.label} />
                </ListItem>
                {item.subMenuItems && (
                  <List component="div" disablePadding>
                    {item.subMenuItems.map((subItem) => (
                      <ListItem key={subItem.label} button component={Link} to={`/${subItem.label.toLowerCase()}`} className={classes.nested}>
                        <ListItemText primary={subItem.label} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </React.Fragment>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default TopMenuItem;
