//--------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------- GAUGE SYMBOL -------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------

(function (CS) {
    'use strict';
    // Specify the symbol definition	
    var myCustomSymbolDefinition = {
        // Assign a name to the new symbol
        typeName: 'GaugePI',
        // Assign a name for the symbol, which will be displayed in PI Vision
        displayName: 'GaugePI',
        // Specify the number of data sources for this symbol
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
        // Specify the location of an image file to use as the icon for this symbol
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/gauge.png',
        visObjectType: symbolVis,
        // Default configuration
        getDefaultConfig: function () {
            return {
				//custom configuration options
                DataShape: 'Gauge',
                Height: 400,
                Width: 400,
                decimalPlaces: 1,
                showTitle: false,
                showValue: true,
                gaugeMinimum: 0,
                endValue: 330,
				gaugeMaximum1: 330,
                gaugeInterval: 30,
                gaugeZone1Color: "#0080ff",
                gaugeZone2Color: "#40ff00",
				gaugeZone3Color: "#ffff00",
				gaugeZone4Color: "#ff0000",
				textColor: "#E7E7E7",
				textColorValue: "#E7E7E7",
				textColorArrows: "#2e71c8",
                gaugeAngle: 330,
                customTitle: "",
				gaugeMaximum2: 60,
				gaugeMaximum3: 120,
            };
        },
		
        // Symbol configuration options
        configOptions: function () {
            return [{
                title: 'Guage configuration',
                mode: 'format'
            }];
        }
    };


    // Create and initialize the symbol
	
    function symbolVis() {}
    CS.deriveVisualizationFromBase(symbolVis);
    symbolVis.prototype.init = function (scope, elem) {
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        var symbolContainerDiv = elem.find('#container')[0];       
        var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);        
        symbolContainerDiv.id = newUniqueIDString;     
        var myChart;     
        function myCustomDataUpdateFunction(data) {          
            if (data) {   
				//Data recovery
                scope.value = data.Value.replace(",", ".");
                scope.units = data.Units;
                scope.time = data.Time; 
				scope.Label = data.Label;
				
                if (!myChart) {
                    myChart = AmCharts.makeChart(newUniqueIDString, {
                    
                        "type": "gauge",
                        "theme": "light",
                        "titles": createArrayOfChartTitles(),
                        "enabled": scope.config.showTitle,
						"color": scope.config.textColor,   
						
                        //AXES
                        "axes": [{
                            "color": scope.config.textColorValue,                       
                            "topTextFontSize": 15,
                            "topTextYOffset": 100,
                            "axisColor": "#31a8ea",
                            "axisThickness": 1,
                            "axisAlpha": 0.5,
                            "tickAlpha": 0.5,
                            "gridInside": true,
                            "inside": true,
                            "radius": "70%",
                            "valueInterval": scope.config.gaugeInterval,
                            "endValue": scope.config.endValue,
                            "tickColor": "#2e71c8",
                            "startAngle": (-1 * scope.config.gaugeAngle / 2),
                            "endAngle": (1 * scope.config.gaugeAngle / 2),
                            "unit": "%",


                            "bands": [{
                                //Size and color of the band's background
                                "innerRadius": "105%",
                                "startValue": scope.config.gaugeMinimum,
                                "endValue": scope.config.gaugeMaximum1,
                                "radius": "150%",
                                "gradientRatio": [0.5, 0, -0.5],
                                "color": scope.config.gaugeZone1Color
                                }, 
								
							//We initialize all the levels in 0 and finish them in 0	
								{
                                //Size and color of level 1
                                "color": scope.config.gaugeZone2Color,
                                "startValue": scope.config.gaugeMinimum,
                                "endValue": 0,
                                "innerRadius": "105%",
                                "radius": "150%",
                                "gradientRatio": [0.5, 0, -0.5]
                                }, 
								
								{
                                //Size and color of level 2
                                "color": scope.config.gaugeZone3Color,
                                "startValue": scope.config.gaugeMinimum,
                                "endValue": 0,
                                "innerRadius": "105%",
                                "radius": "150%",
                                "gradientRatio": [0.5, 0, -0.5]
                                },
								
								{
                                //Size and color of level 3
                                "color": scope.config.gaugeZone4Color,
                                "startValue": scope.config.gaugeMinimum,
                                "endValue": 0,
                                "innerRadius": "105%",
                                "radius": "150%",
                                "gradientRatio": [0.5, 0, -0.5]
                                }
								
								],

                        }],

                        "arrows": [{
							//Pointer settings
                            "alpha": 1,
                            "innerRadius": "35%",
                            "nailRadius": 1,
                            "radius": "150%",
                            "value": scope.value,
                            "color": scope.config.textColorArrows,
							"nailAlpha": 1,
							"nailBorderAlpha": 0.79,
							"nailBorderThickness": 20,
						}]

                    });
                    // If the custom visualization already exists, then simply tell it to update with the new data	
                } else {
                    // Update the arrow value           
                    myChart.arrows[0].setValue(scope.value);
					
                }
				
				
                // Show or hide the title
                if (scope.config.showTitle == false) {
                    myChart.titles = ("");
                } else {
                    myChart.titles = createArrayOfChartTitles();
                }

                if (scope.config.showValue == false) {
                    myChart.axes[0].setTopText("");
                } else {
                    myChart.axes[0].setTopText(scope.value + " %");
                }

			//Band Assignment (Color) according to the specified level
				
				//Creation of two intervals, to assign the corresponding band					
				var interv1 = scope.config.gaugeMaximum2;
				var interv2 = scope.config.gaugeMaximum3;				
				
				//If the received value is less than Interval 1, the first band is shown, 
				// and the others are hidden (We assign an initial and final value of 0)
				if (scope.value < interv1) {
					myChart.axes[0].bands[2].setStartValue(0);
					myChart.axes[0].bands[2].setEndValue(0);
					myChart.axes[0].bands[3].setStartValue(0);
					myChart.axes[0].bands[3].setEndValue(0);
                    myChart.axes[0].bands[1].setEndValue(scope.value);					
                } 
				//If the received value is between the interval 1 and 2, the second band is shown, 
				// and the others are hidden (We assign an initial and final value of 0)
				else 					
				if (scope.value < interv2) {
					myChart.axes[0].bands[1].setStartValue(0);
					myChart.axes[0].bands[1].setEndValue(0);
					myChart.axes[0].bands[3].setStartValue(0);
					myChart.axes[0].bands[3].setEndValue(0);
                    myChart.axes[0].bands[2].setEndValue(scope.value);					
                }
				//If the received value is greater than interval 2, the third band is shown, 
				// and the others are hidden (We assign an initial and final value of 0)
				else {
					myChart.axes[0].bands[1].setStartValue(0);
					myChart.axes[0].bands[1].setEndValue(0);
					myChart.axes[0].bands[2].setStartValue(0);
					myChart.axes[0].bands[2].setEndValue(0);
                    myChart.axes[0].bands[3].setEndValue(scope.value);					
                }
				
                myChart.validateData();
            }
        }

        function createArrayOfChartTitles() {
            // Build the titles array
            var titlesArray;
			
			//We assign a personalized title
            if (scope.config.useCustomTitle) {
                titlesArray = [
                    {
                        "text": scope.config.customTitle,
                        "size": (scope.config.fontSize + 3)
        			}
        		];
            } else {
				
				//Default title (Element name)
				if(scope.Label){
                titlesArray = [
                    {						
							"text": scope.Label,
							"bold": true,
							"size": (scope.config.fontSize + 3)
        			}
        		];
				}
				//Default title
				else{
					titlesArray = [
                    {	
							"text": "Gauge PI",
							"bold": true,
							"size": (scope.config.fontSize + 3)
					}
				];	
				}
            }
            return titlesArray;
        }


        //Custom configuration

        function myCustomConfigurationChangeFunction() {
            // If the chart exists...
            if (myChart) {
				
				//Show and hide Title
                if (scope.config.showTitle) {
                    myChart.titles = createArrayOfChartTitles();
                } else {
                    myChart.titles = null;
                }
				
                if (scope.config.showValue == false) {
                    myChart.axes[0].setTopText("");
                } else {
                    myChart.axes[0].setTopText(scope.value + " %");
                }  

				//Color Configuration				
                myChart.axes[0].bands[0].color = scope.config.gaugeZone1Color;
                myChart.axes[0].bands[1].color = scope.config.gaugeZone2Color;
				myChart.axes[0].bands[2].color = scope.config.gaugeZone3Color;
                myChart.axes[0].bands[3].color = scope.config.gaugeZone4Color;		
				myChart.color = scope.config.textColor;
				myChart.axes[0].color = scope.config.textColorValue;
				myChart.arrows[0].color = scope.config.textColorArrows;                
				myChart.arrows.color = scope.config.gaugeZone2Color;
				
				// Update the chart Maximum Value, angle 		 
				scope.config.gaugeMaximum1 = scope.config.gaugeAngle;
				scope.config.endValue = scope.config.gaugeAngle;
				myChart.axes[0].bands[0].endValue = scope.config.gaugeMaximum1;  
				myChart.axes[0].bands[1].setEndValue(scope.value);
				myChart.axes[0].endValue = scope.config.endValue;

               // Update the chart interval if it's above 0.1
				if ( scope.config.gaugeInterval >= 0.1 ) {
					myChart.axes [ 0 ].valueInterval = scope.config.gaugeInterval;
				}
					
                if ( scope.config.gaugeAngle >= 1 ) {
					myChart.axes [ 0 ].startAngle = (-1 * scope.config.gaugeAngle / 2);
					myChart.axes [ 0 ].endAngle = (1 * scope.config.gaugeAngle / 2);
				}             
                myChart.validateNow();
            }
        }

       
    }

    CS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);

//--------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------- RICARDO ZEVALLOS -----------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
