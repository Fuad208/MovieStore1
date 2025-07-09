import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Button, Typography, LinearProgress } from '@material-ui/core';
import { CloudUpload as UploadIcon, AttachFile as FileIcon } from '@material-ui/icons';
import Paper from '../Paper';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(3),
    textAlign: 'center',
    transition: 'border-color 0.2s ease-in-out'
  },
  dragActive: {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '10'
  },
  input: {
    display: 'none'
  },
  button: {
    minWidth: 120,
    marginBottom: theme.spacing(2)
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  },
  fileIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  fileName: {
    color: theme.palette.text.primary,
    fontWeight: 500
  },
  fileSize: {
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(1)
  },
  error: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1)
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  dropZone: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  }
});

const FileUpload = props => {
  const { 
    classes, 
    className, 
    file, 
    onUpload,
    accept = 'image/*',
    maxSize = 5 * 1024 * 1024, // 5MB
    multiple = false,
    disabled = false,
    showProgress = false,
    uploadProgress = 0,
    ...rest 
  } = props;

  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    if (file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const handleFiles = useCallback((files) => {
    setError('');
    const fileList = Array.from(files);
    
    if (!multiple && fileList.length > 1) {
      setError('Only one file is allowed');
      return;
    }

    const validFiles = [];
    for (const file of fileList) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push(file);
    }

    if (onUpload) {
      onUpload(multiple ? validFiles : validFiles[0]);
    }
  }, [multiple, maxSize, onUpload]);

  const handleUpload = useCallback((event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const rootClassName = classNames(
    classes.root,
    {
      [classes.dragActive]: dragActive,
      [classes.dropZone]: !disabled
    },
    className
  );

  const renderFileInfo = () => {
    if (!file) return null;

    const files = Array.isArray(file) ? file : [file];
    
    return files.map((f, index) => (
      <div key={index} className={classes.fileInfo}>
        <FileIcon className={classes.fileIcon} />
        <Typography variant="body2" className={classes.fileName}>
          {f.name}
        </Typography>
        <Typography variant="caption" className={classes.fileSize}>
          ({formatFileSize(f.size)})
        </Typography>
      </div>
    ));
  };

  return (
    <Paper 
      className={rootClassName}
      onDragEnter={!disabled ? handleDragIn : undefined}
      onDragLeave={!disabled ? handleDragOut : undefined}
      onDragOver={!disabled ? handleDrag : undefined}
      onDrop={!disabled ? handleDrop : undefined}
      {...rest}
    >
      <input
        accept={accept}
        className={classes.input}
        id="file-upload-input"
        type="file"
        multiple={multiple}
        onChange={handleUpload}
        disabled={disabled}
      />
      <label htmlFor="file-upload-input">
        <Button
          variant="outlined"
          className={classes.button}
          component="span"
          disabled={disabled}
          startIcon={<UploadIcon />}
        >
          {file ? 'Change File' : 'Upload File'}
        </Button>
      </label>
      
      {!file && (
        <Typography variant="body2" color="textSecondary">
          {dragActive ? 'Drop files here' : 'Drag and drop files here or click to upload'}
        </Typography>
      )}

      {renderFileInfo()}

      {error && (
        <Typography variant="body2" className={classes.error}>
          {error}
        </Typography>
      )}

      {showProgress && uploadProgress > 0 && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          className={classes.progress}
        />
      )}
    </Paper>
  );
};

FileUpload.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  file: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  onUpload: PropTypes.func,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  showProgress: PropTypes.bool,
  uploadProgress: PropTypes.number
};

export default withStyles(styles)(FileUpload);