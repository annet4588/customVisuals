/*
*  Power BI Visual CLI
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

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import * as d3 from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any,any>;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    //private target: HTMLElement;
    //private updateCount: number;
    //private textNode: Text;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private svg: Selection<SVGElement>;
    // Add rectangles and text to KPI Visuals
    private kpiBox: Selection<SVGElement>;
    private labelBox: Selection<SVGElement>;
    private kpiText: Selection<SVGElement>;
    private labelText: Selection<SVGElement>;


    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();      
        this.svg = d3.select(options.element).append('svg').classed('kpiBox', true);
        this.kpiBox = this.svg.append('rect');
        this.labelBox = this.svg.append('rect');
        this.kpiText = this.svg.append('text');
        this.labelText = this.svg.append('text');
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);

        console.log("VisualFormattingSettingsModel:", this.formattingSettings);
        console.log("formatting settings", this.formattingSettings)
        console.log('Visual update', options);
       
        /*Add width and height to the viewport*/
        let viewport = options.viewport;
        let dataView = options.dataViews[0];

        this.svg.attr('width', viewport.width).attr('height', viewport.height);
        // Make the KPIBox to be full width, with a hardcoded color - which can be changed
        this.kpiBox.attr('width', viewport.width).attr('height', viewport.height).attr('fill', 'aliceblue');
        // Make labelBox to be full width but hardcode the height to 20
        this.labelBox.attr('width', viewport.width).attr('height', 20).attr('fill', 'pink');
        this.labelText.attr('text-anchor', 'start')
                        .attr('dominant-baseline', 'middle')
                        .attr('y', 10)
                        .attr('class', 'kpiLabel')
                        .text(dataView.metadata.columns[0].displayName);
        this.kpiText.attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .attr('y', viewport.height/2)
                        .attr('x', viewport.width/2)
                        .attr('class', 'kpiNumber')
                        .text(dataView.single.value.toString());
        }
    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}