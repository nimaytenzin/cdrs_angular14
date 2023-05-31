import { Router } from '@angular/router';
import { DataService } from './../../services/dataServices';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Location } from '@angular/common';

interface ITypes {
  id: number;
  name: string;
}
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements OnInit {
  constructor(private dataService: DataService, private router: Router) {}

  googleSatUrl = 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}';
  cartoPositronUrl =
    'https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png';
  map!: L.Map;
  plotMap = {} as L.GeoJSON;
  roadMap = {} as L.GeoJSON;
  buildingMap = {} as L.GeoJSON;
  footpathMap = {} as L.GeoJSON;
  proposalMap = {} as L.GeoJSON;
  wetlandMap = {} as L.GeoJSON;

  latitude!: number;
  longitude!: number;
  accuracy!: number;

  selectedFeature = {};

  selectedSpatialPlanId = Number(
    sessionStorage.getItem('selectedSpatialPlanId')
  );

  types = ['Plots', 'Wetlands', 'Roads', 'Footpaths', 'Proposals'];
  featureTypeSelected = sessionStorage.getItem('featureType');

  ngOnInit(): void {
    this.renderMap();
    this.fetchGeojson();
  }

  renderMap() {
    var cartoMap = L.tileLayer(this.cartoPositronUrl);
    var satelliteMap = L.tileLayer(this.googleSatUrl);

    this.map = L.map('map', {
      zoomControl: false,
      layers: [satelliteMap],
      attributionControl: false,
      renderer: L.canvas({ tolerance: 3 }),
    }).setView([27.4712, 89.64191], 13);
  }

  fetchGeojson() {
    const featureTypeSelected = sessionStorage.getItem('featureType');
    if (featureTypeSelected === 'Plots') {
      this.fetchPlotsGeojson();
    }
    if (featureTypeSelected === 'Roads') {
      this.fetchRoadsGeojson();
    }
    if (featureTypeSelected === 'Buildings') {
      this.fetchBuildingGeojson();
    }
    if (featureTypeSelected === 'Footpaths') {
      this.fetchFootpathGeojson();
    }
    if (featureTypeSelected === 'Proposals') {
      this.fetchProposalsGeojson();
    }
    if (featureTypeSelected === 'Wetlands') {
      this.fetchWetlandGeojson();
    }
  }

  resetHighlight(e: any) {
    var layer = e.target;
    layer.setStyle({
      weight: 0.5,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.5,
    });
  }

  resetRoadHighLight(e: any) {
    var layer = e.target;
    layer.setStyle({
      weight: 1,
      opacity: 1,
      color: layer.feature.properties.done === 'true' ? 'green' : 'red',
      fillOpacity: 0.5,
    });
  }

  fetchPlotsGeojson() {
    this.dataService
      .getPlotsByPlan(this.selectedSpatialPlanId)
      .subscribe((res) => {
        this.plotMap = L.geoJSON(res, {
          style: function (feature) {
            return {
              fillColor: feature?.properties.done === 'true' ? 'green' : 'red',
              weight: 0.5,
              opacity: 1,
              color: 'black',
              fillOpacity: 0.5,
            };
          },
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                e.target.setStyle({
                  weight: 2,
                  color: 'yellow',
                });
              },
              mouseout: this.resetHighlight,
              click: (e) => {
                this.map.fitBounds(e.target.getBounds());
                this.selectedFeature = e.target.feature.properties;
                sessionStorage.setItem(
                  'plotFid',
                  e.target.feature.properties.gid
                );
                sessionStorage.setItem(
                  'featureProperties',
                  JSON.stringify(e.target.feature.properties)
                );
              },
            });
          },
        });
        this.map.addLayer(this.plotMap);
        this.map.fitBounds(this.plotMap.getBounds());
      });
  }

  fetchRoadsGeojson() {
    this.dataService
      .getRoadsByPlan(this.selectedSpatialPlanId)
      .subscribe((res) => {
        this.plotMap = L.geoJSON(res, {
          style: function (feature) {
            return {
              weight: 1,
              opacity: 1,
              color: feature?.properties.done === 'true' ? 'green' : 'red',
              fillOpacity: 0.5,
            };
          },
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                e.target.setStyle({
                  weight: 2,
                  color: 'yellow',
                });
              },
              mouseout: this.resetRoadHighLight,
              click: (e) => {
                this.map.fitBounds(e.target.getBounds());
                this.selectedFeature = e.target.feature.properties;
                sessionStorage.setItem(
                  'roadFid',
                  e.target.feature.properties.gid
                );
                sessionStorage.setItem(
                  'featureProperties',
                  JSON.stringify(e.target.feature.properties)
                );
              },
            });
          },
        });
        this.map.addLayer(this.plotMap);
        this.map.fitBounds(this.plotMap.getBounds());
      });
  }

  fetchFootpathGeojson() {
    this.dataService
      .getFootpathsByPlan(this.selectedSpatialPlanId)
      .subscribe((res) => {
        this.footpathMap = L.geoJSON(res, {
          style: function (feature) {
            return {
              weight: 1,
              opacity: 1,
              color: feature?.properties.done === 'true' ? 'green' : 'red',
              fillOpacity: 0.5,
            };
          },
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                e.target.setStyle({
                  weight: 2,
                  color: 'yellow',
                });
              },
              mouseout: this.resetHighlight,
              click: (e) => {
                this.map.fitBounds(e.target.getBounds());
                this.selectedFeature = e.target.feature.properties;
                sessionStorage.setItem(
                  'footpathFid',
                  e.target.feature.properties.gid
                );
                sessionStorage.setItem(
                  'featureProperties',
                  JSON.stringify(e.target.feature.properties)
                );
              },
            });
          },
        });
        this.map.addLayer(this.footpathMap);
        this.map.fitBounds(this.footpathMap.getBounds());
      });
  }

  fetchBuildingGeojson() {
    this.dataService
      .getBuildingsByPlan(this.selectedSpatialPlanId)
      .subscribe((res) => {
        this.buildingMap = L.geoJSON(res, {
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
              radius: 4,
              fillColor: feature.properties.done === 'true' ? 'red' : 'green',
              color: feature.properties.done === 'true' ? 'red' : 'green',
              weight: 1,
              opacity: 1,
              fillOpacity: 1,
            });
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
              sessionStorage.setItem(
                'buildingFid',
                feature.properties.structure_
              );
              sessionStorage.setItem(
                'featureProperties',
                JSON.stringify(e.target.feature.properties)
              );
              this.router.navigate(['editBuilding']);
            });
          },
        });

        this.map.addLayer(this.buildingMap);
        this.map.fitBounds(this.buildingMap.getBounds());
      });
  }

  fetchProposalsGeojson() {
    this.dataService
      .getProposalsBySpatialPlan(this.selectedSpatialPlanId)
      .subscribe((res) => {
        console.log(res);
        this.proposalMap = L.geoJSON(res, {
          pointToLayer: function (feature, latlng) {
            console.log(feature, latlng);
            return L.circleMarker(latlng, {
              radius: 6,
              fillColor: feature.properties.done === 'true' ? 'red' : 'green',
              color: feature.properties.done === 'true' ? 'red' : 'green',
              weight: 2,
              opacity: 1,
              fillOpacity: 1,
            });
          },
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                e.target.setStyle({
                  weight: 2,
                  color: 'yellow',
                });
              },
              mouseout: this.resetHighlight,
              click: (e) => {
                // this.map.fitBounds(e.target.getBounds())
                this.selectedFeature = e.target.feature.properties;
                sessionStorage.setItem(
                  'proposalFid',
                  e.target.feature.properties.gid
                );
                sessionStorage.setItem(
                  'featureProperties',
                  JSON.stringify(e.target.feature.properties)
                );
              },
            });
          },
        });

        this.map.addLayer(this.proposalMap);
        this.map.fitBounds(this.proposalMap.getBounds());
      });
  }

  fetchWetlandGeojson() {
    console.log('Wetlands loading');
    this.dataService
      .getWetlandsBySpatialPlan(this.selectedSpatialPlanId)
      .subscribe((res) => {
        this.wetlandMap = L.geoJSON(res, {
          style: function (feature) {
            return {
              fillColor: feature?.properties.done === 'true' ? 'green' : 'red',
              weight: 0.5,
              opacity: 1,
              color: 'black',
              fillOpacity: 0.5,
            };
          },
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                e.target.setStyle({
                  weight: 2,
                  color: 'yellow',
                });
              },
              mouseout: this.resetHighlight,
              click: (e) => {
                this.map.fitBounds(e.target.getBounds());
                this.selectedFeature = e.target.feature.properties;
                sessionStorage.setItem(
                  'wetlandFid',
                  e.target.feature.properties.gid
                );
                sessionStorage.setItem(
                  'featureProperties',
                  JSON.stringify(e.target.feature.properties)
                );
              },
            });
          },
        });

        this.map.addLayer(this.wetlandMap);
        this.map.fitBounds(this.wetlandMap.getBounds());
      });
  }

  onFeatureTypeChange(event: any) {
    console.log('FEATURE TYPE CHANGE', event);
    sessionStorage.setItem('featureType', event.target.value);
    window.location.reload();
  }

  getLocation(): void {
    if (navigator.geolocation) {
      const iconRetinaUrl = 'assets/mymarker.png';
      const iconUrl = 'assets/mymarker.png';
      const iconDefault = L.icon({
        iconRetinaUrl,
        iconUrl,
        iconSize: [20, 20],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      });

      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.longitude = position.coords.longitude;
          this.latitude = position.coords.latitude;
          this.accuracy = position.coords.accuracy;

          L.circle([this.latitude, this.longitude], { radius: 20 }).addTo(
            this.map
          );
          this.map.flyTo([this.latitude, this.longitude], 19);
          // if (this.accuracy > 100) {

          //
          // } else {
          //   L.circle([this.latitude, this.longitude], {radius: 20}).addTo(this.map);
          //   this.map.flyTo([this.latitude, this.longitude], 19);
          // }
        },
        (err) => {},
        options
      );
    }
  }

  goToEdit() {
    if (this.featureTypeSelected === 'Plots') {
      this.router.navigate(['editPlot']);
    }

    if (this.featureTypeSelected === 'Roads') {
      this.router.navigate(['editRoad']);
    }
    if (this.featureTypeSelected === 'Buildings') {
    }
    if (this.featureTypeSelected === 'Footpaths') {
      this.router.navigate(['editFootpath']);
    }
    if (this.featureTypeSelected === 'Proposals') {
      this.router.navigate(['editProposal']);
    }
    if (this.featureTypeSelected === 'Wetlands') {
      this.router.navigate(['editWetland']);
    }
  }
}
