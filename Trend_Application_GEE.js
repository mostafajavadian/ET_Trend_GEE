var chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY"),
var districts = ee.FeatureCollection("users/lethiquynhhoa/Uganda/District_UBOS_2011_44034_4326"),
var MOD16 = ee.ImageCollection("MODIS/006/MOD16A2"),
var Countr = ee.FeatureCollection("users/javadian/Country");




var label = ui.Label('Click a point on the map to get information on the left panel');
Map.add(label);
var label2=ui.Label('The map shows annual AET of your selected year')
Map.add(label2);


// Use a DateSlider to create annual composites of this collection.
var collection = ee.ImageCollection("MODIS/006/MOD16A2").select('ET');
var collection_PET = ee.ImageCollection("MODIS/006/MOD16A2").select('PET');
var collection_GPP=ee.ImageCollection("MODIS/006/MOD17A2H").select('Gpp');

// Use the start of the collection and now to bound the slider.
var start = ee.Image(collection.first()).date().get('year').format();
var now = Date.now();
var end = ee.Date(now).format();
// Run this function on a change of the dateSlider.
var showMosaic = function(range) {
  var mosaic = ee.ImageCollection(collection.filterDate(range.start(), range.end())
  );
  // Asynchronously compute the name of the composite.  Display it.
  range.start().get('year').evaluate(function(name) {
   var Vis={min: 0,max:300,palette: ['ffffff', 'fcd163', '99b718', '66a000', '3e8601', '207401', '056201',
    '004c00', '011301']}
    var layer = ui.Map.Layer(mosaic, Vis, name + ' Actual Evapotranspiration');
    Map.layers().set(0, layer);
  });
};
var Vis={min: 0,max:300,palette: ['ffffff', 'fcd163', '99b718', '66a000', '3e8601', '207401', '056201',
    '004c00', '011301']}

// Asynchronously compute the date range and show the slider.
var dateRange = ee.DateRange(start, end).evaluate(function(range) {
  var dateSlider = ui.DateSlider({
    start: range['dates'][0],
    end: range['dates'][1],
    value: null,
    period: 365,
    onChange: showMosaic,
    style: {
     // backgroundColor: 'FFFFFF80',
    position: 'bottom-right',
    width: '500px'
  },

  });
  Map.add(dateSlider.setValue(now));
});

///colorbar/////////
function makeLegend(Vis) {
  var lon = ee.Image.pixelLonLat().select('longitude');
  var gradient = lon.multiply((Vis.max-Vis.min)/100.0).add(Vis.min);
  var legendImage = gradient.visualize(Vis);
  
  // In case you really need it, get the color ramp as an image:
 // print(legendImage.getThumbURL({bbox:'0,0,100,8', dimensions:'256x20'}));
  
  // Otherwise, add it to a panel and add the panel to the map.
  var thumb = ui.Thumbnail({
    image: legendImage, 
    params: {bbox:'0,0,100,8', dimensions:'256x20'}, 
    style: {padding: '1px', position: 'bottom-center'}
  });
  var panel = ui.Panel({
    widgets: [
      ui.Label(String(Vis['min'])),
            ui.Label('Annual Actual ET in mm/year'), 

      ui.Label({style: {stretch: 'horizontal'}}), 
      ui.Label(Vis['max'])
    ],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {stretch: 'horizontal'}
  });
return ui.Panel().add(panel).add(thumb);
}

Map.add(makeLegend(Vis));





//Australia 8-day ET variation in year 2018
var rect = ee.Geometry.Rectangle({
  coords: [[110, -44], [155, -10]],
  geodesic: false
});
Map.addLayer(rect);
//Map.centerObject(rect, 3);
// Select MODIS vegetation composites from 2018.
var collection_2 = ee.ImageCollection("MODIS/006/MOD16A2").select('ET')
  .filterDate('2018-01-01', '2019-01-01')
  //.select('NDVI');

// Add the first image to the map, just as a preview.
//var im = ee.Image(collection.first());
//Map.addLayer(im, {}, "first image");

// Visualization parameters.
var args = {
  crs: 'EPSG:3857',  // Maps Mercator
  dimensions: '300',
  region: rect,
  min: 0,
  max: 100,
  palette: ['red','FA8072', 'gray','87CEEB', 'blue'],
  framesPerSecond: 12,
};

// Create a video thumbnail and add it to the map.
var thumb = ui.Thumbnail({
  // Specifying a collection for "image" animates the sequence of images.
  image: collection_2,
  params: args,
  style: {
    position: 'bottom-left',
    width: '320px'
  }});
Map.add(thumb);

//-------------------------------------------------------------------------------------

// Create a panel to hold our widgets.
//var panel = ui.Panel();
//panel.style().set('width', '300px');
// Create an intro panel with labels.
//var intro = ui.Panel([
//  ui.Label({
 //   value: 'Terrain Information',
 //   style: {fontSize: '20px', fontWeight: 'bold'}
 // }),
 // ui.Label('Click a point on the map to get information.')
//]);
//panel.add(intro);

// Filter collection to country of interest.
//var srtm = ee.Image('CGIAR/SRTM90_V4');
//var vis = {min: 0, max: 1200};
//var country_clipped = srtm;


// Create a panel to hold our widgets.
//var panel = ui.Panel();
//panel.style().set('width', '300px');

// Create an intro panel with labels.
//var intro = ui.Panel([
//  ui.Label({
//    value: 'Terrain Information',
//    style: {fontSize: '20px', fontWeight: 'bold'}
//  }),
 // ui.Label('Click a point on the map to get information.')
//]);
//panel.add(intro);

// Create panels to hold lon/lat values.
//var lon = ui.Label();
//var lat = ui.Label();
//panel.add(ui.Panel([lon, lat], ui.Panel.Layout.flow('horizontal')));
// panel.add(value)

// Register a callback on the default map to be invoked when the map is clicked.
//Map.onClick(function(coords) {
  // Update the lon/lat panel with values from the click event.
//  lon.setValue('lon: ' + coords.lon.toFixed(2)),
//  lat.setValue('lat: ' + coords.lat.toFixed(2));

  // Add a red dot for the point clicked on.
 // var point = ee.Geometry.Point(coords.lon, coords.lat);
 // var dot = ui.Map.Layer(point, {color: 'FF0000'});
 // Map.layers().set(1, dot);

//  var value = country_clipped.reduceRegion(ee.Reducer.first(), point, 30).get('elevation');
 //   var value2 = layer.reduceRegion(ee.Reducer.first(), point, 60).get('ET');

//  panel.widgets().set(2, ui.Label('Elevation: ' + value.getInfo()))

//});

//Map.style().set('cursor', 'crosshair');

// Add the panel to the ui.root.
//ui.root.insert(0, panel);
//-----------------------------------------------------------------
// filter the country
var countries = ee.FeatureCollection(Countr);
//var country_names = ['Uganda'];
var myCountry = countries
var aoi = myCountry.geometry();

//Filter
var precip = chirps.filterDate('2010-01-01', '2019-12-31')
    .sort('system:time_start', false)
    .filterBounds(Countr);
//---------------
// compute cumulative precipitation over time
var chirps_current = chirps.sort('system:time_start', false).first().clip(aoi)
var date_current = chirps_current.date().format('YYYY-MM-dd')

//Min Max precipitation current value
//var minMax = chirps_current.reduceRegion(ee.Reducer.percentile([0, 100])).values()
//var min = (ee.Number(minMax.get(0))).int()
//var max = (ee.Number(minMax.get(1))).int()
//var viz = {min: min.getInfo(), max: max.getInfo(), palette: ['#fff7bc', '#7fcdbb', '#2c7fb8']};

//var minMax = chirps_current.reduceRegion(ee.Reducer.percentile([0, 100])).values()
var min = 0
var max = 1000
var viz = {min: 0, max: 1000, palette: ['#fff7bc', '#7fcdbb', '#2c7fb8']};


// add map
//Map.addLayer(chirps_current, viz, 'CHIRPS CURRENT')
//Map.addLayer(aoi, {}, "AOI", false);

//Map.centerObject(aoi, 7);


//----------ANNUAL------------------------
//function for calculating the annual precipitation
var years = ee.List.sequence(2001, 2019);
var annualPrecip = ee.ImageCollection.fromImages(
    years.map(function (year) {
        var annual = precip
            .filter(ee.Filter.calendarRange(year, year, 'year'))
            .sum();
        return annual
            .set('year', year)
            .set('system:time_start', ee.Date.fromYMD(year, 1, 1));
    }));
  //Annual AET

 var annualAET =  ee.ImageCollection.fromImages(years.map(function (ynz)
{
  var img = collection.filter(ee.Filter.calendarRange(ynz, ynz, 'year'))
              .sum().multiply(0.1);
    
              return img.set('year', ynz)
              .set('month', 1)
              .set('date', ee.Date.fromYMD(ynz,1,1))
              .set('system:time_start',ee.Date.fromYMD(ynz,1,1));
  
}).flatten());

//Annual PET

 var annualPET =  ee.ImageCollection.fromImages(years.map(function (ynz)
{
  var img = collection_PET.filter(ee.Filter.calendarRange(ynz, ynz, 'year'))
              .sum().multiply(0.1);
    
              return img.set('year', ynz)
              .set('month', 1)
              .set('date', ee.Date.fromYMD(ynz,1,1))
              .set('system:time_start',ee.Date.fromYMD(ynz,1,1));
  
}).flatten());

//Annual GPP

 var annualGPP =  ee.ImageCollection.fromImages(years.map(function (ynz)
{
  var img = collection_GPP.filter(ee.Filter.calendarRange(ynz, ynz, 'year'))
              .sum().multiply(0.0001);
    
              return img.set('year', ynz)
              .set('month', 1)
              .set('date', ee.Date.fromYMD(ynz,1,1))
              .set('system:time_start',ee.Date.fromYMD(ynz,1,1));
  
}).flatten());


//calculating monthly precipitation for the region

var months = ee.List.sequence(1, 12);
var monthlyPrecip =  ee.ImageCollection.fromImages(
  years.map(function (y) {
    return months.map(function(m) {
    // var n=m+1;
     //print(m)
      var w = precip.filter(ee.Filter.calendarRange(y, y, 'year'))
                    .filter(ee.Filter.calendarRange(m, m, 'month'))
                    .sum();
      return w.set('year', y)
              .set('month', m)
              .set('system:time_start', ee.Date.fromYMD(y, m, 1));
                        
    });
  }).flatten()
);
var districtsLayer = ui.Map.Layer(districts.style({ width: 1, color: 'ffffff', fillColor: '00000055' }), {}, 'districts', true, 0)
//Map.layers().add(districtsLayer)

var selectionLayer = ui.Map.Layer(null, {color: 'ff0000'}, 'selection')
//Map.layers().add(selectionLayer)

function showChart(geometry, title) {
  var chart = ui.Chart.image.series(annualPrecip, geometry, ee.Reducer.mean(), 2500)
      .setOptions({
          title: "Precipitation by Year Over Time ",
          hAxis: {title: 'Time'},
          vAxis: {title: 'Precipitation (mm)'},
          colors: ['#EF851C'],
          trendlines: {
              0: {
                  type: 'linear',
                  visibleInLegend: true,
                  color: 'blue',
                  opacity: 1,
                  lineWidth: 2,
                  pointSize: 0
              }
          }
      })
      .setChartType('ColumnChart');
 
  var chart1 = chart
    var chart8 = ui.Label('Annual Precipitation:')

  //Monthly
  var MonthChart = ui.Chart.image.series(monthlyPrecip , geometry, ee.Reducer.mean(), 2500)
  .setOptions({
    title: "Precipitation by month Over Time ",
    hAxis: {title: 'Time'},
    vAxis: {title: 'Precipitation (mm)'},
    colors:['#31a354'],
    pointSize: 3,
    trendlines: { 
      0: { 
        type: 'linear', 
        visibleInLegend: true,
        color: 'blue',
        opacity: 1,
        lineWidth: 2,
        pointSize: 0
      } 
    }  
  })
  var chart2 = ui.Label('Monthly Precipitation:')
 
  var chart3 = MonthChart
    var chart4 = ui.Label('Annual Actual ET:')
  //AET Chart
  var AET_annual_chart = ui.Chart.image.series(annualAET, geometry, ee.Reducer.mean(), 2500)
      .setOptions({
          title: "AET by Year Over Time ",
          hAxis: {title: 'Time'},
          vAxis: {title: 'Actual Evapotranspiration (mm)'},
          colors: ['228B22'],
          trendlines: {
              0: {
                  type: 'linear',
                  visibleInLegend: true,
                  color: 'blue',
                  opacity: 1,
                  lineWidth: 2,
                  pointSize: 0
              }
          }
      })
      .setChartType('ColumnChart');
 
  var chart5 = AET_annual_chart
  
  var chart6 = ui.Label('Annual Potential ET:')

  
   //PET Chart
  var PET_annual_chart = ui.Chart.image.series(annualPET, geometry, ee.Reducer.mean(), 2500)
      .setOptions({
          title: "PET by Year Over Time ",
          hAxis: {title: 'Time'},
          vAxis: {title: 'Potential Evapotranspiration (mm)'},
          colors: ['FF0000'],
          trendlines: {
              0: {
                  type: 'linear',
                  visibleInLegend: true,
                  color: 'blue',
                  opacity: 1,
                  lineWidth: 2,
                  pointSize: 0
              }
          }
      })
      .setChartType('ColumnChart');
 
  var chart7 = PET_annual_chart
  
  var chart9 = ui.Label('Annual Gross Primary Productivity:')
 
   //GPP Chart
  var GPP_annual_chart = ui.Chart.image.series(annualGPP, geometry, ee.Reducer.mean(), 2500)
      .setOptions({
          title: "GPP by Year Over Time ",
          hAxis: {title: 'Time'},
          vAxis: {title: 'Annual Gross Primary Productivity (kg*C/m^2)'},
          colors: ['FF6347'],
          trendlines: {
              0: {
                  type: 'linear',
                  visibleInLegend: true,
                  color: 'blue',
                  opacity: 1,
                  lineWidth: 2,
                  pointSize: 0
              }
          }
      })
      .setChartType('ColumnChart');
    var chart10 = GPP_annual_chart



 
  var widgets = chartPanel.widgets()
  widgets.reset([])
 
  widgets.add(chart4)
  widgets.add(chart5)
  widgets.add(chart6)
  widgets.add(chart7)
  widgets.add(chart8)
  widgets.add(chart1)
  widgets.add(chart2)
  widgets.add(chart3)
  widgets.add(chart9)
  widgets.add(chart10)





}

function onSelectionModeChanged(mode) {
  districtsLayer.setOpacity(mode === 'Buffer' ? 0 : 1)
  
  chartPanel.widgets().reset([])
  selectionLayer.setEeObject(ee.Image())
}

function onMapClicked(coords) {
  var point = ee.Geometry.Point(coords.lon, coords.lat)
  var mode = selectionMode.getValue()
  var selection = mode === 'Buffer' ? point.buffer(6000) : districts.filterBounds(point)

  selectionLayer.setEeObject(selection)
  
  showChart(selection, 'Time series over ' + mode)
}

// UI

Map.style().set('cursor', 'crosshair');
Map.onClick(onMapClicked)

// main panel
var panel = ui.Panel();
panel.style().set('width', '300px')
ui.root.insert(0, panel);

var selectionMode = ui.Select({
    items: ['Buffer', 'District'],
    value: 'Buffer',
    placeholder: 'Select an option',
    onChange: onSelectionModeChanged
})
panel.widgets().add(selectionMode)

var title = ui.Panel([
    ui.Label({
        value: 'Javadian et al. (2020) Global Trends in Evapotranspiration Dominated by Increases across Large Cropland Regions (https://doi.org/10.3390/rs12071221) ',
        style: {fontSize: '10px', fontWeight: 'bold'}
    })
]);
panel.add(title)

var chartPanel = new ui.Panel()
panel.add(chartPanel)


