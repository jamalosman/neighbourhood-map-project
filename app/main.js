/*global ko,google,$,document,console*/

// ##### GoogleMap Binding Handler #####

// From schmidlop's answer on StackOverflow
// http://stackoverflow.com/a/16305965
ko.bindingHandlers.map = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var mapObj = ko.utils.unwrapObservable(valueAccessor());
        var latLng = new google.maps.LatLng(
            ko.utils.unwrapObservable(mapObj.lat),
            ko.utils.unwrapObservable(mapObj.lng));

        var mapOptions = {
            center: latLng,
            zoom: 15,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP // SATELLITE
        };

        mapObj.googleMap = new google.maps.Map(element, mapOptions);
    }
};

// ##### View Model #####

var MapViewModel = function () {
    var self = this;

    // Maps
    self.mapCanvas = ko.observable({
        lat: ko.observable(area.coords.lat),
        lng: ko.observable(area.coords.lng)
    });

    self.markers = ko.observableArray();

    self.syncMarkersWithResults = function (e) {
        self.clearMarkers();
        var map = self.mapCanvas().googleMap;
        self.markers(area.getMarkers(map, listViewModel.searchResults()));
    };

    self.clearMarkers = function () {
        self.markers().forEach(function (marker, i) {
            marker.setMap(null);
        });
        self.markers.removeAll();
    };

    // open info window on a place
    self.showPlaceInfo = function (place) {
        var infoWindow = new google.maps.InfoWindow({
            content: place.getHtml(),
        });

        console.log(infoWindow);
        infoWindow.open(self.map, place.marker);
    };
};



var ListViewModel = function () {
    var self = this;

    self.searchQuery = ko.observable("");
    self.searchResults = ko.observableArray();

    // called when the text changes in the seaarch box
    self.updateResults = function () {
        var query = this.searchQuery().toLowerCase();

        var results = area.filterPlaces(query);

        // Update search results field
        this.searchResults(results);

        mapViewModel.syncMarkersWithResults();
    };



    self.resultSelected = function (place) {
        mapViewModel.showPlaceInfo(place);
    };

};

var mapViewModel;
var listViewModel;

$(document).ready(function () {
    mapViewModel = new MapViewModel();
    listViewModel = new ListViewModel();

    ko.applyBindings(mapViewModel, document.getElementById("map-container"));
    ko.applyBindings(listViewModel, document.getElementById("listview"));
    mapViewModel.map = mapViewModel.mapCanvas().googleMap;

    // initailize the list view with all results
    listViewModel.updateResults();

    mapViewModel.syncMarkersWithResults();
});



// ##### Model #####
var placeData = [
    {
        name: "Royal Observatory",
        description: "TWren's 18th-century astronomical observatory on " +
            "the Prime Meridian, now a museum with a planetarium.",
        coords: {
            lat: 51.479416,
            lng: -0.0068405
        }
        },
    {
        name: "National Maritime Museum",
        description: "Exploring British naval history, with a ship simulator, " +
            "nautical oddities and interactive games",
        coords: {
            lat: 51.480875,
            lng: -0.0074777
        }
        },
    {
        name: "University of Greenwich",
        description: "Decent academic institution right by The River Thames",
        coords: {
            lat: 51.4833162,
            lng: -0.006149
        }
        },
    {
        name: "Cutty Sark",
        description: "Museum arranged around the eponymous ship that used " +
            "to speed tea from Asia to Victorian Britain",
        coords: {
            lat: 51.4828646,
            lng: -0.0117804
        }
        },
    {
        name: "Prayer Room",
        description: "The place where students (overwhelmingly muslim students) go to pray " +
            "their prayers during term time",
        coords: {
            lat: 51.4832994,
            lng: -0.0042321
        }
        },
    {
        name: "Greenwich Foot Tunnel",
        description: "Cross the thames by foot!",
        coords: {
            lat: 51.4850027,
            lng: -0.0119331
        }
        }
    ];

var area = {
    name: "Greenwich",
    coords: {
        lat: 51.4844931,
        lng: -0.0039174
    },
    postcode: "SE10 9LS",
    places: []
};

var Place = function Place(name, description, coords) {
    var self = this;
    self.name = name;
    self.description = description;
    self.coords = coords;

};

Place.prototype.marker = null;

// gets a html div representing the place for the google maps info window
Place.prototype.getHtml = function () {
    var template = '<div id="content">' +
        '<h3 id="heading" >$name</h3>' +
        '<div id="bodyContent">' +
        '<p>$description</p>' +
        '$wiki' +
        '</div>';
    var wikiTemplate = '<h6>Wikipedia:</h6>' +
        '<p>$wikiInfo</p>' +
        '<a href="$wikiUrl">$wikiUrl</a>';

    var wiki = "";
    if (this.wikiInfo && this.wikiUrl) {
        wiki = wikiTemplate.replace("$wikiInfo", this.wikiInfo)
            .replace("$wikiUrl", this.wikiUrl);
    }

    var html = template.replace("$name", this.name)
        .replace("$description", this.description)
        .replace("$wiki", wiki);

    return html;
};

// gets info from wikipedia
Place.prototype.getWikiInfo = function () {
    var requestUrl = "en.wikipeidia/w/api.php?" +
        "action=opensearch&format=json&search=" +
        this.name +
        "&limit=10&namespace=0";
    $.ajax({
        url: requestUrl,
        dataType: "jsonp",
        success: function (response) {
            area.places.forEach(function (place) {
                place.wikiUrl = response[3][0];
                place.wikiInfo = response[2][0];
            });
        }
    });
};

placeData.forEach(function (place) {
    area.places.push(new Place(place.name, place.description, place.coords));
});


area.getMarkers = function (viewModelMap, filteredResults) {
    var markers = [];
    filteredResults.forEach(function (place, i) {
        var marker = new google.maps.Marker({
            map: viewModelMap,
            position: place.coords,
            title: place.name
        });
        place.marker = marker;

        // callback for displaying place info
        marker.addListener("click", function () {
            mapViewModel.showPlaceInfo(place);
        });
        markers.push(marker);
    });

    return markers;
};

area.filterPlaces = function (query) {
    var searchResults = [];

    // filter based on search query
    area.places.forEach(function (place) {
        if (place.name.toLowerCase().includes(query) || place.description.toLowerCase().includes(query)) {
            searchResults.push(place);
        }
    });

    return searchResults;
};

// for searching places on wikipedia