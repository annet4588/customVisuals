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
import "../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import * as d3 from "d3";
import { scaleLinear, scaleBand } from "d3";
import { axisBottom, axisLeft } from "d3-axis";

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
    private xAxisGroup: Selection<SVGGElement>;
    private yAxisGroup: Selection<SVGGElement>;
    private dotsGroup: Selection<SVGGElement>;
    private parentGroup: Selection<SVGGElement>;
    // Declare a margin object
    static margins = { top: 30, right: 30, bottom: 30, left: 30};


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
        let settings = this.formattingSettings.dataPointCard;

        // To generate the scales for the axis
        let xMax =0, yMax = 0;
        // To query that sum value has been set
        let xIndex = -1, yIndex = -1;

        //Resize viewport
        this.svg.attr('height', viewport.height).attr('width', viewport.width);
        
        // Chart height
        let chartHeight = viewport.height - Visual.margins.top - Visual.margins.bottom;
        // Chart width
        let chartWidth = viewport.width - Visual.margins.left - Visual.margins.right;

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

        // Define our scales
        let xScale = scaleLinear().domain([0, xMax]).range([0, chartWidth]);
        let yScale = scaleLinear().domain([0, yMax]).range([chartHeight, 0]); // Inverse y value
        
        // Make all elements to be shifted by left and top margins
        this.parentGroup.attr('transform', 'translate('+Visual.margins.left+', '+Visual.margins.top+')');
        
        //Moves the x-axis to the bottom of the chart area, axisBottom(xScale) creates axis ticks and labels using the x scale
        this.xAxisGroup.attr('transform', 'translate(0, '+chartHeight+')').call(axisBottom(xScale));
        //Places the y-axis at the left of the chart, axisLeft(yScale) creates the vertical axis with labels
        this.yAxisGroup.attr('transform', 'translate(0, 0)').call(axisLeft(yScale));

        // Selects all cirlse elements inside dotsGroup
        // Binds dotData array to the selection
        // d.group key ensures correct tracking of which data point corresponds to which circle,so D3 knows which circles to update or remove
        const dots = this.dotsGroup
            .selectAll('circle')
            .data(dotData, (d: any) => d.group); // use group as key if unique

        // Handling enter - new elements, update- existing elems, and exit - remove elms
        dots.join(
            enter => enter.append('circle')
                        .attr('class', 'dot') // for CSS styling
                        .attr('id', (d: any) => d.group) // optional: uniquely identifies the dot
                        .attr('cx', (d: any) => xScale(d.x)) // scaled x-position
                        .attr('cy', (d: any) => yScale(d.y)) // scaled y-position
                        .attr('r', settings.radius.value) // current radius from formatting pane
                        .attr('fill', settings.fill.value.value), // current colour from formatting pane
            update => update 
                        .attr('cx', (d: any) => xScale(d.x)) // recalculate x position
                        .attr('cy', (d: any) => yScale(d.y)) // recalculate y position
                        .attr('r', settings.radius.value) // update radius
                        .attr('fill', settings.fill.value.value), // update color
            exit => exit.remove()
        );

        // Binds dotData (array of data points) to circle elements
        // this.dotsGroup
        //     .selectAll('circle')
        //     .data(dotData)
        //     .enter() // Creates a placeholder for each data point
        //     .append('circle') // Adds a circle element for each data item
        //     .attr('r', settings.radius.value) // Sets the radius of each circle(dot) to 5px
        //     .attr('cx', (d)=>xScale(d.x)) //Sets the x-coordinate of each circle based on the x-value of the data point, scaled to pixel space
        //     .attr('cy', (d)=>yScale(d.y)) // Sets the y-coordinates
        //     .attr('class', 'dot')
        //     .attr('id', (d)=>d.group) //Sets the HTML id attribute of each circle to the category/group name
        //     .attr('fill', settings.fill.value.value);
        // console.log(xScale(20000));
        // console.log(yScale(100));
        }
        
    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
    
}