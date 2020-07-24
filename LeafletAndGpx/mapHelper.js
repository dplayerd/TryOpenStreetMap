var mapHelper = {
    _container: {
        keepedControls: [],
        keepedMap: null
    },

    // divID
    // [22.647638, 120.252056]
    drawMap: function (txtMapid, arrLgt, intZoomLevel, intMaxZoomLevel) {
        var self = this;

        // 經緯, 縮放等級
        var mymap = L.map(txtMapid).setView(arrLgt, intZoomLevel);
        self._container.keepedMap = mymap;

        // open topo provider
        var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: intMaxZoomLevel,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }).addTo(mymap);
    },

    // 依序為
    //    緯度、經度
    // 打點
    buildMarker: function (arrLgt, txtPopupHtml, boolWillShowAtStart) {
        var self = this;

        var marker1 = L.marker(arrLgt).addTo(self._container.keepedMap);
        self._container.keepedControls.push(marker1);

        if (txtPopupHtml.length > 0) {
            marker1.bindPopup(txtPopupHtml)

            if (boolWillShowAtStart)
                marker1.openPopup();
        }

        return marker1;
    },

    // 依序為
    //    緯度、經度
    // 客製圖
    buildCustomMarker: function (arrLgt, txtPopupHtml, boolWillShowAtStart, txtImgUrl) {
        var self = this;

        var LeafIcon = L.Icon.extend({
            options: {
                shadowUrl: 'leaf-shadow.png',
                iconSize: [67, 66],
                shadowSize: [50, 64],
                iconAnchor: [22, 94],
                shadowAnchor: [4, 62],
                popupAnchor: [-3, -76]
            }
        });

        // ICON
        var greenIcon = new LeafIcon({ iconUrl: 'images/mask.png' });

        L.icon = function (options) {
            return new L.Icon(options);
        };

        var customIcon1 = L.marker(arrLgt, { icon: greenIcon }).addTo(self._container.keepedMap);
        self._container.keepedControls.push(customIcon1);

        if (txtPopupHtml.length > 0) {
            customIcon1.bindPopup(txtPopupHtml)

            if (boolWillShowAtStart)
                customIcon1.openPopup();
        }

        return customIcon1;
    },

    // 畫線及海拔圖
    // 依序為
    //    經度、緯度、海拔    
    // [[120.357971, 22.636828, 296], [120.359131, 22.6345, 295], [120.362651, 22.629881, 299]]
    buildAltitude: function (arrLgtArr) {
        var self = this;

        //----- 畫線 -----
        var geojson =
        {
            "name": "NewFeatureType",
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": arrLgtArr
                    }, "properties": null
                }
            ]
        };

        var elevationOption = {
            position: "bottomleft",
            theme: "steelblue-theme", //default: lime-theme
            width: 480,
            height: 100,
            margins: {
                top: 10,
                right: 20,
                bottom: 30,
                left: 50
            },
            useHeightIndicator: true, //if false a marker is drawn at map position
            interpolation: d3.curveLinear, //see https://github.com/d3/d3-shape/blob/master/README.md#area_curve
            hoverNumber: {
                decimalsX: 3, //decimals on distance (always in km)
                decimalsY: 0, //deciamls on hehttps://www.npmjs.com/package/leaflet.coordinatesight (always in m)
                formatter: undefined //custom formatter function may be injected
            },
            xTicks: undefined, //number of ticks in x axis, calculated by default according to width
            yTicks: undefined, //number of ticks on y axis, calculated by default according to height
            collapsed: false,  //collapsed mode, show chart on click or mouseover
            imperial: false    //display imperial units instead of metric
        };

        var el = L.control.elevation(elevationOption);
        el.addTo(self._container.keepedMap);
        self._container.keepedControls.push(el);

        var gjl = L.geoJson(geojson, {
            onEachFeature: el.addData.bind(el)
        }).addTo(self._container.keepedMap);
        self._container.keepedControls.push(gjl);
        //----- 畫線 -----

        return gjl;
    },

    // 移除所有元素
    clearControls: function () {
        var self = this;

        for (var i = 0; i < self._container.keepedControls.length; i++) {
            var item = self._container.keepedControls[i];

            self._container.keepedMap.removeControl(item);
        }

        self._container.keepedControls = [];
    }
};