/*global ko,google,$,document*/

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
            zoom: 17,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP // SATELLITE
        };

        mapObj.googleMap = new google.maps.Map(element, mapOptions);
    }
};

// ##### View Model #####

var HomeViewModel = function () {
    var self = this;

    // Maps
    self.mapCanvas = ko.observable({
        lat: ko.observable(area.coords.lat),
        lng: ko.observable(area.coords.lng)
    });

    self.markers = ko.observableArray();

    // List View
    self.searchQuery = ko.observable("");
    self.searchResults = ko.observableArray();

    // called when the text changes in the box
    self.filterResults = function () {
        var query = self.searchQuery().toLowerCase();
        var searchResults = [];

        // filter based on search query
        area.places.forEach(function (place) {
            if (place.name.toLowerCase().includes(query) || place.description.toLowerCase().includes(query)) {
                searchResults.push(place);
            }
        });

        // Update search results field
        self.searchResults(searchResults);
    };

    self.resultSelected = function () {
        // TODO: Highlight selected option on the map
    };


    self.syncResults = function (e) {
        self.clearResults();
        var map = self.mapCanvas().googleMap;
        self.markers(getMarkers(map, self.searchResults()));
    };

    self.clearResults = function () {
        self.markers().forEach(function (marker, i) {
            marker.setMap(null);
        });
        self.markers.removeAll();
    };

    self.filterResults();
};

var homeViewModel;


$(document).ready(function () {
    homeViewModel = new HomeViewModel();
    ko.applyBindings(homeViewModel);
    homeViewModel.syncResults();
});



// ##### Model #####

var area = {
    name: "Greenwich",
    coords: {
        lat: 51.4844931,
        lng: -0.0039174
    },
    postcode: "SE10 9LS",
    places: [
        {
            name: "Royal Observatory",
            description: "TWren's 18th-century astronomical observatory on" +
                " the Prime Meridian, now a museum with a planetarium.",
            coords: {
                lat: 51.479416,
                lng: -0.0068405
            }
        },
        {
            name: "National Maritime Museum",
            description: "Exploring British naval history, with a ship simulator," +
                " nautical oddities and interactive games",
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
            description: "The place where students (overwhelmingly muslim students) go to pray" +
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
    ]
};

var getMarkers = function (viewModelMap, filteredResults) {
    var markers = [];
    filteredResults.forEach(function (place, i) {
        markers.push(new google.maps.Marker({
            map: viewModelMap,
            position: place.coords,
            title: place.name
        }));
    });
    return markers;
};