# Artisan Clay Market - Project Documentation

## Button Color Systems

The project uses two distinct button color systems for different purposes:

### 1. Brand Color Buttons

These buttons use the primary store brand colors and are used for main navigation and site-wide actions.

**Examples:**
- "Explore Collection" button on homepage
- "Meet the Artisans" button on homepage

**Visual Styling:**
- Colors: Brand-specific colors (ceramic accent/secondary)
- Usage: Main CTA buttons, navigation actions
- Location: Hero sections, headers, navigation elements

### 2. Product Action Buttons

These buttons use green coloring and are specifically for product-related actions.

**Examples:**
- "View" buttons on product cards
- Product detail page actions

**Visual Styling:**
- Color: #7fbe42 (bright green)
- Usage: Any action related to viewing or interacting with product items
- Location: Product cards, product pages

## Color Palette

The site uses an earthy color palette that complements the ceramic products:

- Primary: #ca3724
- Secondary: #e05c25
- Info: #ca8c56
- Light: #e2e4dc
- Dark: #29483c
- Accent1: #49645b (used for "View Profile" buttons)
- Accent2: #7597a7
- Accent3: #9eb4ac
- Success: #64af19
- Product View: #7fbe42
- Warning: #fec377
- Danger: #f60c68
- Item Border: #a1a29c (used for product card borders)

## Design Notes

- Header uses a subtle bottom border (#e3e4dc) to maintain a clean, minimal design
- The Japanese tea ceremony hero image uses a subtle drop shadow to create depth
- Product cards have a white background to highlight the product images
- "View Profile" links use color #496456 to maintain visual consistency with the earthy palette

## File Structure

The color system is primarily defined in:
- `/src/index.css` - Contains CSS variables for colors
- `/src/custom-styles.css` - Contains overrides and specific component styling
- `/tailwind.config.ts` - Contains Tailwind theme configuration
