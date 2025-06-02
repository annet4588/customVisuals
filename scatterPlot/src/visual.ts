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
// import { scaleLinear, scaleBand } from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any,any>;
import { textMeasurementService, interfaces } from "powerbi-visuals-utils-formattingutils";
import TextProperties = interfaces.TextProperties;
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    //private target: HTMLElement;
    //private updateCount: number;
    //private textNode: Text;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private svg: Selection<SVGElement>;
    private xAxisGroup: Selection<SVGElement>;
    private yAxisGroup: Selection<SVGElement>;
    private dotsGroup: Selection<SVGElement>;
    private parentGroup: Selection<SVGElement>;


    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();      
        this.svg = d3.select(options.element).append('svg').classed('kpiBox', true);
        this.parentGroup = this.svg.append('g').attr('class', 'parent');
        this.xAxisGroup = this.parentGroup.append('g').attr('class', 'x axis');
        this.yAxisGroup = this.parentGroup.append('g').attr('class', 'y axis');
        this.dotsGroup = this.parentGroup.append('g').attr('class', 'dots');
 
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);

        console.log('Visual update', options);
        console.log('Formatting Settings', this.formattingSettings);
        
       
        /*Add width and height to the viewport*/
        let viewport = options.viewport;
        let dataView = options.dataViews[0];
        // Holding the value data
        let dataPoints = dataView.categorical.values;
        let dotData = [];
        // To generate the scales for the axis
        let xMax =0, yMax = 0;
        // To query that sum value has been set
        let xIndex = -1, yIndex = -1;
        // Holding the category data
        let categories = dataView.categorical.categories[0].values;
  
        // Dynamically detects which data field is assigned the "x" role in the data view
        if(dataPoints[0].source.roles.x){
           xIndex = 0;
           yIndex = 1;
        }else{
            xIndex = 1;
            yIndex = 0;
        }
        // Loop through all of our categories, for each
        // it will push in the group
        categories.forEach((d,i)=>{
            dotData.push({
                'group': d,
                'y':dataPoints[yIndex].values[i],
                'x':dataPoints[xIndex].values[i],
             })
        })
        xMax = Number(dataPoints[xIndex].maxLocal);
        yMax = Number(dataPoints[yIndex].maxLocal);
        console.log(dotData, xMax, yMax);

        }
        
    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
    
}