document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const galleryContainer = document.getElementById('galleryContainer');
    const galleryPreviewWrapper = document.getElementById('galleryPreviewWrapper');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const downloadProgressBar = document.getElementById('downloadProgressBar');
    const clearGalleryBtn = document.getElementById('clearGalleryBtn');
    const downloadGalleryBtn = document.getElementById('downloadGalleryBtn');
    const shareGalleryBtn = document.getElementById('shareGalleryBtn');
    const applySettingsBtn = document.getElementById('applySettingsBtn');
    const layoutBtns = document.querySelectorAll('.layout-btn');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const effectBtns = document.querySelectorAll('.effect-btn');
    const galleryStats = document.getElementById('galleryStats');
    const shareModal = document.getElementById('shareModal');
    const closeModal = document.querySelector('.close-modal');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Input controls
    const frameColorInput = document.getElementById('frameColor');
    const bgColorInput = document.getElementById('bgColor');
    const spacingInput = document.getElementById('spacing');
    const borderWidthInput = document.getElementById('borderWidth');
    const cornerRadiusInput = document.getElementById('cornerRadius');
    const shadowSizeInput = document.getElementById('shadowSize');
    const qualityInput = document.getElementById('quality');
    const brightnessInput = document.getElementById('brightness');
    const contrastInput = document.getElementById('contrast');
    const saturationInput = document.getElementById('saturation');
    const autoEnhanceInput = document.getElementById('autoEnhance');
    const sharpenImagesInput = document.getElementById('sharpenImages');
    const addWatermarkInput = document.getElementById('addWatermark');
    const watermarkTextInput = document.getElementById('watermarkText');
    const downloadFormat = document.getElementById('downloadFormat');
    
    // Value displays
    const spacingValue = document.getElementById('spacingValue');
    const borderWidthValue = document.getElementById('borderWidthValue');
    const cornerRadiusValue = document.getElementById('cornerRadiusValue');
    const shadowSizeValue = document.getElementById('shadowSizeValue');
    const qualityValue = document.getElementById('qualityValue');
    const brightnessValue = document.getElementById('brightnessValue');
    const contrastValue = document.getElementById('contrastValue');
    const saturationValue = document.getElementById('saturationValue');
    
    // Copy buttons
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const copyEmbedBtn = document.getElementById('copyEmbedBtn');
    const downloadQRBtn = document.getElementById('downloadQRBtn');
    
    // Preview controls
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetViewBtn = document.getElementById('resetViewBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    // Overlay
    const processingOverlay = document.getElementById('processingOverlay');
    
    // Gallery state
    let uploadedImages = [];
    let currentLayout = 'grid';
    let currentTheme = 'light';
    let currentEffect = 'none';
    let zoomLevel = 1;
    let totalImageBytes = 0;
    let totalPixels = 0;
    let isFullscreen = false;
    
    // Quality level text mapping
    const qualityLabels = {
        '1': 'დაბალი',
        '2': 'საშუალო',
        '3': 'კარგი',
        '4': 'მაღალი',
        '5': 'ულტრა HD'
    };
    
    // Check if progress container exists - if not, create it
    let uploadProgressContainer = progressContainer;
    if (!uploadProgressContainer) {
        console.log('Creating progress container as it was not found');
        uploadProgressContainer = document.createElement('div');
        uploadProgressContainer.id = 'progressContainer';
        uploadProgressContainer.className = 'progress-container';
        uploadProgressContainer.style.display = 'none';
        
        const progressBarElem = document.createElement('div');
        progressBarElem.id = 'progressBar';
        progressBarElem.className = 'progress-bar';
        
        uploadProgressContainer.appendChild(progressBarElem);
        uploadArea.insertAdjacentElement('afterend', uploadProgressContainer);
    }
    
    // Make sure we have the progress bar element
    const uploadProgressBar = document.getElementById('progressBar');
    
    // Initialize gallery
    initGallery();
    
    function initGallery() {
        // Setup drag and drop functionality
        setupDragAndDrop();
        
        // Setup file input change
        imageUpload.addEventListener('change', handleFileUpload);
        
        // Setup range sliders with value displays
        setupRangeInputWithValue(spacingInput, spacingValue, 'px');
        setupRangeInputWithValue(borderWidthInput, borderWidthValue, 'px');
        setupRangeInputWithValue(cornerRadiusInput, cornerRadiusValue, 'px');
        setupRangeInputWithValue(shadowSizeInput, shadowSizeValue, 'px');
        setupRangeInputWithValue(brightnessInput, brightnessValue, '%');
        setupRangeInputWithValue(contrastInput, contrastValue, '%');
        setupRangeInputWithValue(saturationInput, saturationValue, '%');
        
        // Setup quality display
        qualityInput.addEventListener('input', () => {
            qualityValue.textContent = qualityLabels[qualityInput.value];
        });
        
        // Setup layout buttons
        setupLayoutButtons();
        
        // Setup theme buttons
        setupThemeButtons();
        
        // Setup effect buttons
        setupEffectButtons();
        
        // Setup watermark toggle
        setupWatermarkToggle();
        
        // Setup apply settings button
        applySettingsBtn.addEventListener('click', updateGallerySettings);
        
        // Setup clear gallery button
        clearGalleryBtn.addEventListener('click', clearGallery);
        
        // Setup download gallery button
        downloadGalleryBtn.addEventListener('click', downloadGallery);
        
        // Setup share gallery button
        shareGalleryBtn.addEventListener('click', showShareModal);
        
        // Setup modal functionality
        setupModal();
        
        // Setup copy buttons
        setupCopyButtons();
        
        // Setup preview controls
        setupPreviewControls();
        
        // Check for saved settings
        loadSavedSettings();
    }
    
    function setupRangeInputWithValue(input, valueDisplay, unit) {
        valueDisplay.textContent = `${input.value}${unit}`;
        input.addEventListener('input', () => {
            valueDisplay.textContent = `${input.value}${unit}`;
        });
    }
    
    function setupLayoutButtons() {
        layoutBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                layoutBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update layout
                currentLayout = btn.getAttribute('data-layout');
                galleryContainer.className = `gallery-container ${currentLayout} theme-${currentTheme} effect-${currentEffect}`;
                
                // Save setting
                saveSetting('currentLayout', currentLayout);
                
                // Re-render the gallery with the new layout
                renderGallery();
            });
        });
    }
    
    function setupThemeButtons() {
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                themeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update theme
                currentTheme = btn.getAttribute('data-theme');
                galleryContainer.className = `gallery-container ${currentLayout} theme-${currentTheme} effect-${currentEffect}`;
                
                // Save setting
                saveSetting('currentTheme', currentTheme);
                
                // Update UI based on theme
                updateUIForTheme(currentTheme);
            });
        });
    }
    
    function updateUIForTheme(theme) {
        // Adjust background and border colors based on theme
        if (theme === 'dark') {
            bgColorInput.value = '#222222';
        } else if (theme === 'elegant') {
            bgColorInput.value = '#f9f9f9';
            frameColorInput.value = '#ffffff';
        } else if (theme === 'vintage') {
            bgColorInput.value = '#f4efe1';
            frameColorInput.value = '#d3c5a8';
        } else {
            // Light theme or default
            bgColorInput.value = '#f8f9fa';
        }
        
        // Apply the settings immediately
        updateGallerySettings();
    }
    
    function setupEffectButtons() {
        effectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                effectBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update effect
                currentEffect = btn.getAttribute('data-effect');
                
                // Remove any existing effect classes
                const effectClasses = ['effect-none', 'effect-sepia', 'effect-grayscale', 'effect-duotone', 'effect-blur'];
                galleryContainer.classList.remove(...effectClasses);
                
                // Add the new effect class
                galleryContainer.classList.add(`effect-${currentEffect}`);
                
                // Save setting
                saveSetting('currentEffect', currentEffect);
            });
        });
    }
    
    function setupWatermarkToggle() {
        const watermarkSettings = document.querySelector('.watermark-settings');
        
        addWatermarkInput.addEventListener('change', () => {
            watermarkSettings.style.display = addWatermarkInput.checked ? 'block' : 'none';
            
            // Only re-render if we have images
            if (uploadedImages.length > 0) {
                renderGallery();
            }
        });
    }
    
    function setupModal() {
        // Close modal when clicking X or outside
        closeModal.addEventListener('click', closeShareModal);
        window.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                closeShareModal();
            }
        });
        
        // Setup tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show the selected tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabName}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    function setupCopyButtons() {
        copyLinkBtn.addEventListener('click', () => copyText('galleryLink'));
        copyEmbedBtn.addEventListener('click', () => copyText('embedCode'));
        downloadQRBtn.addEventListener('click', downloadQRCode);
    }
    
    function copyText(elementId) {
        const element = document.getElementById(elementId);
        element.select();
        document.execCommand('copy');
        
        // Give visual feedback
        const button = elementId === 'galleryLink' ? copyLinkBtn : copyEmbedBtn;
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 1500);
    }
    
    function downloadQRCode() {
        const qrCodeImg = document.getElementById('qrCode');
        const link = document.createElement('a');
        
        link.href = qrCodeImg.src;
        link.download = 'gallery-qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    function setupPreviewControls() {
        zoomInBtn.addEventListener('click', () => {
            zoomLevel += 0.1;
            if (zoomLevel > 2) zoomLevel = 2; // Maximum zoom
            applyZoom();
        });
        
        zoomOutBtn.addEventListener('click', () => {
            zoomLevel -= 0.1;
            if (zoomLevel < 0.5) zoomLevel = 0.5; // Minimum zoom
            applyZoom();
        });
        
        resetViewBtn.addEventListener('click', () => {
            zoomLevel = 1;
            applyZoom();
        });
        
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    function applyZoom() {
        galleryContainer.style.transform = `scale(${zoomLevel})`;
        galleryContainer.style.transformOrigin = 'center top';
    }
    
    function toggleFullscreen() {
        if (!isFullscreen) {
            // Create fullscreen container
            const fullscreenDiv = document.createElement('div');
            fullscreenDiv.className = 'gallery-fullscreen';
            fullscreenDiv.id = 'galleryFullscreen';
            
            // Create exit button
            const exitBtn = document.createElement('button');
            exitBtn.className = 'exit-fullscreen';
            exitBtn.innerHTML = '<i class="fas fa-times"></i>';
            exitBtn.addEventListener('click', toggleFullscreen);
            
            // Clone the gallery container
            const galleryClone = galleryContainer.cloneNode(true);
            galleryClone.style.transform = 'none'; // Reset any zoom
            
            fullscreenDiv.appendChild(exitBtn);
            fullscreenDiv.appendChild(galleryClone);
            document.body.appendChild(fullscreenDiv);
            document.body.style.overflow = 'hidden';
            isFullscreen = true;
        } else {
            // Remove fullscreen container
            const fullscreenDiv = document.getElementById('galleryFullscreen');
            if (fullscreenDiv) {
                document.body.removeChild(fullscreenDiv);
            }
            document.body.style.overflow = '';
            isFullscreen = false;
        }
    }
    
    function loadSavedSettings() {
        // Load layout if saved
        const savedLayout = localStorage.getItem('currentLayout');
        if (savedLayout) {
            currentLayout = savedLayout;
            galleryContainer.className = `gallery-container ${currentLayout}`;
            
            // Update UI
            layoutBtns.forEach(btn => {
                if (btn.getAttribute('data-layout') === currentLayout) {
                    layoutBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
        }
        
        // Load theme if saved
        const savedTheme = localStorage.getItem('currentTheme');
        if (savedTheme) {
            currentTheme = savedTheme;
            galleryContainer.classList.add(`theme-${currentTheme}`);
            
            // Update UI
            themeBtns.forEach(btn => {
                if (btn.getAttribute('data-theme') === currentTheme) {
                    themeBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
            
            updateUIForTheme(currentTheme);
        }
        
        // Load effect if saved
        const savedEffect = localStorage.getItem('currentEffect');
        if (savedEffect) {
            currentEffect = savedEffect;
            galleryContainer.classList.add(`effect-${currentEffect}`);
            
            // Update UI
            effectBtns.forEach(btn => {
                if (btn.getAttribute('data-effect') === currentEffect) {
                    effectBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
        }
    }
    
    function saveSetting(key, value) {
        localStorage.setItem(key, value);
    }
    
    function setupDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        uploadArea.addEventListener('drop', handleDrop, false);
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        uploadArea.classList.add('drag-over');
    }
    
    function unhighlight() {
        uploadArea.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function handleFileUpload(e) {
        handleFiles(e.target.files);
    }
    
    function handleFiles(files) {
        if (!files.length) return;
        
        const fileArray = Array.from(files);
        const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
        
        // Limit to 15 images
        const maxFiles = 15;
        const filesToProcess = imageFiles.slice(0, maxFiles);
        
        if (!filesToProcess.length) {
            showNotification('გთხოვთ აირჩიოთ მხოლოდ სურათები', 'error');
            return;
        }
        
        if (imageFiles.length > maxFiles) {
            showNotification(`დამუშავდება პირველი ${maxFiles} სურათი (ლიმიტი)`, 'warning');
        }
        
        // Show progress container
        uploadProgressContainer.style.display = 'block';
        uploadProgressBar.style.width = '0%';
        
        // Reset totals
        totalImageBytes = 0;
        totalPixels = 0;
        
        // Process files
        let loadedFiles = 0;
        
        filesToProcess.forEach(file => {
            totalImageBytes += file.size;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;
                
                img.onload = function() {
                    totalPixels += (img.width * img.height);
                    
                    // Add image to array
                    uploadedImages.push({
                        src: event.target.result,
                        width: img.width,
                        height: img.height,
                        aspectRatio: img.width / img.height,
                        rotation: getRandomRotation(),
                        originalSize: file.size,
                        fileName: file.name,
                        dateAdded: new Date(),
                        brightness: 100,
                        contrast: 100,
                        saturation: 100
                    });
                    
                    // Update progress
                    loadedFiles++;
                    const progress = (loadedFiles / filesToProcess.length) * 100;
                    uploadProgressBar.style.width = `${progress}%`;
                    
                    if (loadedFiles === filesToProcess.length) {
                        setTimeout(() => {
                            // Auto-enhance images if option is checked
                            if (autoEnhanceInput.checked) {
                                enhanceImages();
                            }
                            
                            renderGallery();
                            updateGalleryStats();
                            
                            // Show UI controls
                            uploadProgressContainer.style.display = 'none';
                            clearGalleryBtn.style.display = 'block';
                            document.querySelector('.gallery-actions').style.display = 'flex';
                            galleryStats.style.display = 'flex';
                            
                            showNotification('სურათები წარმატებით აიტვირთა', 'success');
                        }, 300);
                    }
                };
                
                // Handle image load error
                img.onerror = function() {
                    loadedFiles++;
                    showNotification('სურათის დამუშავების შეცდომა', 'error');
                    
                    if (loadedFiles === filesToProcess.length) {
                        uploadProgressContainer.style.display = 'none';
                    }
                };
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    function getRandomRotation() {
        return Math.random() * 10 - 5; // -5 to +5 degrees
    }
    
    function enhanceImages() {
        uploadedImages.forEach(image => {
            // Enhanced auto-enhancement algorithm
            const qualityLevel = parseInt(qualityInput.value);
            
            // Higher quality level = better enhancement
            if (qualityLevel >= 4) { // High and Ultra
                image.brightness = Math.min(110, Math.max(95, 100 + Math.random() * 10));
                image.contrast = Math.min(115, Math.max(100, 100 + Math.random() * 15));
                image.saturation = Math.min(120, Math.max(100, 100 + Math.random() * 20));
            } else if (qualityLevel >= 2) { // Medium and Good
                image.brightness = Math.min(108, Math.max(92, 100 + Math.random() * 8));
                image.contrast = Math.min(110, Math.max(98, 100 + Math.random() * 10));
                image.saturation = Math.min(115, Math.max(95, 100 + Math.random() * 15));
            } else { // Low
                image.brightness = 100;
                image.contrast = 100;
                image.saturation = 105;
            }
        });
    }
    
    function updateGalleryStats() {
        if (!uploadedImages.length) {
            galleryStats.style.display = 'none';
            return;
        }
        
        // Update image count
        document.getElementById('imageCount').textContent = uploadedImages.length;
        
        // Update total megapixels
        const megapixels = (totalPixels / 1000000).toFixed(1);
        document.getElementById('totalPixels').textContent = `${megapixels} MP`;
        
        // Update total size
        const sizeMB = (totalImageBytes / (1024 * 1024)).toFixed(1);
        document.getElementById('totalSize').textContent = `${sizeMB} MB`;
        
        // Show stats
        galleryStats.style.display = 'flex';
    }
    
    function renderGallery() {
        // Clear gallery
        galleryContainer.innerHTML = '';
        
        // Show empty state if no images
        if (uploadedImages.length === 0) {
            galleryContainer.innerHTML = `
                <div class="empty-gallery">
                    <i class="fas fa-images"></i>
                    <p>ატვირთეთ სურათები გალერეის შესაქმნელად</p>
                    <span class="demo-tip">არჩეული სტილი: <strong>${getCurrentLayoutName()}</strong></span>
                    <div class="demo-gallery-placeholder">
                        ${Array(9).fill('<div class="placeholder-item"></div>').join('')}
                    </div>
                </div>
            `;
            return;
        }
        
        // Apply gallery settings
        applyGallerySettings();
        
        // Add layout items based on current layout
        switch(currentLayout) {
            case 'metro':
                createMetroLayout();
                break;
                
            case 'slider':
                createSliderLayout();
                break;
                
            case 'cinema':
                createCinemaLayout();
                break;
                
            case 'collage':
                createCollageLayout();
                break;
                
            default:
                // Default handling for grid, masonry, polaroid, classic
                createDefaultLayout();
                break;
        }
    }
    
    function createMetroLayout() {
        uploadedImages.forEach((image, index) => {
            const galleryItem = createGalleryItem(image, index);
            galleryContainer.appendChild(galleryItem);
        });
    }
    
    function createSliderLayout() {
        uploadedImages.forEach((image, index) => {
            const galleryItem = createGalleryItem(image, index);
            
            // Add more slide-specific styling
            galleryItem.style.flex = '0 0 auto';
            galleryItem.style.width = '300px';
            
            galleryContainer.appendChild(galleryItem);
        });
        
        // Add scroll arrows for slider
        const leftArrow = document.createElement('button');
        leftArrow.className = 'slider-arrow left-arrow';
        leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
        leftArrow.addEventListener('click', () => {
            galleryContainer.scrollBy({
                left: -350,
                behavior: 'smooth'
            });
        });
        
        const rightArrow = document.createElement('button');
        rightArrow.className = 'slider-arrow right-arrow';
        rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
        rightArrow.addEventListener('click', () => {
            galleryContainer.scrollBy({
                left: 350,
                behavior: 'smooth'
            });
        });
        
        galleryPreviewWrapper.appendChild(leftArrow);
        galleryPreviewWrapper.appendChild(rightArrow);
    }
    
    function createCinemaLayout() {
        // Create header
        const cinemaHeader = document.createElement('div');
        cinemaHeader.className = 'cinema-header';
        cinemaHeader.innerHTML = `<h3>სურათების გალერეა</h3>`;
        galleryContainer.appendChild(cinemaHeader);
        
        // Create images
        uploadedImages.forEach((image, index) => {
            const galleryItem = createGalleryItem(image, index);
            galleryContainer.appendChild(galleryItem);
            
            // Add film reel holes effect
            const leftHoles = document.createElement('div');
            leftHoles.className = 'film-holes left';
            galleryItem.appendChild(leftHoles);
            
            const rightHoles = document.createElement('div');
            rightHoles.className = 'film-holes right';
            galleryItem.appendChild(rightHoles);
        });
    }
    
    function createCollageLayout() {
        uploadedImages.forEach((image, index) => {
            const galleryItem = createGalleryItem(image, index);
            galleryContainer.appendChild(galleryItem);
        });
    }
    
    function createDefaultLayout() {
        uploadedImages.forEach((image, index) => {
            const galleryItem = createGalleryItem(image, index);
            galleryContainer.appendChild(galleryItem);
        });
    }
    
    function createGalleryItem(image, index) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-index', index + 1);
        
        // Set random rotation for polaroid style
        if (currentLayout === 'polaroid') {
            galleryItem.style.setProperty('--random-rotate', `${image.rotation}deg`);
        }
        
        // Create image container to apply filters
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        imageContainer.style.filter = `brightness(${image.brightness}%) contrast(${image.contrast}%) saturate(${image.saturation}%)`;
        
        // Create image element
        const galleryImage = document.createElement('img');
        galleryImage.className = 'gallery-image';
        galleryImage.src = image.src;
        galleryImage.alt = `Image ${index + 1}`;
        galleryImage.loading = 'lazy';
        
        // Apply sharpening if enabled
        if (sharpenImagesInput.checked) {
            imageContainer.style.filter += ' contrast(1.05) brightness(1.02)';
            galleryImage.style.imageRendering = 'crisp-edges';
        }
        
        imageContainer.appendChild(galleryImage);
        galleryItem.appendChild(imageContainer);
        
        // Add watermark if enabled
        if (addWatermarkInput.checked && watermarkTextInput.value) {
            const watermark = document.createElement('div');
            watermark.className = 'watermark';
            watermark.textContent = watermarkTextInput.value;
            galleryItem.appendChild(watermark);
        }
        
        // Add image controls
        const controls = createImageControls(index);
        galleryItem.appendChild(controls);
        
        return galleryItem;
    }
    
    function createImageControls(index) {
        const controls = document.createElement('div');
        controls.className = 'gallery-item-controls';
        
        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'gallery-item-btn';
        removeBtn.title = 'წაშლა';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
        removeBtn.addEventListener('click', () => removeImage(index));
        controls.appendChild(removeBtn);
        
        // Rotate button
        const rotateBtn = document.createElement('button');
        rotateBtn.className = 'gallery-item-btn';
        rotateBtn.title = 'შემობრუნება';
        rotateBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        rotateBtn.addEventListener('click', () => rotateImage(index));
        controls.appendChild(rotateBtn);
        
        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'gallery-item-btn';
        editBtn.title = 'რედაქტირება';
        editBtn.innerHTML = '<i class="fas fa-sliders-h"></i>';
        editBtn.addEventListener('click', () => editImage(index));
        controls.appendChild(editBtn);
        
        // Expand/view button
        const expandBtn = document.createElement('button');
        expandBtn.className = 'gallery-item-btn';
        expandBtn.title = 'გადიდება';
        expandBtn.innerHTML = '<i class="fas fa-expand-alt"></i>';
        expandBtn.addEventListener('click', () => expandImage(index));
        controls.appendChild(expandBtn);
        
        return controls;
    }
    
    function getCurrentLayoutName() {
        const layoutNames = {
            'grid': 'ბადისებრი',
            'masonry': 'მოზაიკური',
            'polaroid': 'პოლაროიდი',
            'classic': 'კლასიკური',
            'metro': 'მეტრო',
            'slider': 'სლაიდერი',
            'cinema': 'სინემა',
            'collage': 'კოლაჟი'
        };
        return layoutNames[currentLayout] || currentLayout;
    }
    
    function applyGallerySettings() {
        // Apply settings to gallery container
        galleryContainer.style.backgroundColor = bgColorInput.value;
        
        // Set spacing and other style variables
        const spacing = spacingInput.value + 'px';
        const borderWidth = borderWidthInput.value + 'px';
        const cornerRadius = cornerRadiusInput.value + 'px';
        const shadowSize = shadowSizeInput.value + 'px';
        
        // Apply common styles to all items
        document.documentElement.style.setProperty('--gallery-spacing', spacing);
        document.documentElement.style.setProperty('--gallery-border-width', borderWidth);
        document.documentElement.style.setProperty('--gallery-corner-radius', cornerRadius);
        document.documentElement.style.setProperty('--gallery-shadow-size', shadowSize);
        document.documentElement.style.setProperty('--gallery-border-color', frameColorInput.value);
        
        // Apply layout-specific styles
        switch(currentLayout) {
            case 'grid':
                galleryContainer.style.gap = spacing;
                break;
                
            case 'masonry':
                galleryContainer.style.columnGap = spacing;
                break;
                
            case 'metro':
            case 'collage':
                galleryContainer.style.gap = spacing;
                break;
                
            case 'slider':
                galleryContainer.style.gap = '0';
                galleryContainer.style.padding = spacing;
                break;
                
            case 'cinema':
                galleryContainer.style.backgroundColor = '#111';
                break;
        }
    }
    
    function updateGallerySettings() {
        // Show processing overlay
        if (uploadedImages.length > 0) {
            processingOverlay.style.display = 'flex';
            
            setTimeout(() => {
                applyGallerySettings();
                renderGallery(); // Re-render to apply all settings
                processingOverlay.style.display = 'none';
            }, 300);
        } else {
            applyGallerySettings();
        }
    }
    
    function removeImage(index) {
        if (confirm('ნამდვილად გსურთ წაშლა?')) {
            // Keep track of the image size for stats
            const removedImage = uploadedImages.splice(index, 1)[0];
            totalImageBytes -= removedImage.originalSize;
            totalPixels -= (removedImage.width * removedImage.height);
            
            updateGalleryStats();
            renderGallery();
            
            // Hide UI elements if no images left
            if (uploadedImages.length === 0) {
                clearGalleryBtn.style.display = 'none';
                document.querySelector('.gallery-actions').style.display = 'none';
                galleryStats.style.display = 'none';
            }
        }
    }
    
    function rotateImage(index) {
        processingOverlay.style.display = 'flex';
        
        setTimeout(() => {
            const image = uploadedImages[index];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const img = new Image();
            img.onload = function() {
                // Swap dimensions for 90° rotation
                canvas.width = img.height;
                canvas.height = img.width;
                
                // Rotate the canvas
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(Math.PI/2); // 90 degrees
                ctx.drawImage(img, -img.width/2, -img.height/2);
                
                // Update image
                image.src = canvas.toDataURL("image/png");
                image.width = canvas.width;
                image.height = canvas.height;
                image.aspectRatio = image.width / image.height;
                
                renderGallery();
                processingOverlay.style.display = 'none';
            };
            img.src = image.src;
        }, 200);
    }
    
    function editImage(index) {
        // Create an image editor dialog
        const image = uploadedImages[index];
        
        const editorOverlay = document.createElement('div');
        editorOverlay.className = 'editor-overlay';
        
        const editorContent = document.createElement('div');
        editorContent.className = 'editor-content';
        
        editorContent.innerHTML = `
            <div class="editor-header">
                <h3>რედაქტირება</h3>
                <button class="close-editor"><i class="fas fa-times"></i></button>
            </div>
            <div class="editor-body">
                <div class="editor-preview">
                    <img src="${image.src}" id="editPreview" alt="Edit Preview">
                </div>
                <div class="editor-controls">
                    <div class="edit-control">
                        <label>სიკაშკაშე</label>
                        <div class="range-with-value">
                            <input type="range" id="editBrightness" min="50" max="150" value="${image.brightness}">
                            <span class="range-value">${image.brightness}%</span>
                        </div>
                    </div>
                    <div class="edit-control">
                        <label>კონტრასტი</label>
                        <div class="range-with-value">
                            <input type="range" id="editContrast" min="50" max="150" value="${image.contrast}">
                            <span class="range-value">${image.contrast}%</span>
                        </div>
                    </div>
                    <div class="edit-control">
                        <label>სატურაცია</label>
                        <div class="range-with-value">
                            <input type="range" id="editSaturation" min="0" max="200" value="${image.saturation}">
                            <span class="range-value">${image.saturation}%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="editor-footer">
                <button class="secondary-btn" id="resetEditBtn">საწყისი</button>
                <button class="primary-btn" id="saveEditBtn">შენახვა</button>
            </div>
        `;
        
        editorOverlay.appendChild(editorContent);
        document.body.appendChild(editorOverlay);
        
        // Setup editor controls
        const editPreview = document.getElementById('editPreview');
        const editBrightness = document.getElementById('editBrightness');
        const editContrast = document.getElementById('editContrast');
        const editSaturation = document.getElementById('editSaturation');
        const resetEditBtn = document.getElementById('resetEditBtn');
        const saveEditBtn = document.getElementById('saveEditBtn');
        const closeEditBtn = document.querySelector('.close-editor');
        
        function updatePreview() {
            const brightness = editBrightness.value;
            const contrast = editContrast.value;
            const saturation = editSaturation.value;
            
            editBrightness.nextElementSibling.textContent = `${brightness}%`;
            editContrast.nextElementSibling.textContent = `${contrast}%`;
            editSaturation.nextElementSibling.textContent = `${saturation}%`;
            
            editPreview.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        }
        
        editBrightness.addEventListener('input', updatePreview);
        editContrast.addEventListener('input', updatePreview);
        editSaturation.addEventListener('input', updatePreview);
        
        resetEditBtn.addEventListener('click', () => {
            editBrightness.value = 100;
            editContrast.value = 100;
            editSaturation.value = 100;
            updatePreview();
        });
        
        saveEditBtn.addEventListener('click', () => {
            // Save changes to the image
            image.brightness = parseInt(editBrightness.value);
            image.contrast = parseInt(editContrast.value);
            image.saturation = parseInt(editSaturation.value);
            
            // Close editor and render gallery
            document.body.removeChild(editorOverlay);
            renderGallery();
        });
        
        closeEditBtn.addEventListener('click', () => {
            document.body.removeChild(editorOverlay);
        });
    }
    
    function expandImage(index) {
        const image = uploadedImages[index];
        
        const lightboxOverlay = document.createElement('div');
        lightboxOverlay.className = 'lightbox-overlay';
        
        lightboxOverlay.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close"><i class="fas fa-times"></i></button>
                <img src="${image.src}" alt="Enlarged Image">
                <div class="lightbox-caption">${index + 1} / ${uploadedImages.length}</div>
                <button class="lightbox-nav prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-nav next"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
        
        document.body.appendChild(lightboxOverlay);
        
        // Setup lightbox controls
        let currentIndex = index;
        
        const closeBtn = lightboxOverlay.querySelector('.lightbox-close');
        const prevBtn = lightboxOverlay.querySelector('.lightbox-nav.prev');
        const nextBtn = lightboxOverlay.querySelector('.lightbox-nav.next');
        const lightboxImg = lightboxOverlay.querySelector('img');
        const caption = lightboxOverlay.querySelector('.lightbox-caption');
        
        function updateLightboxImage() {
            const image = uploadedImages[currentIndex];
            lightboxImg.src = image.src;
            caption.textContent = `${currentIndex + 1} / ${uploadedImages.length}`;
        }
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(lightboxOverlay);
        });
        
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                document.body.removeChild(lightboxOverlay);
            }
        });
        
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + uploadedImages.length) % uploadedImages.length;
            updateLightboxImage();
        });
        
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % uploadedImages.length;
            updateLightboxImage();
        });
        
        // Enable keyboard navigation
        function handleKeydown(e) {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            } else if (e.key === 'Escape') {
                closeBtn.click();
            }
        }
        
        document.addEventListener('keydown', handleKeydown);
        lightboxOverlay.addEventListener('remove', () => {
            document.removeEventListener('keydown', handleKeydown);
        });
    }
    
    function clearGallery() {
        if (confirm('დარწმუნებული ხართ, რომ გსურთ ყველა სურათის წაშლა?')) {
            uploadedImages = [];
            totalImageBytes = 0;
            totalPixels = 0;
            
            renderGallery();
            clearGalleryBtn.style.display = 'none';
            document.querySelector('.gallery-actions').style.display = 'none';
            galleryStats.style.display = 'none';
        }
    }
    
    function downloadGallery() {
        console.log('Download gallery requested');
        
        // Check if there are images
        if (uploadedImages.length === 0) {
            alert('გთხოვთ, ჯერ ატვირთოთ რამდენიმე სურათი');
            return;
        }
        
        // Show processing overlay with proper feedback
        const processingOverlay = document.getElementById('processingOverlay');
        const downloadProgressBar = document.getElementById('downloadProgressBar');
        if (processingOverlay) {
            processingOverlay.style.display = 'flex';
            if (downloadProgressBar) {
                downloadProgressBar.style.width = '10%';
            }
        }
        
        // Get quality and format settings
        const qualityInput = document.getElementById('quality');
        const quality = qualityInput ? parseInt(qualityInput.value) : 3;
        
        // Exponentially scale quality for ultra HD
        // Instead of linear scaling from 1.5-3.5, use 2-5 with exponential growth
        const scaleFactors = [2, 3, 3.5, 4, 5]; // Much higher quality at top end
        const scale = scaleFactors[quality - 1] || 4;
        
        // Get download format
        const downloadFormat = document.getElementById('downloadFormat');
        const format = downloadFormat ? downloadFormat.value : 'png';
        
        console.log(`Generating ${format} image with quality scale ${scale}x`);
        
        // Apply pre-rendering adjustments:
        // 1. Keep track of current layout/styling to restore later
        const currentLayout = document.querySelector('.gallery-container').className;
        const originalViewportMeta = document.querySelector('meta[name="viewport"]');
        let originalViewportContent = originalViewportMeta ? originalViewportMeta.getAttribute('content') : '';
        
        // 2. Temporarily disable viewport scaling to prevent mobile rendering issues
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
        }
        
        // 3. Prepare the gallery - optimize for download
        updateProgressBar(20);
        
        // Clone the gallery container for rendering
        const originalContainer = document.getElementById('galleryContainer');
        const renderContainer = originalContainer.cloneNode(true);
        renderContainer.style.width = `${originalContainer.offsetWidth * 1.5}px`; // Make larger for higher resolution
        renderContainer.style.height = 'auto';
        renderContainer.style.position = 'absolute';
        renderContainer.style.left = '-9999px';
        renderContainer.style.top = '0';
        renderContainer.style.transform = 'none'; // Reset any transforms
        renderContainer.style.backgroundColor = bgColorInput ? bgColorInput.value : '#f8f9fa';
        renderContainer.style.padding = '20px';
        renderContainer.id = 'renderContainer';
        
        // Add extra styles for better quality
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #renderContainer {
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
                transform: none !important;
            }
            #renderContainer .gallery-item {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
                opacity: 1 !important;
                visibility: visible !important;
                animation: none !important;
            }
            #renderContainer .gallery-item img {
                image-rendering: high-quality !important;
                object-fit: contain !important;
                max-width: 100% !important;
                max-height: none !important;
            }
            #renderContainer .gallery-item-controls {
                display: none !important;
            }
            #renderContainer.masonry {
                column-count: 3 !important;
                column-gap: 20px !important;
                width: 1200px !important;
            }
            #renderContainer.grid {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
                gap: 20px !important;
                width: 1200px !important;
            }
        `;
        document.head.appendChild(styleElement);
        document.body.appendChild(renderContainer);
        
        // Update progress
        updateProgressBar(30);
        
        // Pre-load images to ensure they're fully rendered
        const allImages = renderContainer.querySelectorAll('img');
        let loadedImages = 0;
        const totalImages = allImages.length;
        
        // If no images to load, move on immediately
        if (totalImages === 0) {
            proceedWithRendering();
        } else {
            // Ensure all images are properly loaded before rendering
            allImages.forEach(img => {
                // Already loaded images
                if (img.complete) {
                    imageLoaded();
                    return;
                }
                
                // Handle load and error events
                img.onload = imageLoaded;
                img.onerror = imageLoaded;
                
                // Force reload to ensure proper loading
                const currentSrc = img.src;
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                setTimeout(() => {
                    img.src = currentSrc;
                }, 10);
            });
        }
        
        function imageLoaded() {
            loadedImages++;
            updateProgressBar(30 + Math.floor((loadedImages / totalImages) * 20));
            
            if (loadedImages === totalImages) {
                proceedWithRendering();
            }
        }
        
        function proceedWithRendering() {
            // Use setTimeout to allow the DOM to update
            setTimeout(() => {
                updateProgressBar(50);
                
                // Ultra HD rendering options
                const renderOptions = {
                    allowTaint: true,
                    useCORS: true,
                    scale: scale,
                    width: renderContainer.offsetWidth,
                    height: renderContainer.offsetHeight,
                    scrollX: 0,
                    scrollY: 0,
                    backgroundColor: null,
                    imageTimeout: 0,
                    logging: false,
                    removeContainer: false,
                    ignoreElements: (element) => {
                        return element.classList && 
                               (element.classList.contains('gallery-item-controls') || 
                                element.classList.contains('gallery-item-btn'));
                    },
                    onclone: function(clonedDoc) {
                        const clonedItems = clonedDoc.querySelectorAll('.gallery-item');
                        clonedItems.forEach(item => {
                            // Ensure all items are visible and styled properly
                            item.style.visibility = 'visible';
                            item.style.opacity = '1';
                            item.style.transform = 'none';
                            
                            // Enhance images
                            const img = item.querySelector('img');
                            if (img) {
                                img.style.imageRendering = 'high-quality';
                                img.style.maxHeight = 'none';
                            }
                            
                            // Hide controls
                            const controls = item.querySelector('.gallery-item-controls');
                            if (controls) {
                                controls.style.display = 'none';
                            }
                        });
                    }
                };
                
                updateProgressBar(60);
                
                html2canvas(renderContainer, renderOptions).then(canvas => {
                    updateProgressBar(80);
                    
                    // Clean up the render container and style
                    document.body.removeChild(renderContainer);
                    document.head.removeChild(styleElement);
                    
                    // Restore viewport settings
                    if (originalViewportContent && metaViewport) {
                        metaViewport.setAttribute('content', originalViewportContent);
                    }
                    
                    // Further enhance quality with canvas operations
                    const ctx = canvas.getContext('2d');
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    
                    // Generate filename with current date/time
                    const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
                    let fileName = `gallery-${timestamp}`;
                    
                    updateProgressBar(90);
                    
                    // Create appropriate output based on format
                    if (format === 'pdf') {
                        try {
                            // Generate high-quality PDF
                            const { jsPDF } = window.jspdf;
                            const pdf = new jsPDF({
                                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                                unit: 'mm',
                                format: 'a4',
                                compress: true,
                                precision: 16
                            });
                            
                            // Calculate dimensions to fit on PDF
                            const imgData = canvas.toDataURL('image/jpeg', 1.0);
                            const pdfWidth = pdf.internal.pageSize.getWidth();
                            const pdfHeight = pdf.internal.pageSize.getHeight();
                            const imgWidth = canvas.width;
                            const imgHeight = canvas.height;
                            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                            const imgX = (pdfWidth - imgWidth * ratio) / 2;
                            const imgY = 0;
                            
                            pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio, undefined, 'FAST');
                            pdf.save(`${fileName}.pdf`);
                        } catch (err) {
                            console.error('PDF generation failed:', err);
                            // Fallback to PNG if PDF generation fails
                            downloadImage('png');
                        }
                    } else {
                        downloadImage(format);
                    }
                    
                    function downloadImage(fmt) {
                        // Use appropriate image format and quality
                        let imgData;
                        switch (fmt) {
                            case 'jpg':
                                imgData = canvas.toDataURL('image/jpeg', 0.92);
                                fileName += '.jpg';
                                break;
                            case 'webp':
                                imgData = canvas.toDataURL('image/webp', 0.92);
                                fileName += '.webp';
                                break;
                            default:
                                imgData = canvas.toDataURL('image/png');
                                fileName += '.png';
                        }
                        
                        // Create download link
                        const link = document.createElement('a');
                        link.href = imgData;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                    
                    // Complete
                    updateProgressBar(100);
                    setTimeout(() => {
                        if (processingOverlay) {
                            processingOverlay.style.display = 'none';
                        }
                        showNotification('გალერეა წარმატებით გადმოიწერა', 'success');
                    }, 500);
                    
                }).catch(err => {
                    console.error('Error rendering gallery:', err);
                    
                    // Clean up render elements
                    if (document.body.contains(renderContainer)) {
                        document.body.removeChild(renderContainer);
                    }
                    if (document.head.contains(styleElement)) {
                        document.head.removeChild(styleElement);
                    }
                    
                    // Restore viewport
                    if (originalViewportContent && metaViewport) {
                        metaViewport.setAttribute('content', originalViewportContent);
                    }
                    
                    // Hide overlay and show error
                    if (processingOverlay) {
                        processingOverlay.style.display = 'none';
                    }
                    showNotification('გენერაციის პრობლემა. გთხოვთ სცადოთ თავიდან.', 'error');
                });
            }, 300);
        }
        
        function updateProgressBar(percent) {
            if (downloadProgressBar) {
                downloadProgressBar.style.width = `${percent}%`;
            }
        }
    }
    
    function showNotification(message, type = 'info') {
        // Check if a notification container exists, create if not
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Add animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Setup close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        });
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notificationContainer.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
});
