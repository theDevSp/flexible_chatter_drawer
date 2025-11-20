# -*- coding: utf-8 -*-
# Part of Flexible Chatter Drawer. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
import json


class ChatterDrawerConfig(models.Model):
    _name = 'chatter.drawer.config'
    _description = 'Chatter Drawer Configuration'
    _rec_name = 'id'

    @api.model
    def _get_default_id(self):
        """Ensure we always work with ID 1"""
        return 1

    # Override default method to always return id=1
    @api.model
    def default_get(self, fields_list):
        res = super(ChatterDrawerConfig, self).default_get(fields_list)
        res['id'] = 1
        return res

    # === COLORS & DESIGN ===
    button_color_primary = fields.Char(
        string='Button Primary Color',
        default='#667eea',
        help='Primary gradient color for the floating button'
    )
    button_color_secondary = fields.Char(
        string='Button Secondary Color',
        default='#764ba2',
        help='Secondary gradient color for the floating button'
    )
    button_icon_color = fields.Char(
        string='Button Icon Color',
        default='#ffffff',
        help='Color of the icon inside the button'
    )
    drawer_background_color = fields.Char(
        string='Drawer Background',
        default='#f8f9fa',
        help='Background color of the drawer'
    )
    overlay_color = fields.Char(
        string='Overlay Color',
        default='rgba(0, 0, 0, 0.5)',
        help='Color of the overlay background (supports rgba)'
    )
    close_button_color = fields.Char(
        string='Close Button Color',
        default='#6c757d',
        help='Color of the close button'
    )
    close_button_hover_color = fields.Char(
        string='Close Button Hover',
        default='#dc3545',
        help='Color of the close button on hover'
    )
    
    # Color Palette Selection
    color_palette = fields.Selection([
        ('custom', 'Custom Colors'),
        ('odoo_default', 'Odoo Default'),
        ('purple_elegance', 'Purple Elegance'),
        ('ocean_breeze', 'Ocean Breeze'),
        ('sunset_vibes', 'Sunset Vibes'),
        ('forest_calm', 'Forest Calm'),
        ('coral_dream', 'Coral Dream'),
        ('vintage_rose', 'Vintage Rose'),
        ('midnight_sky', 'Midnight Sky'),
        ('golden_hour', 'Golden Hour'),
        ('arctic_frost', 'Arctic Frost'),
        ('tropical_paradise', 'Tropical Paradise'),
        ('autumn_leaves', 'Autumn Leaves'),
        ('candy_pop', 'Candy Pop'),
        ('earth_tones', 'Earth Tones'),
        ('neon_nights', 'Neon Nights'),
        ('pastel_spring', 'Pastel Spring'),
        ('deep_ocean', 'Deep Ocean'),
        ('cherry_blossom', 'Cherry Blossom'),
        ('desert_sand', 'Desert Sand'),
        ('lavender_fields', 'Lavender Fields'),
    ], string='Color Palette', default='odoo_default', 
       help='Choose a predefined color palette or use custom colors')
    
    # Send Message Button Colors
    send_message_bg_color = fields.Char(
        string='Send Message Background',
        default='',
        help='Background color for Send Message button (empty = use Odoo default)'
    )
    send_message_text_color = fields.Char(
        string='Send Message Text Color',
        default='',
        help='Text color for Send Message button (empty = use Odoo default)'
    )
    
    # Log Note Button Colors
    log_note_bg_color = fields.Char(
        string='Log Note Background',
        default='',
        help='Background color for Log Note button (empty = use Odoo default)'
    )
    log_note_text_color = fields.Char(
        string='Log Note Text Color',
        default='',
        help='Text color for Log Note button (empty = use Odoo default)'
    )
    
    # Activities Button Colors
    activities_bg_color = fields.Char(
        string='Activities Background',
        default='',
        help='Background color for Activities button (empty = use Odoo default)'
    )
    activities_text_color = fields.Char(
        string='Activities Text Color',
        default='',
        help='Text color for Activities button (empty = use Odoo default)'
    )

    # === SIZING ===
    button_size = fields.Integer(
        string='Button Size (px)',
        default=60,
        help='Width and height of the floating button in pixels'
    )
    button_border_radius = fields.Integer(
        string='Button Border Radius (%)',
        default=50,
        help='Border radius of the button (50 = circle, lower = rounded square)'
    )
    drawer_width = fields.Integer(
        string='Drawer Width (%)',
        default=50,
        help='Width of the drawer as percentage of screen width'
    )
    drawer_width_mobile = fields.Integer(
        string='Drawer Width Mobile (%)',
        default=100,
        help='Width of the drawer on mobile devices'
    )
    button_shadow_size = fields.Selection([
        ('none', 'None'),
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
    ], string='Button Shadow', default='medium', help='Shadow intensity for the button')

    # === POSITIONING ===
    button_position = fields.Selection([
        ('bottom-right', 'Bottom Right'),
        ('bottom-left', 'Bottom Left'),
        ('top-right', 'Top Right'),
        ('top-left', 'Top Left'),
    ], string='Button Position', default='bottom-right', help='Position of the floating button')
    
    button_horizontal_offset = fields.Integer(
        string='Button Horizontal Offset (px)',
        default=30,
        help='Distance from the horizontal edge'
    )
    button_vertical_offset = fields.Integer(
        string='Button Vertical Offset (px)',
        default=30,
        help='Distance from the vertical edge'
    )
    
    drawer_side = fields.Selection([
        ('right', 'Right Side'),
        ('left', 'Left Side'),
    ], string='Drawer Side', default='right', help='Which side the drawer slides from')
    
    z_index_button = fields.Integer(
        string='Button Z-Index',
        default=1040,
        help='Z-index for the floating button'
    )
    z_index_overlay = fields.Integer(
        string='Overlay Z-Index',
        default=1045,
        help='Z-index for the overlay'
    )
    z_index_drawer = fields.Integer(
        string='Drawer Z-Index',
        default=1050,
        help='Z-index for the drawer'
    )

    # === EFFECTS & ANIMATIONS ===
    enable_animations = fields.Boolean(
        string='Enable Animations',
        default=True,
        help='Enable slide and fade animations'
    )
    enable_pulse_effect = fields.Boolean(
        string='Enable Pulse Effect',
        default=True,
        help='Enable pulsing animation on the button'
    )
    animation_duration = fields.Float(
        string='Animation Duration (s)',
        default=0.3,
        help='Duration of animations in seconds'
    )
    enable_overlay = fields.Boolean(
        string='Show Overlay',
        default=True,
        help='Show overlay when drawer is open'
    )

    # === ADVANCED ===
    exclude_models = fields.Text(
        string='Exclude Models',
        default='res.users',
        help='Comma-separated list of models to exclude (e.g., res.users, res.partner)'
    )
    custom_css = fields.Text(
        string='Custom CSS',
        help='Add custom CSS rules (advanced users only)'
    )
    enable_dark_mode = fields.Boolean(
        string='Enable Dark Mode Support',
        default=True,
        help='Automatically adjust colors for dark mode'
    )
    dark_mode_drawer_bg = fields.Char(
        string='Dark Mode Drawer Background',
        default='#2d3748',
        help='Drawer background color in dark mode'
    )
    dark_mode_close_btn_bg = fields.Char(
        string='Dark Mode Close Button Background',
        default='#2d3748',
        help='Close button background in dark mode'
    )

    # === ICON ===
    button_icon = fields.Selection([
        ('fa-comments', 'Comments (default)'),
        ('fa-comment', 'Single Comment'),
        ('fa-envelope', 'Envelope'),
        ('fa-bell', 'Bell'),
        ('fa-inbox', 'Inbox'),
        ('fa-message', 'Message'),
        ('fa-chat', 'Chat'),
    ], string='Button Icon', default='fa-comments', help='Icon to display on the button')

    _sql_constraints = [
        ('unique_config', 'unique(id)', 'Only one configuration record is allowed!'),
    ]

    @api.constrains('id')
    def _check_singleton(self):
        """Ensure only one record exists"""
        if self.search_count([]) > 1:
            raise ValidationError(_('Only one configuration record is allowed. Please edit the existing one.'))
    
    def _get_palette_colors(self):
        """Return color palettes inspired by PaletteDeCouleur.net"""
        return {
            'odoo_default': {
                'send_message_bg': '',
                'send_message_text': '',
                'log_note_bg': '',
                'log_note_text': '',
                'activities_bg': '',
                'activities_text': '',
            },
            'purple_elegance': {
                'send_message_bg': '#667eea',
                'send_message_text': '#ffffff',
                'log_note_bg': '#764ba2',
                'log_note_text': '#ffffff',
                'activities_bg': '#4a919e',
                'activities_text': '#ffffff',
            },
            'ocean_breeze': {
                'send_message_bg': '#17a2b8',
                'send_message_text': '#ffffff',
                'log_note_bg': '#4aa3a2',
                'log_note_text': '#ffffff',
                'activities_bg': '#5784ba',
                'activities_text': '#ffffff',
            },
            'sunset_vibes': {
                'send_message_bg': '#f27438',
                'send_message_text': '#ffffff',
                'log_note_bg': '#d46f4d',
                'log_note_text': '#ffffff',
                'activities_bg': '#ffbf66',
                'activities_text': '#212529',
            },
            'forest_calm': {
                'send_message_bg': '#7aa95c',
                'send_message_text': '#ffffff',
                'log_note_bg': '#5d7052',
                'log_note_text': '#ffffff',
                'activities_bg': '#226d68',
                'activities_text': '#ffffff',
            },
            'coral_dream': {
                'send_message_bg': '#ca3c66',
                'send_message_text': '#ffffff',
                'log_note_bg': '#db6a8f',
                'log_note_text': '#ffffff',
                'activities_bg': '#e8aabe',
                'activities_text': '#212529',
            },
            'vintage_rose': {
                'send_message_bg': '#ce6a6b',
                'send_message_text': '#ffffff',
                'log_note_bg': '#ebaca2',
                'log_note_text': '#212529',
                'activities_bg': '#bed3c3',
                'activities_text': '#212529',
            },
            'midnight_sky': {
                'send_message_bg': '#212e53',
                'send_message_text': '#ffffff',
                'log_note_bg': '#384454',
                'log_note_text': '#ffffff',
                'activities_bg': '#5784ba',
                'activities_text': '#ffffff',
            },
            'golden_hour': {
                'send_message_bg': '#e1a624',
                'send_message_text': '#212529',
                'log_note_bg': '#daab3a',
                'log_note_text': '#212529',
                'activities_bg': '#b67332',
                'activities_text': '#ffffff',
            },
            'arctic_frost': {
                'send_message_bg': '#9ac8eb',
                'send_message_text': '#212529',
                'log_note_bg': '#b6d8f2',
                'log_note_text': '#212529',
                'activities_bg': '#a7e0e0',
                'activities_text': '#212529',
            },
            'tropical_paradise': {
                'send_message_bg': '#2cced2',
                'send_message_text': '#ffffff',
                'log_note_bg': '#76cdcd',
                'log_note_text': '#212529',
                'activities_bg': '#08c5d1',
                'activities_text': '#ffffff',
            },
            'autumn_leaves': {
                'send_message_bg': '#c18845',
                'send_message_text': '#ffffff',
                'log_note_bg': '#f0be86',
                'log_note_text': '#212529',
                'activities_bg': '#93441a',
                'activities_text': '#ffffff',
            },
            'candy_pop': {
                'send_message_bg': '#f9968b',
                'send_message_text': '#ffffff',
                'log_note_bg': '#f4cfdf',
                'log_note_text': '#212529',
                'activities_bg': '#db6a8f',
                'activities_text': '#ffffff',
            },
            'earth_tones': {
                'send_message_bg': '#6a645a',
                'send_message_text': '#ffffff',
                'log_note_bg': '#e3cd8b',
                'log_note_text': '#212529',
                'activities_bg': '#ad956b',
                'activities_text': '#212529',
            },
            'neon_nights': {
                'send_message_bg': '#a7001e',
                'send_message_text': '#ffffff',
                'log_note_bg': '#ca3c66',
                'log_note_text': '#ffffff',
                'activities_bg': '#db6a8f',
                'activities_text': '#ffffff',
            },
            'pastel_spring': {
                'send_message_bg': '#f7f6cf',
                'send_message_text': '#212529',
                'log_note_bg': '#e2e9c0',
                'log_note_text': '#212529',
                'activities_bg': '#9ac8eb',
                'activities_text': '#212529',
            },
            'deep_ocean': {
                'send_message_bg': '#18534f',
                'send_message_text': '#ffffff',
                'log_note_bg': '#226d68',
                'log_note_text': '#ffffff',
                'activities_bg': '#4aa3a2',
                'activities_text': '#ffffff',
            },
            'cherry_blossom': {
                'send_message_bg': '#db6a8f',
                'send_message_text': '#ffffff',
                'log_note_bg': '#f4cfdf',
                'log_note_text': '#212529',
                'activities_bg': '#ebaca2',
                'activities_text': '#212529',
            },
            'desert_sand': {
                'send_message_bg': '#d6955b',
                'send_message_text': '#212529',
                'log_note_bg': '#feeaa1',
                'log_note_text': '#212529',
                'activities_bg': '#c18845',
                'activities_text': '#ffffff',
            },
            'lavender_fields': {
                'send_message_bg': '#764ba2',
                'send_message_text': '#ffffff',
                'log_note_bg': '#9ac8eb',
                'log_note_text': '#212529',
                'activities_bg': '#f4cfdf',
                'activities_text': '#212529',
            },
        }
    
    @api.onchange('color_palette')
    def _onchange_color_palette(self):
        """Apply selected color palette to button colors"""
        if self.color_palette and self.color_palette != 'custom':
            palettes = self._get_palette_colors()
            palette = palettes.get(self.color_palette, {})
            
            self.send_message_bg_color = palette.get('send_message_bg', '')
            self.send_message_text_color = palette.get('send_message_text', '')
            self.log_note_bg_color = palette.get('log_note_bg', '')
            self.log_note_text_color = palette.get('log_note_text', '')
            self.activities_bg_color = palette.get('activities_bg', '')
            self.activities_text_color = palette.get('activities_text', '')

    @api.model
    def create(self, vals):
        """Override create to ensure singleton"""
        # Check if a record already exists
        existing = self.search([], limit=1)
        if existing:
            # Update existing record instead of creating new one
            existing.write(vals)
            return existing
        # Force id to be 1
        vals['id'] = 1
        return super(ChatterDrawerConfig, self).create(vals)

    def write(self, vals):
        """Override write to trigger client refresh"""
        res = super(ChatterDrawerConfig, self).write(vals)
        # Clear the webclient cache to force session reload
        self.env['ir.http'].clear_caches()
        return res

    def unlink(self):
        """Prevent deletion of configuration"""
        raise ValidationError(_('Configuration cannot be deleted. You can only modify it.'))

    def action_reload_page(self):
        """Save and reload the page to apply changes"""
        # Clear cache to force session refresh
        self.env['ir.http'].clear_caches()
        
        # Return action to reload the current page
        return {
            'type': 'ir.actions.client',
            'tag': 'reload',
        }

    def action_reset_to_default(self):
        """Reset all configuration to default values"""
        self.ensure_one()
        
        # Default values from the module
        default_values = {
            # Colors & Design
            'button_color_primary': '#667eea',
            'button_color_secondary': '#764ba2',
            'button_icon_color': '#ffffff',
            'drawer_background_color': '#f8f9fa',
            'overlay_color': 'rgba(0, 0, 0, 0.5)',
            'close_button_color': '#6c757d',
            'close_button_hover_color': '#dc3545',
            'color_palette': 'odoo_default',
            'send_message_bg_color': '',
            'send_message_text_color': '',
            'log_note_bg_color': '',
            'log_note_text_color': '',
            'activities_bg_color': '',
            'activities_text_color': '',
            
            # Sizing
            'button_size': 60,
            'button_border_radius': 50,
            'drawer_width': 50,
            'drawer_width_mobile': 100,
            'button_shadow_size': 'medium',
            
            # Positioning
            'button_position': 'bottom-right',
            'button_horizontal_offset': 30,
            'button_vertical_offset': 30,
            'drawer_side': 'right',
            'z_index_button': 1040,
            'z_index_overlay': 1045,
            'z_index_drawer': 1050,
            
            # Effects & Animations
            'enable_animations': True,
            'enable_pulse_effect': True,
            'animation_duration': 0.3,
            'enable_overlay': True,
            
            # Advanced
            'exclude_models': 'res.users',
            'custom_css': '',
            'enable_dark_mode': True,
            'dark_mode_drawer_bg': '#2d3748',
            'dark_mode_close_btn_bg': '#2d3748',
            
            # Icon
            'button_icon': 'fa-comments',
        }
        
        # Update configuration
        self.write(default_values)
        
        # Clear cache and reload
        self.env['ir.http'].clear_caches()
        
        # Return success notification and reload
        return {
            'type': 'ir.actions.client',
            'tag': 'display_notification',
            'params': {
                'title': _('Reset Successful'),
                'message': _('Configuration has been reset to default values. Page will reload...'),
                'type': 'success',
                'sticky': False,
                'next': {
                    'type': 'ir.actions.client',
                    'tag': 'reload',
                },
            }
        }

    @api.model
    def get_config(self):
        """Return configuration as JSON for JavaScript consumption"""
        config = self.search([], limit=1)
        if not config:
            config = self.create({})
        
        # Parse excluded models
        excluded = [m.strip() for m in (config.exclude_models or '').split(',') if m.strip()]
        
        # Calculate shadow based on size
        shadow_map = {
            'none': '0 0 0 rgba(0,0,0,0)',
            'small': f'0 2px 10px {config.button_color_primary}40',
            'medium': f'0 4px 20px {config.button_color_primary}40',
            'large': f'0 6px 30px {config.button_color_primary}60',
        }
        
        return {
            # Colors
            'buttonColorPrimary': config.button_color_primary,
            'buttonColorSecondary': config.button_color_secondary,
            'buttonIconColor': config.button_icon_color,
            'drawerBackgroundColor': config.drawer_background_color,
            'overlayColor': config.overlay_color,
            'closeButtonColor': config.close_button_color,
            'closeButtonHoverColor': config.close_button_hover_color,
            'sendMessageBgColor': config.send_message_bg_color,
            'sendMessageTextColor': config.send_message_text_color,
            'logNoteBgColor': config.log_note_bg_color,
            'logNoteTextColor': config.log_note_text_color,
            'activitiesBgColor': config.activities_bg_color,
            'activitiesTextColor': config.activities_text_color,
            
            # Sizing
            'buttonSize': config.button_size,
            'buttonBorderRadius': config.button_border_radius,
            'drawerWidth': config.drawer_width,
            'drawerWidthMobile': config.drawer_width_mobile,
            'buttonShadow': shadow_map.get(config.button_shadow_size, shadow_map['medium']),
            
            # Positioning
            'buttonPosition': config.button_position,
            'buttonHorizontalOffset': config.button_horizontal_offset,
            'buttonVerticalOffset': config.button_vertical_offset,
            'drawerSide': config.drawer_side,
            'zIndexButton': config.z_index_button,
            'zIndexOverlay': config.z_index_overlay,
            'zIndexDrawer': config.z_index_drawer,
            
            # Effects
            'enableAnimations': config.enable_animations,
            'enablePulseEffect': config.enable_pulse_effect,
            'animationDuration': config.animation_duration,
            'enableOverlay': config.enable_overlay,
            
            # Advanced
            'excludeModels': excluded,
            'customCss': config.custom_css or '',
            'enableDarkMode': config.enable_dark_mode,
            'darkModeDrawerBg': config.dark_mode_drawer_bg,
            'darkModeCloseBtnBg': config.dark_mode_close_btn_bg,
            
            # Icon
            'buttonIcon': config.button_icon,
        }


class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'

    def session_info(self):
        """Add chatter drawer configuration to session info"""
        result = super(IrHttp, self).session_info()
        if self.env.user.has_group('base.group_user'):
            result['chatter_drawer_config'] = self.env['chatter.drawer.config'].get_config()
        return result

