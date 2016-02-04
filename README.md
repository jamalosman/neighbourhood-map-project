# neighbourhood-map-project

This project simply displays a map around where I went to Uni, I've added a few places of interest.

To run the project simply:
* download the files
* run the following command
```sh bower install ```
* open index.html. 

The site was tested using python's SimpleHTTPServer and chrome browser, but should work without the server.

Features
 - Interactive search (updates listview and map markers)
 - List view (displays filtered area results)
 - Map display (shows the town highlights on the map with clickable markers.)
 - Wikipedia integration (shows information from Wikipedia about the places, if the api call fails the application runs without it).
 
Third party libraries
 - Boostrap
 - JQuery
 - KnockoutJS
 - Google Maps API
 - RichMarker for Google Maps (https://github.com/googlemaps/js-rich-marker)
 - Wikipedia API