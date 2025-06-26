// Proposal Generator Application
class ProposalGenerator {
    constructor() {
        this.defaultData = {
            serviceProvider: 'Mackstor Designs',
            clientName: 'Malbor Coatings',
            services: ['facebook', 'google'],
            facebookMgmtFee: 350,
            googleMgmtFee: 350,
            facebookAdSpendMin: 300,
            facebookAdSpendMax: 500,
            googleAdSpendMin: 500,
            googleAdSpendMax: 800,
            monthlyImpressions: 100000,
            qualifiedLeads: 100,
            targetCTR: 2.5,
            maxCostPerLead: 15,
            targetROAS: 4.0,
            projectTimeline: '3-6'
        };
        
        this.currentData = { ...this.defaultData };
        this.currentStage = 'setup';
        
        // Ensure DOM is ready before initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing Proposal Generator...');
        
        this.initStageManagement();
        this.initFormHandling();
        this.initDashboardNavigation();
        this.initDashboardControls();
        this.loadSavedData();
        
        // Ensure setup stage is visible initially
        this.showStage('setup');
        
        console.log('Proposal Generator initialized successfully!');
    }

    // Stage Management
    initStageManagement() {
        this.setupStage = document.getElementById('setup-stage');
        this.dashboardStage = document.getElementById('dashboard-stage');
        
        console.log('Setup stage found:', !!this.setupStage);
        console.log('Dashboard stage found:', !!this.dashboardStage);
    }

    showStage(stageName) {
        console.log('Showing stage:', stageName);
        
        // Hide all stages
        const stages = document.querySelectorAll('.stage');
        stages.forEach(stage => {
            stage.classList.remove('active');
        });

        // Show target stage
        if (stageName === 'setup' && this.setupStage) {
            this.setupStage.classList.add('active');
            this.currentStage = 'setup';
            console.log('Setup stage activated');
        } else if (stageName === 'dashboard' && this.dashboardStage) {
            this.dashboardStage.classList.add('active');
            this.currentStage = 'dashboard';
            this.populateDashboard();
            console.log('Dashboard stage activated');
        }
    }

    // Form Handling
    initFormHandling() {
        const form = document.getElementById('proposal-form');
        console.log('Form found:', !!form);
        
        if (form) {
            // Remove any existing listeners
            form.removeEventListener('submit', this.handleFormSubmit);
            
            // Add form submit listener
            form.addEventListener('submit', (e) => {
                console.log('Form submitted');
                this.handleFormSubmit(e);
            });

            // Add real-time validation and updates
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.updateFormData());
                input.addEventListener('change', () => this.updateFormData());
            });

            // Handle service checkboxes
            this.initServiceSelection();
            
            console.log('Form handling initialized');
        } else {
            console.error('Form not found!');
        }
    }

    initServiceSelection() {
        const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
        const combinedCheckbox = document.getElementById('combined-service');
        
        console.log('Service checkboxes found:', serviceCheckboxes.length);
        
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                console.log('Checkbox changed:', checkbox.id, checkbox.checked);
                
                if (checkbox.id === 'combined-service' && checkbox.checked) {
                    // If combined is checked, check both Facebook and Google
                    const fbCheckbox = document.getElementById('facebook-service');
                    const googleCheckbox = document.getElementById('google-service');
                    if (fbCheckbox) fbCheckbox.checked = true;
                    if (googleCheckbox) googleCheckbox.checked = true;
                } else if (checkbox.id !== 'combined-service' && !checkbox.checked) {
                    // If either Facebook or Google is unchecked, uncheck combined
                    if (combinedCheckbox) combinedCheckbox.checked = false;
                }
                
                // If both Facebook and Google are checked, check combined
                const facebookChecked = document.getElementById('facebook-service')?.checked;
                const googleChecked = document.getElementById('google-service')?.checked;
                if (facebookChecked && googleChecked && checkbox.id !== 'combined-service' && combinedCheckbox) {
                    combinedCheckbox.checked = true;
                }
                
                this.updateFormData();
            });
        });
    }

    updateFormData() {
        const form = document.getElementById('proposal-form');
        if (!form) return;
        
        const formData = new FormData(form);
        
        console.log('Updating form data...');
        
        // Update current data
        this.currentData.serviceProvider = formData.get('serviceProvider') || this.defaultData.serviceProvider;
        this.currentData.clientName = formData.get('clientName') || this.defaultData.clientName;
        this.currentData.services = formData.getAll('services');
        this.currentData.facebookMgmtFee = parseInt(formData.get('facebookMgmtFee')) || this.defaultData.facebookMgmtFee;
        this.currentData.googleMgmtFee = parseInt(formData.get('googleMgmtFee')) || this.defaultData.googleMgmtFee;
        this.currentData.facebookAdSpendMin = parseInt(formData.get('facebookAdSpendMin')) || this.defaultData.facebookAdSpendMin;
        this.currentData.facebookAdSpendMax = parseInt(formData.get('facebookAdSpendMax')) || this.defaultData.facebookAdSpendMax;
        this.currentData.googleAdSpendMin = parseInt(formData.get('googleAdSpendMin')) || this.defaultData.googleAdSpendMin;
        this.currentData.googleAdSpendMax = parseInt(formData.get('googleAdSpendMax')) || this.defaultData.googleAdSpendMax;
        this.currentData.monthlyImpressions = parseInt(formData.get('monthlyImpressions')) || this.defaultData.monthlyImpressions;
        this.currentData.qualifiedLeads = parseInt(formData.get('qualifiedLeads')) || this.defaultData.qualifiedLeads;
        this.currentData.targetCTR = parseFloat(formData.get('targetCTR')) || this.defaultData.targetCTR;
        this.currentData.maxCostPerLead = parseInt(formData.get('maxCostPerLead')) || this.defaultData.maxCostPerLead;
        this.currentData.targetROAS = parseFloat(formData.get('targetROAS')) || this.defaultData.targetROAS;
        this.currentData.projectTimeline = formData.get('projectTimeline') || this.defaultData.projectTimeline;

        console.log('Current data updated:', this.currentData);
        
        // Save to localStorage
        this.saveData();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        console.log('Handling form submission...');
        
        // Update form data
        this.updateFormData();
        
        // Validate required fields
        if (!this.validateForm()) {
            console.log('Form validation failed');
            return;
        }

        console.log('Form validation passed, generating proposal...');
        
        // Show loading
        this.showLoadingOverlay(true);
        
        // Simulate processing time
        setTimeout(() => {
            this.showLoadingOverlay(false);
            this.showStage('dashboard');
            this.showNotification('Proposal generated successfully!', 'success');
        }, 1500);
    }

    validateForm() {
        const requiredFields = [
            { field: 'serviceProvider', message: 'Service provider company name is required' },
            { field: 'clientName', message: 'Client company name is required' }
        ];

        for (const { field, message } of requiredFields) {
            if (!this.currentData[field] || this.currentData[field].trim() === '') {
                this.showNotification(message, 'error');
                return false;
            }
        }

        if (this.currentData.services.length === 0) {
            this.showNotification('Please select at least one service', 'error');
            return false;
        }

        return true;
    }

    // Dashboard Population
    populateDashboard() {
        console.log('Populating dashboard...');
        
        // Update header information
        this.updateElement('display-service-provider', this.currentData.serviceProvider);
        this.updateElement('display-client-name', this.currentData.clientName);
        this.updateElement('proposal-date', new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));

        // Update executive summary
        this.updateExecutiveSummary();
        
        // Update pricing displays
        this.updatePricingDisplays();
        
        // Calculate totals
        this.calculateTotals();
        
        console.log('Dashboard populated successfully');
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        } else {
            console.warn(`Element with id '${id}' not found`);
        }
    }

    updateExecutiveSummary() {
        this.updateElement('summary-impressions', this.currentData.monthlyImpressions.toLocaleString());
        this.updateElement('summary-leads', this.currentData.qualifiedLeads.toString());
        this.updateElement('summary-ctr', this.currentData.targetCTR.toString());
        this.updateElement('summary-cpl', this.currentData.maxCostPerLead.toString());
        this.updateElement('summary-roas', this.currentData.targetROAS.toString());
    }

    updatePricingDisplays() {
        // Facebook pricing
        this.updateElement('fb-mgmt-display', this.currentData.facebookMgmtFee.toString());
        this.updateElement('fb-spend-min-display', this.currentData.facebookAdSpendMin.toString());
        this.updateElement('fb-spend-max-display', this.currentData.facebookAdSpendMax.toString());
        
        // Google pricing
        this.updateElement('google-mgmt-display', this.currentData.googleMgmtFee.toString());
        this.updateElement('google-spend-min-display', this.currentData.googleAdSpendMin.toString());
        this.updateElement('google-spend-max-display', this.currentData.googleAdSpendMax.toString());
    }

    calculateTotals() {
        // Facebook totals
        const fbTotalMin = this.currentData.facebookMgmtFee + this.currentData.facebookAdSpendMin;
        const fbTotalMax = this.currentData.facebookMgmtFee + this.currentData.facebookAdSpendMax;
        
        this.updateElement('fb-total-display', fbTotalMin.toLocaleString());
        this.updateElement('fb-total-max-display', fbTotalMax.toLocaleString());

        // Google totals
        const googleTotalMin = this.currentData.googleMgmtFee + this.currentData.googleAdSpendMin;
        const googleTotalMax = this.currentData.googleMgmtFee + this.currentData.googleAdSpendMax;
        
        this.updateElement('google-total-display', googleTotalMin.toLocaleString());
        this.updateElement('google-total-max-display', googleTotalMax.toLocaleString());

        // Combined totals
        const combinedMgmt = this.currentData.facebookMgmtFee + this.currentData.googleMgmtFee;
        const combinedSpendMin = this.currentData.facebookAdSpendMin + this.currentData.googleAdSpendMin;
        const combinedSpendMax = this.currentData.facebookAdSpendMax + this.currentData.googleAdSpendMax;
        const combinedTotalMin = combinedMgmt + combinedSpendMin;
        const combinedTotalMax = combinedMgmt + combinedSpendMax;

        this.updateElement('combined-mgmt-display', combinedMgmt.toLocaleString());
        this.updateElement('combined-spend-min-display', combinedSpendMin.toLocaleString());
        this.updateElement('combined-spend-max-display', combinedSpendMax.toLocaleString());
        this.updateElement('combined-total-display', combinedTotalMin.toLocaleString());
        this.updateElement('combined-total-max-display', combinedTotalMax.toLocaleString());
    }

    // Dashboard Navigation
    initDashboardNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        console.log('Navigation tabs found:', navTabs.length);
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetSection = tab.getAttribute('data-section');
                console.log('Navigation clicked:', targetSection);
                this.showDashboardSection(targetSection);
                
                // Update active tab
                navTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    showDashboardSection(sectionId) {
        console.log('Showing dashboard section:', sectionId);
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Smooth scroll to section
            targetSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            console.log('Section activated:', sectionId);
        } else {
            console.warn('Section not found:', sectionId);
        }
    }

    // Dashboard Controls
    initDashboardControls() {
        console.log('Initializing dashboard controls...');
        
        // Use event delegation to handle controls that might not exist yet
        document.addEventListener('click', (e) => {
            if (e.target.id === 'copy-report-btn') {
                console.log('Copy report clicked');
                this.copyReportToClipboard();
            } else if (e.target.id === 'download-pdf-btn') {
                console.log('Download PDF clicked');
                this.downloadPDFReport();
            } else if (e.target.id === 'edit-parameters-btn') {
                console.log('Edit parameters clicked');
                this.editParameters();
            } else if (e.target.id === 'reset-default-btn') {
                console.log('Reset defaults clicked');
                this.resetToDefaults();
            }
        });
    }

    async copyReportToClipboard() {
        try {
            const reportContent = this.generateReportContent();
            
            // Try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(reportContent);
            } else {
                // Fallback method
                const textArea = document.createElement('textarea');
                textArea.value = reportContent;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            
            this.showNotification('Report copied to clipboard successfully!', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Failed to copy report. Please try again.', 'error');
        }
    }

    generateReportContent() {
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let content = `DIGITAL MARKETING PROPOSAL\n`;
        content += `Generated: ${date}\n`;
        content += `Service Provider: ${this.currentData.serviceProvider}\n`;
        content += `Client: ${this.currentData.clientName}\n\n`;

        content += `=== EXECUTIVE SUMMARY ===\n`;
        content += `Monthly Impressions Target: ${this.currentData.monthlyImpressions.toLocaleString()}\n`;
        content += `Qualified Leads per Month: ${this.currentData.qualifiedLeads}\n`;
        content += `Target CTR: ${this.currentData.targetCTR}%\n`;
        content += `Maximum Cost per Lead: $${this.currentData.maxCostPerLead}\n`;
        content += `Target ROAS: ${this.currentData.targetROAS}:1\n\n`;

        if (this.currentData.services.includes('facebook')) {
            content += `=== FACEBOOK & INSTAGRAM STRATEGY ===\n`;
            content += `Management Fee: $${this.currentData.facebookMgmtFee}/month\n`;
            content += `Recommended Ad Spend: $${this.currentData.facebookAdSpendMin} - $${this.currentData.facebookAdSpendMax}/month\n`;
            content += `Total Monthly Investment: $${this.currentData.facebookMgmtFee + this.currentData.facebookAdSpendMin} - $${this.currentData.facebookMgmtFee + this.currentData.facebookAdSpendMax}\n\n`;
            
            content += `Campaign Objectives:\n`;
            content += `• Brand Awareness: Reach at least 50,000 targeted impressions/month\n`;
            content += `• Lead Generation: Generate ${this.currentData.qualifiedLeads}+ qualified leads/month\n`;
            content += `• Website Traffic: Drive 1,000+ monthly visits to landing page\n`;
            content += `• Conversion Campaigns: Achieve 4-6% conversion rate on retargeting ads\n`;
            content += `• Retargeting Engagement: Recover at least 30% of warm traffic\n\n`;
        }

        if (this.currentData.services.includes('google')) {
            content += `=== GOOGLE ADS STRATEGY ===\n`;
            content += `Management Fee: $${this.currentData.googleMgmtFee}/month\n`;
            content += `Recommended Ad Spend: $${this.currentData.googleAdSpendMin} - $${this.currentData.googleAdSpendMax}/month\n`;
            content += `Total Monthly Investment: $${this.currentData.googleMgmtFee + this.currentData.googleAdSpendMin} - $${this.currentData.googleMgmtFee + this.currentData.googleAdSpendMax}\n\n`;
            
            content += `Campaign Types:\n`;
            content += `• Search Ads: Capture high-intent traffic from Google searches\n`;
            content += `• Display Ads: Reach passive audiences across websites & apps\n`;
            content += `• YouTube Ads: Promote video content to targeted viewers\n`;
            content += `• Call-Only Ads: Drive direct phone leads (ideal for services)\n`;
            content += `• Remarketing: Re-engage past visitors or abandoned conversions\n\n`;
        }

        if (this.currentData.services.includes('combined')) {
            const combinedMgmt = this.currentData.facebookMgmtFee + this.currentData.googleMgmtFee;
            const combinedSpendMin = this.currentData.facebookAdSpendMin + this.currentData.googleAdSpendMin;
            const combinedSpendMax = this.currentData.facebookAdSpendMax + this.currentData.googleAdSpendMax;
            const combinedTotalMin = combinedMgmt + combinedSpendMin;
            const combinedTotalMax = combinedMgmt + combinedSpendMax;

            content += `=== COMBINED PACKAGE ===\n`;
            content += `Combined Management Fee: $${combinedMgmt}/month\n`;
            content += `Combined Ad Spend: $${combinedSpendMin} - $${combinedSpendMax}/month\n`;
            content += `Total Package Investment: $${combinedTotalMin} - $${combinedTotalMax}/month\n\n`;
        }

        content += `=== PROJECT TIMELINE ===\n`;
        content += `Project Duration: ${this.currentData.projectTimeline} months\n\n`;
        
        content += `Week 1-2: Setup & Research\n`;
        content += `• Business analysis and audience research\n`;
        content += `• Competitor analysis and market research\n`;
        content += `• Campaign strategy development\n`;
        content += `• Account setup and configuration\n\n`;
        
        content += `Week 3-4: Campaign Launch\n`;
        content += `• Creative development and approval\n`;
        content += `• Campaign activation and monitoring\n`;
        content += `• Initial performance tracking\n`;
        content += `• Quick optimizations based on early data\n\n`;
        
        content += `Month 2+: Optimization & Scaling\n`;
        content += `• Weekly performance analysis\n`;
        content += `• Bi-weekly optimization adjustments\n`;
        content += `• Monthly comprehensive reporting\n`;
        content += `• Scaling successful campaigns\n\n`;

        content += `=== NEXT STEPS ===\n`;
        content += `1. Review and approve this proposal\n`;
        content += `2. Sign service agreement and provide access\n`;
        content += `3. Schedule kick-off meeting\n`;
        content += `4. Begin campaign setup and implementation\n\n`;

        content += `=== CONTACT INFORMATION ===\n`;
        content += `Email: contact@mackstordesigns.com\n`;
        content += `Phone: (555) 123-4567\n`;
        content += `Website: www.mackstordesigns.com\n\n`;

        content += `This proposal is valid for 30 days from the date generated.\n`;
        content += `Generated by ${this.currentData.serviceProvider} Digital Marketing Proposal Generator`;

        return content;
    }

    downloadPDFReport() {
        this.showLoadingOverlay(true);
        
        setTimeout(() => {
            try {
                if (typeof window.jspdf === 'undefined') {
                    throw new Error('jsPDF library not loaded');
                }

                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Set font
                doc.setFont('helvetica');
                
                // Header
                doc.setFontSize(20);
                doc.setTextColor(33, 128, 141);
                doc.text('Digital Marketing Proposal', 105, 20, { align: 'center' });
                
                doc.setFontSize(14);
                doc.setTextColor(100, 100, 100);
                doc.text(`${this.currentData.clientName}`, 105, 30, { align: 'center' });
                
                doc.setFontSize(10);
                doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 40, { align: 'center' });
                
                // Company Information
                let yPosition = 55;
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text(`Service Provider: ${this.currentData.serviceProvider}`, 20, yPosition);
                yPosition += 10;
                doc.text(`Client: ${this.currentData.clientName}`, 20, yPosition);
                yPosition += 20;
                
                // Executive Summary
                yPosition = this.addPDFSection(doc, 'Executive Summary', yPosition);
                yPosition = this.addPDFText(doc, `Monthly Impressions: ${this.currentData.monthlyImpressions.toLocaleString()}`, yPosition);
                yPosition = this.addPDFText(doc, `Qualified Leads: ${this.currentData.qualifiedLeads}/month`, yPosition);
                yPosition = this.addPDFText(doc, `Target CTR: ${this.currentData.targetCTR}%`, yPosition);
                yPosition = this.addPDFText(doc, `Max Cost/Lead: $${this.currentData.maxCostPerLead}`, yPosition);
                yPosition = this.addPDFText(doc, `Target ROAS: ${this.currentData.targetROAS}:1`, yPosition);
                
                yPosition += 10;
                
                // Services
                if (this.currentData.services.includes('facebook')) {
                    if (yPosition > 220) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    
                    yPosition = this.addPDFSection(doc, 'Facebook & Instagram Strategy', yPosition);
                    yPosition = this.addPDFText(doc, `Management Fee: $${this.currentData.facebookMgmtFee}/month`, yPosition);
                    yPosition = this.addPDFText(doc, `Ad Spend: $${this.currentData.facebookAdSpendMin} - $${this.currentData.facebookAdSpendMax}/month`, yPosition);
                    
                    const fbTotal = this.currentData.facebookMgmtFee + this.currentData.facebookAdSpendMin;
                    const fbTotalMax = this.currentData.facebookMgmtFee + this.currentData.facebookAdSpendMax;
                    yPosition = this.addPDFText(doc, `Total: $${fbTotal} - $${fbTotalMax}/month`, yPosition);
                    yPosition += 10;
                }
                
                if (this.currentData.services.includes('google')) {
                    if (yPosition > 220) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    
                    yPosition = this.addPDFSection(doc, 'Google Ads Strategy', yPosition);
                    yPosition = this.addPDFText(doc, `Management Fee: $${this.currentData.googleMgmtFee}/month`, yPosition);
                    yPosition = this.addPDFText(doc, `Ad Spend: $${this.currentData.googleAdSpendMin} - $${this.currentData.googleAdSpendMax}/month`, yPosition);
                    
                    const googleTotal = this.currentData.googleMgmtFee + this.currentData.googleAdSpendMin;
                    const googleTotalMax = this.currentData.googleMgmtFee + this.currentData.googleAdSpendMax;
                    yPosition = this.addPDFText(doc, `Total: $${googleTotal} - $${googleTotalMax}/month`, yPosition);
                    yPosition += 10;
                }
                
                // Footer
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(`${this.currentData.serviceProvider} | Digital Marketing Services`, 105, 280, { align: 'center' });
                doc.text('This proposal is valid for 30 days from generation date', 105, 285, { align: 'center' });
                
                // Generate filename
                const fileName = `proposal-${this.currentData.clientName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
                
                // Save the PDF
                doc.save(fileName);
                
                this.showNotification('PDF downloaded successfully!', 'success');
                
            } catch (error) {
                console.error('PDF generation error:', error);
                this.showNotification('Error generating PDF. Please try again.', 'error');
            }
            
            this.showLoadingOverlay(false);
        }, 1000);
    }

    addPDFSection(doc, title, yPosition) {
        doc.setFontSize(14);
        doc.setTextColor(33, 128, 141);
        doc.text(title, 20, yPosition);
        return yPosition + 10;
    }

    addPDFText(doc, text, yPosition) {
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(text, 25, yPosition);
        return yPosition + 7;
    }

    editParameters() {
        this.populateFormWithCurrentData();
        this.showStage('setup');
        this.showNotification('Edit your parameters and regenerate the proposal', 'info');
    }

    populateFormWithCurrentData() {
        const form = document.getElementById('proposal-form');
        if (!form) return;
        
        // Populate text inputs
        const elements = {
            'service-provider': this.currentData.serviceProvider,
            'client-name': this.currentData.clientName,
            'facebook-mgmt-fee': this.currentData.facebookMgmtFee,
            'google-mgmt-fee': this.currentData.googleMgmtFee,
            'facebook-ad-spend-min': this.currentData.facebookAdSpendMin,
            'facebook-ad-spend-max': this.currentData.facebookAdSpendMax,
            'google-ad-spend-min': this.currentData.googleAdSpendMin,
            'google-ad-spend-max': this.currentData.googleAdSpendMax,
            'monthly-impressions': this.currentData.monthlyImpressions,
            'qualified-leads': this.currentData.qualifiedLeads,
            'target-ctr': this.currentData.targetCTR,
            'max-cost-per-lead': this.currentData.maxCostPerLead,
            'target-roas': this.currentData.targetROAS,
            'project-timeline': this.currentData.projectTimeline
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = form.querySelector(`#${id}`);
            if (element) {
                element.value = value;
            }
        });
        
        // Populate checkboxes
        this.currentData.services.forEach(service => {
            const checkbox = form.querySelector(`#${service}-service`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }

    resetToDefaults() {
        if (confirm('Are you sure you want to reset all parameters to default values? This action cannot be undone.')) {
            this.currentData = { ...this.defaultData };
            
            if (this.currentStage === 'setup') {
                this.populateFormWithCurrentData();
            } else {
                this.populateDashboard();
            }
            
            this.saveData();
            this.showNotification('All parameters reset to default values', 'info');
        }
    }

    // Data Management
    saveData() {
        try {
            localStorage.setItem('proposalGeneratorData', JSON.stringify({
                data: this.currentData,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Failed to save data to localStorage:', error);
        }
    }

    loadSavedData() {
        try {
            const saved = localStorage.getItem('proposalGeneratorData');
            if (saved) {
                const { data, timestamp } = JSON.parse(saved);
                
                // Check if data is less than 7 days old
                const isRecent = (Date.now() - timestamp) < (7 * 24 * 60 * 60 * 1000);
                
                if (isRecent && data) {
                    this.currentData = { ...this.defaultData, ...data };
                    this.populateFormWithCurrentData();
                    console.log('Previous session data restored');
                }
            }
        } catch (error) {
            console.warn('Failed to load saved data:', error);
        }
    }

    // Utility Functions
    showLoadingOverlay(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        // Set styles based on type
        const colors = {
            success: '#21808d',
            error: '#c0152f',
            info: '#626c71',
            warning: '#a84b2f'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 16px 20px;
            background: ${colors[type]};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            animation: slideIn 0.3s ease-out;
            font-family: var(--font-family-base);
            font-size: 14px;
            font-weight: 500;
        `;
        
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.2)'" onmouseout="this.style.backgroundColor='transparent'">×</button>
        `;
        
        // Add animation styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Initialize the application
let proposalGenerator;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing application...');
    proposalGenerator = new ProposalGenerator();
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    proposalGenerator.saveData();
                    proposalGenerator.showNotification('Data saved', 'success');
                    break;
                case 'p':
                    if (e.shiftKey && proposalGenerator.currentStage === 'dashboard') {
                        e.preventDefault();
                        proposalGenerator.downloadPDFReport();
                    }
                    break;
                case 'c':
                    if (e.shiftKey && proposalGenerator.currentStage === 'dashboard') {
                        e.preventDefault();
                        proposalGenerator.copyReportToClipboard();
                    }
                    break;
            }
        }
    });
    
    // Handle browser navigation
    window.addEventListener('beforeunload', (e) => {
        if (proposalGenerator) {
            proposalGenerator.saveData();
        }
    });
    
    // Global error handling
    window.addEventListener('error', (e) => {
        console.error('Application error:', e);
        if (proposalGenerator) {
            proposalGenerator.showNotification('An unexpected error occurred. Please refresh the page.', 'error');
        }
    });
    
    // Export for debugging
    window.proposalGenerator = proposalGenerator;
    
    console.log('Proposal Generator application loaded successfully!');
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState !== 'loading') {
    console.log('Document already loaded - Initializing application...');
    proposalGenerator = new ProposalGenerator();
}