# KPI Box - Power BI Custom Visual

**KPI Box** is a Power BI custom visual that displays a single KPI value with customisable design and layout. It provides flexibility for presenting performance metrics using adjustable formatting options like label position, color, and alignment.

---

## Features

- Background fill and opacity settings  
- Label alignment: `left`, `center`, `right`  
- Label position: `top` or `bottom`  
- Adjustable font sizes and colors  
- Responsive font resizing based on viewport size  
- Clean, minimal display

---

## Getting Started

### Requirements

- Node.js v10 or later  
- PowerShell 4+ (Windows) or Terminal (macOS/Linux)  
- Power BI Pro License (for publishing)  
- Power BI Service (at [app.powerbi.com](https://app.powerbi.com))  
- Visual Studio Code (recommended text editor)  

### Global Dependencies

Install these packages globally:

```bash
npm install -g powerbi-visuals-tools
npm install -g d3
npm install -g @types/d3
npm install -g core-js
npm install -g powerbi-visuals-api

Test:

```bash
pbiviz


### Create a Custom Visual
mkdir customVisuals
cd customVisuals
pbiviz new kpiBox
cd kpiBox

### Enabling Power BI Developer Mode
To develop and preview visuals in Power BI Service, follow these steps:

- ** Log in to Power BI Service **

- ** Go to Settings > Developer **

- ** Enable Developer Mode **

- ** Create a report, and the Developer Visual should appear in the Visualizations pane **

- ** If not visible, try Ctrl + F5 or log out and in again **


## Formatting Options

### Under the Format pane:

- ** Fill Colour: Background color **

- ** Opacity: Background transparency **

- ** Label Alignment: Left, center, or right **

- ** Label Position: Top or bottom of the box **

- ** Label Font Colour: Text color for the label **

- ** Label Font Size: Font size for the label **

- ** Font Colour: Color of the KPI value **







