# -*- coding: utf-8 -*-
{
    'name': 'Flexible Chatter Drawer',
    'version': '18.0.1.0.0',
    'category': 'Productivity',
    'summary': 'Customizable floating chatter drawer with flexible design options',
    'description': """
Flexible Chatter Drawer
=======================

Transform your Odoo chatter into a beautiful, customizable floating drawer!

Key Features
------------
* **Floating Button**: Elegant floating button to access chatter from anywhere
* **Slide-in Drawer**: Smooth slide-in drawer animation
* **Fully Customizable**:
    - Button colors and gradients
    - Drawer background and size
    - Button position (bottom-right, bottom-left, top-right, top-left)
    - Drawer side (right or left)
    - Button size and border radius
    - Custom animations and effects
    - Shadow and overlay customization
* **Universal**: Works on ALL form views automatically
* **Responsive**: Mobile-friendly design
* **Accessibility**: Supports high contrast and reduced motion
* **Dark Mode**: Automatic dark mode support
* **No Code Required**: Just install and configure through settings

Perfect For
-----------
* Clean, uncluttered form views
* Better space utilization
* Modern, professional interface
* Improved user experience

Configuration
-------------
Go to Settings > Technical > Chatter Drawer Configuration to customize:
- Colors and gradients
- Button position and size
- Drawer width and side
- Animations and effects
- And much more!

    """,
    'author': 'New Art',
    'website': 'https://www.yourcompany.com',
    'license': 'LGPL-3',
    'depends': [
        'base',
        'mail',
        'web',
    ],
    'data': [
        'security/ir.model.access.csv',
        'data/default_config_data.xml',
        'views/chatter_config_views.xml',
        'views/menu_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'flexible_chatter_drawer/static/src/js/drawer_chatter.js',
            'flexible_chatter_drawer/static/src/xml/drawer_chatter.xml',
            'flexible_chatter_drawer/static/src/css/drawer_chatter.css',
        ],
    },
    'images': [
        'static/description/banner.png',
        'static/description/icon.png',
        'static/description/screen1.png',
        'static/description/screen2.png',
        'static/description/screen3.png',
    ],
    'installable': True,
    'auto_install': False,
    'application': False,
    'price': 0.00,
    'currency': 'EUR',
}

