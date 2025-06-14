/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Data Point Formatting Card
 */
class DataPointCardSettings extends FormattingSettingsCard {
    // defaultColor = new formattingSettings.ColorPicker({
    //     name: "defaultColor",
    //     displayName: "Default color",
    //     value: { value: "" }
    // });

    // showAllDataPoints = new formattingSettings.ToggleSwitch({
    //     name: "showAllDataPoints",
    //     displayName: "Show all",
    //     value: true
    // });

    fill = new formattingSettings.ColorPicker({
        name: "fill",
        displayName: "Fill Colour",
        value: { value: "#ADD8E6" }
    });

    opacity = new formattingSettings.NumUpDown({
        name: "opacity",
        displayName: "Choose Opacity",
        value: 0.3 //Default
    });

    // fillRule = new formattingSettings.ColorPicker({
    //     name: "fillRule",
    //     displayName: "Color saturation",
    //     value: { value: "" }
    // });
    labelAlignment = new formattingSettings.AlignmentGroup({
       name: "labelAlignment",
       displayName: "Label Alignment",
       value: "middle",
       mode: powerbi.visuals.AlignmentGroupMode.Horizonal
    });

    labelPosition = new formattingSettings.ItemDropdown({
       name: "labelPosition",
       displayName: "Label Position",
       items: [
        { value: "top", displayName: "Top"},
        { value: "bottom", displayName: "Bottom"}
       ],
        value:{ value: "top", displayName: "Top"}, //Default position
    });

    fontColorLabel = new formattingSettings.ColorPicker({
       name: "fontColorLabel",
       displayName: "Choose Label Font Colour",
       value: {value: "black"} //Default black
    });

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Label Font Size",
        value: 20
    });

    fontColor = new formattingSettings.ColorPicker({
       name: "fontColor",
       displayName: "Choose Font Colour",
       value: {value: "black"} //Default black
    });

    name: string = "dataPoint";
    displayName: string = "KPI Settings";
    slices: Array<FormattingSettingsSlice> = [this.fill, this.labelPosition, this.labelAlignment, this.fontColorLabel, this.fontSize, this.opacity, this.fontColor];
    // slices: Array<FormattingSettingsSlice> = [this.defaultColor, this.showAllDataPoints, this.fill, this.fillRule, this.fontSize];
}


/**
* visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    dataPointCard = new DataPointCardSettings();

    cards = [this.dataPointCard];
}
