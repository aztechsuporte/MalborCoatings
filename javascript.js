document.addEventListener('DOMContentLoaded', function() {
    let editMode = false;
    let proposalData = {};
    
    // DOM Elements
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const contactForm = document.querySelector('.contact-form');
    
    // Create control buttons
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';
    
    const editModeToggle = document.createElement('button');
    editModeToggle.className = 'control-button edit-mode';
    editModeToggle.innerHTML = '✏️ Edit Mode';
    
    const exportPdfButton = document.createElement('button');
    exportPdfButton.className = 'control-button';
    exportPdfButton.innerHTML = '📄 Export PDF';
    
    const copyButton = document.createElement('button');
    copyButton.className = 'control-button copy-button';
    copyButton.innerHTML = '📋 Copy Report';
    
    // Create save indicator
    const saveIndicator = document.createElement('div');
    saveIndicator.className = 'save-indicator';
    saveIndicator.textContent = '✓ Auto-saved';
    
    // Add to page
    controlsContainer.appendChild(copyButton);
    controlsContainer.appendChild(exportPdfButton);
    controlsContainer.appendChild(editModeToggle);
    document.body.appendChild(controlsContainer);
    document.body.appendChild(saveIndicator);

    // Load saved data
    function loadSavedData() {
        try {
            const saved = localStorage.getItem('proposalData');
            if (saved) {
                proposalData = JSON.parse(saved);
                applyDataToDOM();
            }
        } catch (error) {
            console.warn('Could not load saved data:', error);
        }
    }

    // Save data
    function saveData() {
        try {
            localStorage.setItem('proposalData', JSON.stringify(proposalData));
            showSaveIndicator();
        } catch (error) {
            console.warn