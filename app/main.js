$(document).ready(function () {
    ko.applyBindings(new HomeViewModel());
});

ko.bindingHandlers.map = {

    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var mapObj = ko.utils.unwrapObservable(valueAccessor());
        var latLng = new google.maps.LatLng(
            ko.utils.unwrapObservable(mapObj.lat),
            ko.utils.unwrapObservable(mapObj.lng));
        var mapOptions = {
            center: latLng,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        mapObj.googleMap = new google.maps.Map(element, mapOptions);
    }
};

var HomeViewModel = function () {
    var self = this;
    self.map = ko.observable({
        lat: ko.observable(51.4844931),
        lng: ko.observable(-.0039174)
    });
};