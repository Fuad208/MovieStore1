const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * File upload configuration with improved error handling and validation
 */
class FileUploadService {
  constructor() {
    this.allowedMimeTypes = [
      'image/png',
      'image/jpg', 
      'image/jpeg',
      'image/gif',
      'image/webp'
    ];
    
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
  }

  /**
   * Create storage configuration
   * @param {string} uploadPath - Upload directory path
   * @returns {multer.StorageEngine} Storage configuration
   */
  createStorage(uploadPath) {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        const fullPath = path.join('./uploads', uploadPath);
        
        // Ensure directory exists
        this.ensureDirectoryExists(fullPath, (err) => {
          if (err) {
            return cb(err);
          }
          cb(null, fullPath);
        });
      },
      filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, fileExtension);
        const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
        
        const filename = `${sanitizedBaseName}_${uniqueSuffix}${fileExtension}`;
        cb(null, filename);
      },
    });
  }

  /**
   * File filter function
   * @param {Object} req - Express request object
   * @param {Object} file - Multer file object
   * @param {Function} cb - Callback function
   */
  fileFilter(req, file, cb) {
    // Check file type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      const error = new Error(`Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`);
      error.code = 'INVALID_FILE_TYPE';
      return cb(error, false);
    }

    // Check file extension
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      const error = new Error(`Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`);
      error.code = 'INVALID_FILE_EXTENSION';
      return cb(error, false);
    }

    cb(null, true);
  }

  /**
   * Create upload middleware
   * @param {string} uploadPath - Upload directory path
   * @param {Object} options - Additional options
   * @returns {multer.Multer} Multer middleware
   */
  createUpload(uploadPath, options = {}) {
    const config = {
      storage: this.createStorage(uploadPath),
      fileFilter: this.fileFilter.bind(this),
      limits: {
        fileSize: options.maxFileSize || this.maxFileSize,
        files: options.maxFiles || 5,
      },
      ...options
    };

    return multer(config);
  }

  /**
   * Ensure directory exists, create if not
   * @param {string} dirPath - Directory path
   * @param {Function} callback - Callback function
   */
  ensureDirectoryExists(dirPath, callback) {
    fs.access(dirPath, fs.constants.F_OK, (err) => {
      if (err) {
        // Directory doesn't exist, create it
        fs.mkdir(dirPath, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            console.error('Error creating directory:', mkdirErr);
            return callback(mkdirErr);
          }
          console.log(`Directory created: ${dirPath}`);
          callback(null);
        });
      } else {
        // Directory exists
        callback(null);
      }
    });
  }

  /**
   * Delete uploaded file
   * @param {string} filePath - File path to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(filePath) {
    try {
      await fs.promises.unlink(filePath);
      console.log(`File deleted: ${filePath}`);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Get file info
   * @param {string} filePath - File path
   * @returns {Promise<Object>} File information
   */
  async getFileInfo(filePath) {
    try {
      const stats = await fs.promises.stat(filePath);
      const fileExtension = path.extname(filePath);
      const fileName = path.basename(filePath);
      
      return {
        exists: true,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        extension: fileExtension,
        name: fileName,
        path: filePath
      };
    } catch (error) {
      return {
        exists: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const fileUploadService = new FileUploadService();

// Export factory functions for backward compatibility
const upload = (uploadPath, options = {}) => {
  return fileUploadService.createUpload(uploadPath, options);
};

module.exports = upload; // hanya ekspor fungsi upload
