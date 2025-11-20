/** @odoo-module **/

import { onMounted, onWillUnmount } from "@odoo/owl";
import { patch } from "@web/core/utils/patch";
import { FormRenderer } from "@web/views/form/form_renderer";
import { session } from "@web/session";

/**
 * Flexible Chatter Drawer
 * Transform chatter into a customizable drawer with extensive options
 * Configuration-driven design for maximum flexibility
 */
patch(FormRenderer.prototype, {
    setup() {
        super.setup();
        
        onMounted(() => {
            // Get configuration from session
            this.drawerConfig = session.chatter_drawer_config || this._getDefaultConfig();
            
            try {
                const modelName = this.props?.record?.resModel || this.env?.model?.root?.resModel;
                
                // Check if model is excluded
                if (this._isModelExcluded(modelName)) {
                    console.debug(`Skipping chatter drawer for ${modelName} (excluded)`);
                    return;
                }
                
                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    const chatterContainer = document.querySelector('.o-mail-Form-chatter');
                    if (chatterContainer && !this._chatterElements) {
                        this.setupFlexibleChatterDrawer();
                        this.injectDynamicStyles();
                    }
                }, 100);
            } catch (error) {
                console.debug('Chatter drawer setup error:', error);
            }
        });

        onWillUnmount(() => {
            this.cleanupChatterDrawer();
            this.removeDynamicStyles();
        });
    },

    _getDefaultConfig() {
        return {
            buttonColorPrimary: '#667eea',
            buttonColorSecondary: '#764ba2',
            buttonIconColor: '#ffffff',
            drawerBackgroundColor: '#f8f9fa',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            closeButtonColor: '#6c757d',
            closeButtonHoverColor: '#dc3545',
            sendMessageBgColor: '',
            sendMessageTextColor: '',
            logNoteBgColor: '',
            logNoteTextColor: '',
            activitiesBgColor: '',
            activitiesTextColor: '',
            buttonSize: 60,
            buttonBorderRadius: 50,
            drawerWidth: 50,
            drawerWidthMobile: 100,
            buttonShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            buttonPosition: 'bottom-right',
            buttonHorizontalOffset: 30,
            buttonVerticalOffset: 30,
            drawerSide: 'right',
            zIndexButton: 1040,
            zIndexOverlay: 1045,
            zIndexDrawer: 1050,
            enableAnimations: true,
            enablePulseEffect: true,
            animationDuration: 0.3,
            enableOverlay: true,
            excludeModels: ['res.users'],
            customCss: '',
            enableDarkMode: true,
            darkModeDrawerBg: '#2d3748',
            darkModeCloseBtnBg: '#2d3748',
            buttonIcon: 'fa-comments',
        };
    },

    _isModelExcluded(modelName) {
        const excludedModels = this.drawerConfig.excludeModels || [];
        return excludedModels.includes(modelName);
    },

    setupFlexibleChatterDrawer() {
        try {
            const chatterContainer = document.querySelector('.o-mail-Form-chatter');
            if (!chatterContainer) return;
            
            // Check if already setup
            if (chatterContainer.classList.contains('flexible-chatter-drawer')) {
                console.debug('Chatter drawer already setup, skipping...');
                return;
            }

            // Add drawer classes
            chatterContainer.classList.add('flexible-chatter-drawer');
            
            // Create floating button
            let floatingBtn = document.querySelector('.flexible-chatter-floating-btn');
            if (!floatingBtn) {
                floatingBtn = document.createElement('button');
                floatingBtn.className = 'flexible-chatter-floating-btn';
                floatingBtn.innerHTML = `<i class="fa ${this.drawerConfig.buttonIcon} fa-lg"></i>`;
                floatingBtn.title = 'Open Chatter';
                floatingBtn.onclick = () => this.openChatterDrawer();
                document.body.appendChild(floatingBtn);
            } else {
                floatingBtn.onclick = () => this.openChatterDrawer();
            }
            
            // Create overlay if enabled
            let overlay = null;
            if (this.drawerConfig.enableOverlay) {
                overlay = document.querySelector('.flexible-chatter-drawer-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'flexible-chatter-drawer-overlay';
                    overlay.onclick = () => this.closeChatterDrawer();
                    document.body.appendChild(overlay);
                } else {
                    overlay.onclick = () => this.closeChatterDrawer();
                }
            }
            
            // Create close button in chatter
            const closeBtn = document.createElement('button');
            closeBtn.className = 'flexible-chatter-close-btn m-3';
            closeBtn.innerHTML = '<i class="fa fa-times"></i>';
            closeBtn.title = 'Close';
            closeBtn.onclick = () => this.closeChatterDrawer();
            
            // Insert close button
            chatterContainer.insertBefore(closeBtn, chatterContainer.firstChild);
            
            // Store references
            this._chatterElements = { floatingBtn, overlay, closeBtn, chatterContainer };
        } catch (error) {
            console.error('Error setting up flexible chatter drawer:', error);
        }
    },

    openChatterDrawer() {
        if (!this._chatterElements) return;
        
        const { floatingBtn, overlay, chatterContainer } = this._chatterElements;
        
        chatterContainer.classList.add('open');
        if (overlay) overlay.classList.add('open');
        floatingBtn.style.display = 'none';
    },

    closeChatterDrawer() {
        if (!this._chatterElements) return;
        
        const { floatingBtn, overlay, chatterContainer } = this._chatterElements;
        
        chatterContainer.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        floatingBtn.style.display = 'flex';
    },

    injectDynamicStyles() {
        // Remove any existing dynamic styles
        this.removeDynamicStyles();
        
        const config = this.drawerConfig;
        
        // Calculate button position CSS
        const positionMap = {
            'bottom-right': `bottom: ${config.buttonVerticalOffset}px; right: ${config.buttonHorizontalOffset}px;`,
            'bottom-left': `bottom: ${config.buttonVerticalOffset}px; left: ${config.buttonHorizontalOffset}px;`,
            'top-right': `top: ${config.buttonVerticalOffset}px; right: ${config.buttonHorizontalOffset}px;`,
            'top-left': `top: ${config.buttonVerticalOffset}px; left: ${config.buttonHorizontalOffset}px;`,
        };
        
        const buttonPosition = positionMap[config.buttonPosition] || positionMap['bottom-right'];
        
        // Drawer position based on side
        const drawerClosedPosition = config.drawerSide === 'left' ? 'left: -50%;' : 'right: -50%;';
        const drawerOpenPosition = config.drawerSide === 'left' ? 'left: 0;' : 'right: 0;';
        const drawerSide = config.drawerSide === 'left' ? 'left: 0;' : 'right: 0;';
        
        // Animation settings
        const transitionDuration = config.enableAnimations ? `${config.animationDuration}s` : '0s';
        const pulseAnimation = config.enablePulseEffect ? 'pulseFloat 2s ease-in-out infinite' : 'none';
        
        // Build CSS
        let css = `
            /* Flexible Chatter Drawer - Dynamic Styles */
            
            /* Floating Button */
            .flexible-chatter-floating-btn {
                position: fixed;
                ${buttonPosition}
                width: ${config.buttonSize}px;
                height: ${config.buttonSize}px;
                border-radius: ${config.buttonBorderRadius}%;
                background: linear-gradient(135deg, ${config.buttonColorPrimary} 0%, ${config.buttonColorSecondary} 100%);
                color: ${config.buttonIconColor};
                border: none;
                box-shadow: ${config.buttonShadow};
                cursor: pointer;
                z-index: ${config.zIndexButton};
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                animation: ${pulseAnimation};
            }
            
            .flexible-chatter-floating-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px ${config.buttonColorPrimary}99;
            }
            
            .flexible-chatter-floating-btn:active {
                transform: scale(0.95);
            }
            
            /* Drawer Overlay */
            .flexible-chatter-drawer-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: ${config.overlayColor};
                z-index: ${config.zIndexOverlay};
                opacity: 0;
                pointer-events: none;
                transition: opacity ${transitionDuration} ease-out;
            }
            
            .flexible-chatter-drawer-overlay.open {
                opacity: 1;
                pointer-events: all;
            }
            
            /* Make form sheet take full width when drawer is active */
            .o_form_view .o_form_sheet_bg {
                max-width: 100% !important;
            }
            
            /* Drawer Container */
            .o-mail-Form-chatter.flexible-chatter-drawer {
                position: fixed !important;
                top: 0;
                ${drawerSide}
                ${drawerClosedPosition}
                width: ${config.drawerWidth}%;
                height: 100vh;
                background: ${config.drawerBackgroundColor};
                box-shadow: ${config.drawerSide === 'left' ? '4px' : '-4px'} 0 20px rgba(0, 0, 0, 0.15);
                z-index: ${config.zIndexDrawer};
                transition: ${config.drawerSide} ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1);
                margin: 0;
                padding: 0;
                overflow-y: auto;
                overflow-x: hidden;
            }
            
            .o-mail-Form-chatter.flexible-chatter-drawer.open {
                ${drawerOpenPosition}
            }
            
            /* Close Button */
            .flexible-chatter-close-btn {
                position: sticky;
                top: 10px;
                ${config.drawerSide === 'left' ? 'left' : 'right'}: 10px;
                margin-left: auto;
                margin-bottom: 10px;
                width: 36px;
                height: 36px;
                border-radius: 4px;
                background: white;
                color: ${config.closeButtonColor};
                border: 1px solid #dee2e6;
                cursor: pointer;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                font-size: 18px;
            }
            
            .flexible-chatter-close-btn:hover {
                background: #f8f9fa;
                color: ${config.closeButtonHoverColor};
                border-color: ${config.closeButtonHoverColor};
            }
            
            /* Drawer Body - MAXIMUM COVERAGE Background (Light Mode) */
            
            /* Apply to the main drawer */
            .o-mail-Form-chatter.flexible-chatter-drawer {
                background: ${config.drawerBackgroundColor} !important;
                background-color: ${config.drawerBackgroundColor} !important;
                background-image: none !important;
            }
            
            /* Apply to ALL child elements aggressively */
            .o-mail-Form-chatter.flexible-chatter-drawer > *,
            .o-mail-Form-chatter.flexible-chatter-drawer *,
            .o-mail-Form-chatter.flexible-chatter-drawer div,
            .o-mail-Form-chatter.flexible-chatter-drawer section,
            .o-mail-Form-chatter.flexible-chatter-drawer article {
                background: ${config.drawerBackgroundColor} !important;
                background-color: ${config.drawerBackgroundColor} !important;
                background-image: none !important;
            }
            
            /* EXCEPTION: Specific Chatter Buttons - Use configured colors or keep original */
            .o-mail-Form-chatter.flexible-chatter-drawer .o-mail-Chatter-sendMessage {
                ${config.sendMessageBgColor ? `background: ${config.sendMessageBgColor} !important;` : 'background: initial !important;'}
                ${config.sendMessageBgColor ? `background-color: ${config.sendMessageBgColor} !important;` : 'background-color: initial !important;'}
                background-image: initial !important;
                ${config.sendMessageTextColor ? `color: ${config.sendMessageTextColor} !important;` : ''}
            }
            .o-mail-Form-chatter.flexible-chatter-drawer .o-mail-Chatter-logNote {
                ${config.logNoteBgColor ? `background: ${config.logNoteBgColor} !important;` : 'background: initial !important;'}
                ${config.logNoteBgColor ? `background-color: ${config.logNoteBgColor} !important;` : 'background-color: initial !important;'}
                background-image: initial !important;
                ${config.logNoteTextColor ? `color: ${config.logNoteTextColor} !important;` : ''}
            }
            .o-mail-Form-chatter.flexible-chatter-drawer .o-mail-Chatter-activity {
                ${config.activitiesBgColor ? `background: ${config.activitiesBgColor} !important;` : 'background: initial !important;'}
                ${config.activitiesBgColor ? `background-color: ${config.activitiesBgColor} !important;` : 'background-color: initial !important;'}
                background-image: initial !important;
                ${config.activitiesTextColor ? `color: ${config.activitiesTextColor} !important;` : ''}
            }
            
            /* All other buttons keep Odoo default styling */
            .o-mail-Form-chatter.flexible-chatter-drawer button:not(.o-mail-Chatter-sendMessage):not(.o-mail-Chatter-logNote):not(.o-mail-Chatter-activity),
            .o-mail-Form-chatter.flexible-chatter-drawer .btn:not(.o-mail-Chatter-sendMessage):not(.o-mail-Chatter-logNote):not(.o-mail-Chatter-activity) {
                background: initial !important;
                background-color: initial !important;
                background-image: initial !important;
                color: initial !important;
            }
            
            /* EXCEPTION: Badges keep their styling */
            .o-mail-Form-chatter.flexible-chatter-drawer .badge,
            .o-mail-Form-chatter.flexible-chatter-drawer .badge * {
                background: initial !important;
                background-color: initial !important;
            }
            
            /* EXCEPTION: Dropdown menus */
            .o-mail-Form-chatter.flexible-chatter-drawer .dropdown-menu,
            .o-mail-Form-chatter.flexible-chatter-drawer .dropdown-menu * {
                background: initial !important;
                background-color: initial !important;
            }
            
            /* EXCEPTION: Avatars and images */
            .o-mail-Form-chatter.flexible-chatter-drawer img,
            .o-mail-Form-chatter.flexible-chatter-drawer .o_avatar {
                background: initial !important;
                background-color: initial !important;
            }
            
            /* Main padding for chatter */
            .o-mail-Form-chatter.flexible-chatter-drawer .o-mail-Chatter {
                padding: 20px;
            }
            
            /* Custom scrollbar */
            .o-mail-Form-chatter.flexible-chatter-drawer::-webkit-scrollbar {
                width: 8px;
            }
            
            .o-mail-Form-chatter.flexible-chatter-drawer::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            
            .o-mail-Form-chatter.flexible-chatter-drawer::-webkit-scrollbar-thumb {
                background: ${config.buttonColorPrimary};
                border-radius: 4px;
            }
            
            .o-mail-Form-chatter.flexible-chatter-drawer::-webkit-scrollbar-thumb:hover {
                background: ${config.buttonColorSecondary};
            }
            
            /* Pulse animation */
            @keyframes pulseFloat {
                0%, 100% {
                    box-shadow: ${config.buttonShadow};
                }
                50% {
                    box-shadow: 0 6px 30px ${config.buttonColorPrimary}99;
                }
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .o-mail-Form-chatter.flexible-chatter-drawer {
                    width: ${config.drawerWidthMobile}%;
                    ${config.drawerSide === 'left' ? 'left: -100%;' : 'right: -100%;'}
                }
                
                .o-mail-Form-chatter.flexible-chatter-drawer.open {
                    ${config.drawerSide === 'left' ? 'left: 0;' : 'right: 0;'}
                }
            }
            
            /* Dark mode support - MAXIMUM COVERAGE */
            ${config.enableDarkMode ? `
            @media (prefers-color-scheme: dark) {
                /* Main drawer */
                .o-mail-Form-chatter.flexible-chatter-drawer {
                    background: ${config.darkModeDrawerBg} !important;
                    background-color: ${config.darkModeDrawerBg} !important;
                    background-image: none !important;
                }
                
                /* Apply to ALL child elements and divs */
                .o-mail-Form-chatter.flexible-chatter-drawer > *,
                .o-mail-Form-chatter.flexible-chatter-drawer *,
                .o-mail-Form-chatter.flexible-chatter-drawer div,
                .o-mail-Form-chatter.flexible-chatter-drawer section,
                .o-mail-Form-chatter.flexible-chatter-drawer article {
                    background: ${config.darkModeDrawerBg} !important;
                    background-color: ${config.darkModeDrawerBg} !important;
                    background-image: none !important;
                }
                
                /* EXCEPTION: Specific Chatter Buttons in dark mode - Use configured colors or keep original */
                .o-mail-Form-chatter.flexible-chatter-drawer .o-mail-Chatter-sendMessage {
                    ${config.sendMessageBgColor ? `background: ${config.sendMessageBgColor} !important;` : 'background: initial !important;'}
                    ${config.sendMessageBgColor ? `background-color: ${config.sendMessageBgColor} !important;` : 'background-color: initial !important;'}
                    background-image: initial !important;
                    ${config.sendMessageTextColor ? `color: ${config.sendMessageTextColor} !important;` : ''}
                }
                .o-mail-Form-chatter.flexible-chatter-drawer .o-mail-Chatter-logNote {
                    ${config.logNoteBgColor ? `background: ${config.logNoteBgColor} !important;` : 'background: initial !important;'}
                    ${config.logNoteBgColor ? `background-color: ${config.logNoteBgColor} !important;` : 'background-color: initial !important;'}
                    background-image: initial !important;
                    ${config.logNoteTextColor ? `color: ${config.logNoteTextColor} !important;` : ''}
                }
                .o-mail-Form-chatter.flexible-chatter-drawer .o-mail-Chatter-activity {
                    ${config.activitiesBgColor ? `background: ${config.activitiesBgColor} !important;` : 'background: initial !important;'}
                    ${config.activitiesBgColor ? `background-color: ${config.activitiesBgColor} !important;` : 'background-color: initial !important;'}
                    background-image: initial !important;
                    ${config.activitiesTextColor ? `color: ${config.activitiesTextColor} !important;` : ''}
                }
                
                /* All other buttons keep Odoo default styling in dark mode */
                .o-mail-Form-chatter.flexible-chatter-drawer button:not(.o-mail-Chatter-sendMessage):not(.o-mail-Chatter-logNote):not(.o-mail-Chatter-activity),
                .o-mail-Form-chatter.flexible-chatter-drawer .btn:not(.o-mail-Chatter-sendMessage):not(.o-mail-Chatter-logNote):not(.o-mail-Chatter-activity) {
                    background: initial !important;
                    background-color: initial !important;
                    background-image: initial !important;
                    color: initial !important;
                }
                
                /* Button children in dark mode */
                .o-mail-Form-chatter.flexible-chatter-drawer button *,
                .o-mail-Form-chatter.flexible-chatter-drawer .btn * {
                    background: transparent !important;
                    background-color: transparent !important;
                    background-image: none !important;
                }
                
                /* EXCEPTION: Badges */
                .o-mail-Form-chatter.flexible-chatter-drawer .badge,
                .o-mail-Form-chatter.flexible-chatter-drawer .badge * {
                    background: initial !important;
                    background-color: initial !important;
                }
                
                /* EXCEPTION: Dropdown menus */
                .o-mail-Form-chatter.flexible-chatter-drawer .dropdown-menu,
                .o-mail-Form-chatter.flexible-chatter-drawer .dropdown-menu * {
                    background: initial !important;
                    background-color: initial !important;
                }
                
                /* EXCEPTION: Avatars and images */
                .o-mail-Form-chatter.flexible-chatter-drawer img,
                .o-mail-Form-chatter.flexible-chatter-drawer .o_avatar {
                    background: initial !important;
                    background-color: initial !important;
                }
                
                /* Close button dark mode */
                .flexible-chatter-close-btn {
                    background: ${config.darkModeCloseBtnBg} !important;
                    color: #e2e8f0;
                    border-color: #4a5568;
                }
                
                .flexible-chatter-close-btn:hover {
                    background: #1a202c !important;
                    color: #fc8181;
                    border-color: #fc8181;
                }
            }
            ` : ''}
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .flexible-chatter-floating-btn {
                    animation: none !important;
                }
                
                .flexible-chatter-drawer {
                    transition: none !important;
                }
                
                .flexible-chatter-drawer-overlay {
                    transition: none !important;
                }
            }
            
            /* High contrast mode */
            @media (prefers-contrast: high) {
                .flexible-chatter-floating-btn {
                    background: #000;
                    border: 2px solid #fff;
                }
                
                .flexible-chatter-drawer {
                    border-${config.drawerSide === 'left' ? 'right' : 'left'}: 2px solid #000;
                }
            }
            
            /* Print - Hide drawer */
            @media print {
                .flexible-chatter-floating-btn,
                .flexible-chatter-drawer,
                .flexible-chatter-drawer-overlay {
                    display: none !important;
                }
            }
            
            /* Custom CSS from configuration */
            ${config.customCss}
        `;
        
        // Inject styles
        const styleElement = document.createElement('style');
        styleElement.id = 'flexible-chatter-drawer-dynamic-styles';
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
        
        this._dynamicStyleElement = styleElement;
    },

    removeDynamicStyles() {
        if (this._dynamicStyleElement && this._dynamicStyleElement.parentNode) {
            this._dynamicStyleElement.parentNode.removeChild(this._dynamicStyleElement);
            this._dynamicStyleElement = null;
        }
        
        // Also remove any orphaned style elements
        const existingStyles = document.getElementById('flexible-chatter-drawer-dynamic-styles');
        if (existingStyles && existingStyles.parentNode) {
            existingStyles.parentNode.removeChild(existingStyles);
        }
    },

    cleanupChatterDrawer() {
        try {
            if (!this._chatterElements) return;
            
            const { floatingBtn, overlay, closeBtn, chatterContainer } = this._chatterElements;
            
            // Remove floating button and overlay
            if (floatingBtn && floatingBtn.parentNode) {
                floatingBtn.parentNode.removeChild(floatingBtn);
            }
            
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            
            // Remove close button
            if (closeBtn && closeBtn.parentNode) {
                closeBtn.parentNode.removeChild(closeBtn);
            }
            
            // Remove drawer classes
            if (chatterContainer) {
                chatterContainer.classList.remove('flexible-chatter-drawer');
                chatterContainer.classList.remove('open');
            }
            
            // Clear references
            this._chatterElements = null;
        } catch (error) {
            console.debug('Error cleaning up chatter drawer:', error);
        }
    },
});

