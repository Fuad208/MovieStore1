// client/src/layouts/AdminLayout/AdminLayout.js
import React, { useState, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, useMediaQuery, useTheme } from '@material-ui/core';
import { Footer, Sidebar, Topbar } from './components';
import PropTypes from 'prop-types';

// Component styles
import styles from './styles';

const useStyles = makeStyles(styles);

const AdminLayout = ({ children, title = 'Dashboard' }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Auto-close sidebar on mobile when screen size changes
  React.useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  const drawerVariant = useMemo(() => 
    isMobile ? 'temporary' : 'persistent', 
    [isMobile]
  );

  const shouldShowBackdrop = useMemo(() => 
    isMobile && isOpen, 
    [isMobile, isOpen]
  );

  return (
    <>
      <Topbar
        title={title}
        ToolbarClasses={classes.topbar}
        isSidebarOpen={isOpen}
        onToggleSidebar={handleToggleOpen}
      />
      
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawerPaper }}
        open={isOpen}
        onClose={handleClose}
        variant={drawerVariant}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
          BackdropProps: {
            invisible: !shouldShowBackdrop
          }
        }}
      >
        <Sidebar className={classes.sidebar} />
      </Drawer>
      
      <main
        className={`${classes.content} ${isOpen ? classes.contentShift : ''}`}
      >
        {children}
        <Footer />
      </main>
    </>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

export default AdminLayout;