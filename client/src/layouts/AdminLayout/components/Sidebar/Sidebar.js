// client/src/layouts/AdminLayout/components/Sidebar/Sidebar.js
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import {
  makeStyles,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import AccountBoxIcon from '@material-ui/icons/AccountBoxOutlined';
import MovieIcon from '@material-ui/icons/MovieOutlined';
import TheatersIcon from '@material-ui/icons/TheatersOutlined';
import ScheduleIcon from '@material-ui/icons/ScheduleOutlined';
import BookOnlineIcon from '@material-ui/icons/BookOnlineOutlined';

import styles from './styles';

const useStyles = makeStyles(styles);

const Sidebar = ({ className }) => {
  const classes = useStyles();
  const location = useLocation();
  const user = useSelector(state => state.authState.user);

  const navigationItems = useMemo(() => [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: DashboardIcon,
      visible: true
    },
    {
      path: '/admin/movies',
      label: 'Movies',
      icon: MovieIcon,
      visible: true
    },
    {
      path: '/admin/cinemas',
      label: 'Cinemas',
      icon: TheatersIcon,
      visible: true
    },
    {
      path: '/admin/showtimes',
      label: 'Showtimes',
      icon: ScheduleIcon,
      visible: true
    },
    {
      path: '/admin/reservations',
      label: 'Reservations',
      icon: BookOnlineIcon,
      visible: true
    },
    {
      path: '/admin/users',
      label: 'Users',
      icon: PeopleIcon,
      visible: user?.role === 'superadmin'
    },
    {
      path: '/admin/account',
      label: 'Account',
      icon: AccountBoxIcon,
      visible: true
    }
  ], [user?.role]);

  const visibleItems = useMemo(() => 
    navigationItems.filter(item => item.visible),
    [navigationItems]
  );

  return (
    <section className={`${classes.root} ${className}`}>
      <List component="nav" disablePadding>
        {visibleItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem
              key={item.path}
              button
              className={`${classes.listItem} ${isActive ? classes.activeListItem : ''}`}
              component={NavLink}
              to={item.path}
              exact
            >
              <ListItemIcon className={classes.listItemIcon}>
                <IconComponent />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary={item.label}
              />
            </ListItem>
          );
        })}
      </List>
      
      <Divider className={classes.listDivider} />
      
      <List
        component="nav"
        disablePadding
        subheader={
          <ListSubheader 
            className={classes.listSubheader}
            component="div"
          >
            Support
          </ListSubheader>
        }
      >
        <ListItem
          button
          className={classes.listItem}
          component="a"
          href="http://georgesimos.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="Customer support"
          />
        </ListItem>
      </List>
    </section>
  );
};

export default Sidebar;