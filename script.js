document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const productForm = document.getElementById('productForm');
    const productName = document.getElementById('productName');
    const productPrice = document.getElementById('productPrice');
    const productImage = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const discountType = document.getElementById('discountType');
    const discountPercentage = document.getElementById('discountPercentage');
    const discountAmount = document.getElementById('discountAmount');
    const percentageField = document.getElementById('percentageField');
    const amountField = document.getElementById('amountField');
    const templateTheme = document.getElementById('templateTheme');
    const currency = document.getElementById('currency');
    const dropZone = document.getElementById('dropZone');
    const badgeText = document.getElementById('badgeText');
    const bgColor = document.getElementById('bgColor');
    
    // Error messages
    const nameError = document.getElementById('nameError');
    const priceError = document.getElementById('priceError');
    const imageError = document.getElementById('imageError');
    const percentageError = document.getElementById('percentageError');
    const amountError = document.getElementById('amountError');
    
    // Image control elements
    const imageControls = document.getElementById('imageControls');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const changeImageBtn = document.getElementById('changeImageBtn');
    
    // Output elements
    const templateContainer = document.getElementById('templateContainer');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadSuccess = document.getElementById('downloadSuccess');
    
    // Loading spinners
    const generateSpinner = document.getElementById('generateSpinner');
    const downloadSpinner = document.getElementById('downloadSpinner');
    
    // Preview control buttons
    const rotateLeftBtn = document.getElementById('rotateLeftBtn');
    const rotateRightBtn = document.getElementById('rotateRightBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetViewBtn = document.getElementById('resetViewBtn');
    
    // Accordion
    const accordionHeader = document.querySelector('.accordion-header');
    const accordionContent = document.querySelector('.accordion-content');
    
    // Save location elements
    const saveLocation = document.getElementById('saveLocation');
    const browseFolderBtn = document.getElementById('browseFolderBtn');
    const rememberFolder = document.getElementById('rememberFolder');
    
    // Default download location
    let downloadPath = localStorage.getItem('downloadPath') || 'downloads';
    
    // Show saved path if exists
    if (localStorage.getItem('downloadPath')) {
        saveLocation.value = localStorage.getItem('downloadPath');
        rememberFolder.checked = true;
    }
    
    // Create folder browser dialog
    function createFolderDialog() {
        const overlay = document.createElement('div');
        overlay.className = 'file-dialog-overlay';
        
        const fileDialog = `
            <div class="file-dialog">
                <div class="file-dialog-header">
                    <span>აირჩიეთ საქაღალდე</span>
                    <button type="button" class="close-btn">&times;</button>
                </div>
                <div class="file-dialog-content">
                    <div class="folder-path" id="currentPath">
                        <i class="fas fa-folder-open"></i> 
                        <span>ჩემი დოკუმენტები</span>
                    </div>
                    
                    <div class="file-browser">
                        <ul class="folder-list" id="folderList">
                            <li class="folder-item" data-path="downloads">
                                <i class="fas fa-folder"></i> ჩამოტვირთულები
                            </li>
                            <li class="folder-item" data-path="documents">
                                <i class="fas fa-folder"></i> დოკუმენტები
                            </li>
                            <li class="folder-item" data-path="pictures">
                                <i class="fas fa-folder"></i> სურათები
                            </li>
                            <li class="folder-item" data-path="desktop">
                                <i class="fas fa-folder"></i> სამუშაო მაგიდა
                            </li>
                            <li class="folder-item" data-path="custom">
                                <i class="fas fa-folder-plus"></i> სხვა ლოკაცია...
                            </li>
                        </ul>
                    </div>
                    
                    <div class="file-dialog-actions">
                        <button type="button" id="cancelSelectFolder">გაუქმება</button>
                        <button type="button" id="confirmSelectFolder">არჩევა</button>
                    </div>
                </div>
            </div>
        `;
        
        overlay.innerHTML = fileDialog;
        document.body.appendChild(overlay);
        
        // Add event listeners
        const closeBtn = overlay.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        const cancelBtn = document.getElementById('cancelSelectFolder');
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        const confirmBtn = document.getElementById('confirmSelectFolder');
        const folderItems = document.querySelectorAll('.folder-item');
        let selectedFolder = downloadPath;
        
        // Highlight the current selected folder
        folderItems.forEach(item => {
            if (item.getAttribute('data-path') === selectedFolder) {
                item.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
                item.style.fontWeight = '600';
            }
            
            item.addEventListener('click', () => {
                // Remove highlight from all items
                folderItems.forEach(i => {
                    i.style.backgroundColor = '';
                    i.style.fontWeight = '';
                });
                
                // Add highlight to selected item
                item.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
                item.style.fontWeight = '600';
                
                selectedFolder = item.getAttribute('data-path');
                
                // If custom path, prompt user
                if (selectedFolder === 'custom') {
                    const customPath = prompt('შეიყვანეთ საქაღალდის ლოკაცია:');
                    if (customPath && customPath.trim() !== '') {
                        selectedFolder = customPath.trim();
                        document.getElementById('currentPath').querySelector('span').textContent = selectedFolder;
                    }
                } else {
                    document.getElementById('currentPath').querySelector('span').textContent = 
                        item.textContent.trim();
                }
            });
        });
        
        confirmBtn.addEventListener('click', () => {
            downloadPath = selectedFolder;
            saveLocation.value = selectedFolder;
            
            // Save path if remember option is checked
            if (rememberFolder.checked) {
                localStorage.setItem('downloadPath', downloadPath);
            }
            
            document.body.removeChild(overlay);
        });
    }
    
    // Open folder browser dialog
    browseFolderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        createFolderDialog();
    });
    
    // Remember folder preference change
    rememberFolder.addEventListener('change', function() {
        if (this.checked && downloadPath) {
            localStorage.setItem('downloadPath', downloadPath);
        } else {
            localStorage.removeItem('downloadPath');
        }
    });
    
    // Form validation state
    let formValid = false;
    
    // Template state
    let rotation = 0;
    let scale = 1;
    
    // Georgian language error messages
    const errorMessages = {
        name: 'გთხოვთ შეიყვანოთ პროდუქტის სახელი',
        price: 'გთხოვთ შეიყვანოთ სწორი ფასი',
        image: 'გთხოვთ აირჩიოთ პროდუქტის სურათი',
        imageType: 'არჩეული ფაილი არ არის სურათი',
        imageSize: 'სურათის ზომა აღემატება 5MB-ს',
        percentage: 'გთხოვთ შეიყვანოთ სწორი პროცენტი (0-100)',
        amount: 'ფასდაკლება არ უნდა აღემატებოდეს პროდუქტის ფასს',
        downloadError: 'სურათის გენერაციის პრობლემა. გთხოვთ სცადოთ თავიდან.',
        downloadErrorImage: 'პრობლემა სურათის გენერაციისას. გთხოვთ სცადოთ თავიდან ან გამოიყენოთ სხვა სურათი.'
    };
    
    // Accordion functionality
    accordionHeader.addEventListener('click', function() {
        this.classList.toggle('active');
        accordionContent.classList.toggle('active');
    });
    
    // Enhanced image preview handling with drag and drop
    productImage.addEventListener('change', function() {
        handleFileSelection(this.files);
    });
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropZone.classList.add('drag-over');
    }
    
    function unhighlight() {
        dropZone.classList.remove('drag-over');
    }
    
    dropZone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFileSelection(files);
    }
    
    function handleFileSelection(files) {
        if (!files.length) return;
        
        const file = files[0];
        if (!file.type.startsWith('image/')) {
            imageError.textContent = errorMessages.imageType;
            imageError.style.display = 'block';
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            imageError.textContent = errorMessages.imageSize;
            imageError.style.display = 'block';
            return;
        }
        
        imageError.style.display = 'none';
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            imageControls.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
    
    // Image control buttons
    removeImageBtn.addEventListener('click', function() {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        imageControls.style.display = 'none';
        productImage.value = '';
        imageError.style.display = 'none';
    });
    
    changeImageBtn.addEventListener('click', function() {
        productImage.click();
    });

    // Show/hide discount fields based on selection
    discountType.addEventListener('change', function() {
        switch(this.value) {
            case 'none':
                percentageField.style.display = 'none';
                amountField.style.display = 'none';
                break;
            case 'percentage':
                percentageField.style.display = 'block';
                amountField.style.display = 'none';
                break;
            case 'amount':
                percentageField.style.display = 'none';
                amountField.style.display = 'block';
                break;
            case 'both':
                percentageField.style.display = 'block';
                amountField.style.display = 'block';
                break;
        }
    });

    // Input validation listeners
    productName.addEventListener('input', validateName);
    productPrice.addEventListener('input', validatePrice);
    discountPercentage.addEventListener('input', validatePercentage);
    discountAmount.addEventListener('input', validateAmount);
    
    // Preview controls event listeners
    rotateLeftBtn.addEventListener('click', rotateTemplateLeft);
    rotateRightBtn.addEventListener('click', rotateTemplateRight);
    zoomInBtn.addEventListener('click', zoomTemplateIn);
    zoomOutBtn.addEventListener('click', zoomTemplateOut);
    resetViewBtn.addEventListener('click', resetTemplateView);
    
    function rotateTemplateLeft() {
        rotation -= 90;
        updateTemplateTransform();
    }
    
    function rotateTemplateRight() {
        rotation += 90;
        updateTemplateTransform();
    }
    
    function zoomTemplateIn() {
        scale += 0.1;
        if (scale > 2) scale = 2; // Maximum zoom level
        updateTemplateTransform();
    }
    
    function zoomTemplateOut() {
        scale -= 0.1;
        if (scale < 0.5) scale = 0.5; // Minimum zoom level
        updateTemplateTransform();
    }
    
    function resetTemplateView() {
        rotation = 0;
        scale = 1;
        updateTemplateTransform();
    }
    
    function updateTemplateTransform() {
        const template = document.querySelector('.product-template');
        if (!template) return;
        
        template.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    }
    
    // Validation functions
    function validateName() {
        if (!productName.value.trim()) {
            nameError.style.display = 'block';
            return false;
        } else {
            nameError.style.display = 'none';
            return true;
        }
    }
    
    function validatePrice() {
        const price = parseFloat(productPrice.value);
        if (isNaN(price) || price <= 0) {
            priceError.style.display = 'block';
            return false;
        } else {
            priceError.style.display = 'none';
            // If discount amount is set, validate it against the new price
            if (discountType.value === 'amount' || discountType.value === 'both') {
                validateAmount();
            }
            return true;
        }
    }
    
    function validatePercentage() {
        if (discountType.value !== 'percentage' && discountType.value !== 'both') {
            return true;
        }
        
        const percentage = parseFloat(discountPercentage.value);
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            percentageError.style.display = 'block';
            return false;
        } else {
            percentageError.style.display = 'none';
            return true;
        }
    }
    
    function validateAmount() {
        if (discountType.value !== 'amount' && discountType.value !== 'both') {
            return true;
        }
        
        const price = parseFloat(productPrice.value);
        const amount = parseFloat(discountAmount.value);
        if (isNaN(amount) || amount < 0 || amount > price) {
            amountError.style.display = 'block';
            return false;
        } else {
            amountError.style.display = 'none';
            return true;
        }
    }
    
    function validateImage() {
        if (!productImage.files[0] && !imagePreview.src) {
            imageError.textContent = errorMessages.image;
            imageError.style.display = 'block';
            return false;
        } else {
            imageError.style.display = 'none';
            return true;
        }
    }
    
    // Form validation
    function validateForm() {
        const nameValid = validateName();
        const priceValid = validatePrice();
        const imageValid = validateImage();
        const percentageValid = validatePercentage();
        const amountValid = validateAmount();
        
        return nameValid && priceValid && imageValid && percentageValid && amountValid;
    }

    // Form submission
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset success message
        downloadSuccess.style.display = 'none';
        
        // Comprehensive validation
        if (!validateForm()) {
            return;
        }
        
        // Show loading spinner
        generateSpinner.style.display = 'inline-block';
        
        // Use setTimeout to allow the UI to update before heavy processing
        setTimeout(() => {
            generateTemplate();
            generateSpinner.style.display = 'none';
            
            // Reset view when generating new template
            rotation = 0;
            scale = 1;
        }, 100);
    });

    function generateTemplate() {
        // Get values
        const name = productName.value.trim();
        const price = parseFloat(productPrice.value);
        const currencySymbol = currency.value;
        const discount = discountType.value;
        const theme = templateTheme.value;
        const imageUrl = imagePreview.src;
        const customBadge = badgeText.value.trim();
        const backgroundColor = bgColor.value;
        
        // Calculate discounted price if applicable
        let discountedPrice = price;
        let discountBadge = '';
        
        if (discount === 'percentage' || discount === 'both') {
            const percentage = parseFloat(discountPercentage.value) || 0;
            if (percentage > 0) {
                discountedPrice = price - (price * percentage / 100);
                discountBadge = `-${percentage}%`;
            }
        }
        
        if (discount === 'amount' || discount === 'both') {
            const amount = parseFloat(discountAmount.value) || 0;
            if (amount > 0) {
                // If both types are selected, we need to apply the amount discount after the percentage
                if (discount === 'both') {
                    discountedPrice = discountedPrice - amount;
                } else {
                    discountedPrice = price - amount;
                }
                
                if (discountBadge) {
                    discountBadge += ` / -${amount.toFixed(2)} ${currencySymbol}`;
                } else {
                    discountBadge = `-${amount.toFixed(2)} ${currencySymbol}`;
                }
            }
        }
        
        // Ensure price doesn't go below zero
        discountedPrice = Math.max(0, discountedPrice);
        
        // Format prices with appropriate decimal places
        const formattedPrice = price.toFixed(2);
        const formattedDiscountedPrice = discountedPrice.toFixed(2);
        
        // Generate template HTML with enhanced styling for full image display
        let templateHTML = `
            <div class="product-template theme-${theme}">`;
        
        // Add custom badge if provided
        if (customBadge) {
            templateHTML += `<div class="custom-badge">${customBadge}</div>`;
        }
        
        // Add discount badge if applicable
        if (discount !== 'none' && discountBadge) {
            templateHTML += `<div class="discount-badge">${discountBadge}</div>`;
        }
        
        templateHTML += `
                <div class="product-image" style="background-color: ${backgroundColor}">
                    <img src="${imageUrl}" alt="${name}" loading="eager" onload="this.parentElement.classList.add('image-loaded')">
                </div>
                <div class="product-info">
                    <h3 class="product-name" style="color: inherit;">${name}</h3>
                    <div class="price-container">`;
        
        // Add price information
        if (discount !== 'none' && discountBadge) {
            templateHTML += `
                        <span class="price">${formattedDiscountedPrice} ${currencySymbol}</span>
                        <span class="original-price">${formattedPrice} ${currencySymbol}</span>`;
        } else {
            templateHTML += `
                        <span class="price">${formattedPrice} ${currencySymbol}</span>`;
        }
        
        templateHTML += `
                    </div>
                </div>
            </div>
        `;
        
        // Update template container
        templateContainer.innerHTML = templateHTML;
        
        // Post-processing to ensure styles are properly applied
        const productNameElement = templateContainer.querySelector('.product-name');
        if (productNameElement) {
            // Force theme-specific styles to take precedence
            setTimeout(() => {
                // This ensures CSS specificity is applied correctly after DOM update
                productNameElement.style.removeProperty('color');
            }, 0);
        }
        
        // Show download button
        downloadBtn.style.display = 'block';
    }

    // Download template as image with improved image handling
    downloadBtn.addEventListener('click', function() {
        const template = document.querySelector('.product-template');
        
        // Show loading spinner
        downloadSpinner.style.display = 'inline-block';
        
        // Hide success message while processing
        downloadSuccess.style.display = 'none';
        
        try {
            // Reset rotation and scale for the download
            const currentRotation = rotation;
            const currentScale = scale;
            rotation = 0;
            scale = 1;
            updateTemplateTransform();
            
            // Create a wrapper div with white background for the download
            const wrapper = document.createElement('div');
            wrapper.className = 'template-download-wrapper';
            wrapper.style.backgroundColor = 'white';
            wrapper.style.padding = '30px';
            wrapper.style.borderRadius = '12px';
            wrapper.style.display = 'inline-block';
            
            // Clone the template and append to the wrapper
            const templateClone = template.cloneNode(true);
            wrapper.appendChild(templateClone);
            
            // Temporarily add to DOM but hidden
            wrapper.style.position = 'absolute';
            wrapper.style.left = '-9999px';
            document.body.appendChild(wrapper);
            
            // Apply Ultra HD rendering options with improved image handling
            html2canvas(wrapper, {
                useCORS: true,
                allowTaint: true,
                scale: 5, // Ultra HD quality
                logging: false,
                backgroundColor: null,
                imageTimeout: 0, // No timeout for images
                onclone: function(clonedDoc) {
                    const clonedTemplate = clonedDoc.querySelector('.product-template');
                    if (clonedTemplate) {
                        // Ensure hover effects are not applied
                        clonedTemplate.style.transform = 'none';
                        
                        // Make sure discount badge is visible
                        const discountBadge = clonedTemplate.querySelector('.discount-badge');
                        if (discountBadge) {
                            discountBadge.style.transform = 'none';
                        }
                        
                        // Ensure image is properly sized without cropping
                        const productImage = clonedTemplate.querySelector('.product-image');
                        const img = productImage.querySelector('img');
                        if (img) {
                            img.style.transform = 'none';
                            img.style.maxHeight = 'unset'; // Remove max-height for rendering
                        }
                    }
                }
            }).then(canvas => {
                // Remove the temporary wrapper
                document.body.removeChild(wrapper);
                
                // Restore the rotation and scale
                rotation = currentRotation;
                scale = currentScale;
                updateTemplateTransform();
                
                // Further enhance the canvas quality
                const context = canvas.getContext('2d');
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = 'high';
                
                // Clean product name for filename
                const productNameForFile = productName.value.trim().replace(/\s+/g, '-').toLowerCase()
                    .replace(/[^a-z0-9-]/g, ''); // Clean up Georgian characters for filename
                
                // Generate a timestamp to ensure unique filenames
                const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
                const filename = `${productNameForFile}-${timestamp}-template.png`;
                
                // Create download link with Ultra HD quality
                const link = document.createElement('a');
                link.download = filename;
                
                // Get image data with highest quality
                const imgData = canvas.toDataURL('image/png', 1.0);
                link.href = imgData;
                
                // Use the selected download path
                if (window.showSaveFilePicker) {
                    // For browsers that support File System Access API
                    const saveToDisk = async () => {
                        try {
                            const options = {
                                suggestedName: filename,
                                types: [{
                                    description: 'PNG Images',
                                    accept: {'image/png': ['.png']}
                                }]
                            };
                            
                            // Open file picker to let user choose save location
                            const fileHandle = await window.showSaveFilePicker(options);
                            const writable = await fileHandle.createWritable();
                            
                            // Convert data URL to blob
                            const dataURLtoBlob = async (dataURL) => {
                                const res = await fetch(dataURL);
                                return await res.blob();
                            };
                            
                            const blob = await dataURLtoBlob(imgData);
                            await writable.write(blob);
                            await writable.close();
                            
                            // Show success message
                            showSuccessMessage();
                        } catch (err) {
                            console.error('Failed to save file:', err);
                            
                            // Fallback to regular download
                            link.click();
                            showSuccessMessage();
                        }
                    };
                    
                    saveToDisk();
                } else {
                    // Fallback for browsers without File System Access API
                    link.click();
                    showSuccessMessage();
                }
            }).catch(err => {
                console.error("Error generating image:", err);
                alert(errorMessages.downloadError);
                downloadSpinner.style.display = 'none';
            });
        } catch (err) {
            console.error("Error in html2canvas:", err);
            alert(errorMessages.downloadErrorImage);
            downloadSpinner.style.display = 'none';
        }
    });
    
    function showSuccessMessage() {
        // Show success message and hide spinner
        downloadSpinner.style.display = 'none';
        downloadSuccess.style.display = 'block';
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
            downloadSuccess.style.display = 'none';
        }, 3000);
    }
});