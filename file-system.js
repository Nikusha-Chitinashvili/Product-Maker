/**
 * Enhanced file system functionality for Product Template Generator
 * Provides advanced file saving capabilities and folder selection
 */

class FileSystemHelper {
    constructor() {
        this.supportsFSA = 'showDirectoryPicker' in window && 'showSaveFilePicker' in window;
        this.permissions = {};
    }

    /**
     * Checks if the browser supports File System Access API
     * @returns {boolean} - Whether FSA is supported
     */
    isFileSystemAccessSupported() {
        return this.supportsFSA;
    }

    /**
     * Requests permission to a directory
     * @param {string} directoryName - A friendly name for the directory to request
     * @returns {Promise<FileSystemDirectoryHandle>} - The directory handle
     */
    async requestDirectoryPermission(directoryName = 'ჩამოტვირთულები') {
        if (!this.supportsFSA) {
            throw new Error('ბრაუზერი არ უჭერს მხარს ფაილური სისტემის API-ს');
        }

        try {
            // Ask user to select a directory
            const dirHandle = await window.showDirectoryPicker({
                id: 'product-templates',
                startIn: 'downloads',
                mode: 'readwrite'
            });
            
            // Store the permission
            this.permissions[directoryName] = dirHandle;
            return dirHandle;
        } catch (error) {
            console.error('ფოლდერის წვდომის ნებართვა უარყოფილი იქნა', error);
            throw error;
        }
    }
    
    /**
     * Saves an image to a specific location
     * @param {string} imageData - Image data URL
     * @param {string} fileName - Name for the file
     * @param {string} directoryName - Directory name to save to
     * @returns {Promise<boolean>} - Success flag
     */
    async saveImageToDirectory(imageData, fileName, directoryName) {
        if (!this.supportsFSA) {
            return this.legacySaveImage(imageData, fileName);
        }
        
        try {
            let dirHandle = this.permissions[directoryName];
            
            // If we don't have permission yet, request it
            if (!dirHandle) {
                dirHandle = await this.requestDirectoryPermission(directoryName);
            }
            
            // Verify we have permission
            const opts = {mode: 'readwrite'};
            const permissionState = await dirHandle.queryPermission(opts);
            
            if (permissionState === 'granted') {
                // Create or get the file
                const fileHandle = await dirHandle.getFileHandle(fileName, {create: true});
                
                // Create a writable stream
                const writable = await fileHandle.createWritable();
                
                // Convert data URL to blob
                const res = await fetch(imageData);
                const blob = await res.blob();
                
                // Write the blob to the file
                await writable.write(blob);
                await writable.close();
                
                return true;
            } else if (permissionState === 'prompt') {
                // Need to request permission again
                await dirHandle.requestPermission(opts);
                return this.saveImageToDirectory(imageData, fileName, directoryName);
            } else {
                throw new Error('ფოლდერზე წვდომა უარყოფილ იქნა');
            }
        } catch (error) {
            console.error('სურათის შენახვა ვერ მოხერხდა', error);
            return this.legacySaveImage(imageData, fileName);
        }
    }
    
    /**
     * Legacy method to save images without File System Access API
     * @param {string} imageData - Image data URL
     * @param {string} fileName - Name for the file
     * @returns {boolean} - Success flag
     */
    legacySaveImage(imageData, fileName) {
        try {
            const link = document.createElement('a');
            link.href = imageData;
            link.download = fileName;
            link.click();
            return true;
        } catch (error) {
            console.error('სურათის ჩამოტვირთვა ვერ მოხერხდა', error);
            return false;
        }
    }
    
    /**
     * Verifies if we have permission to a directory
     * @param {string} directoryName - Directory name to check
     * @returns {Promise<boolean>} - Whether permission is granted
     */
    async verifyDirectoryPermission(directoryName) {
        if (!this.supportsFSA) return false;
        
        const dirHandle = this.permissions[directoryName];
        if (!dirHandle) return false;
        
        try {
            const permissionStatus = await dirHandle.queryPermission({mode: 'readwrite'});
            return permissionStatus === 'granted';
        } catch (error) {
            return false;
        }
    }
}

// Create global instance
window.fileSystem = new FileSystemHelper();
