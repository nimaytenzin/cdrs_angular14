import { DataService, IPlot } from './../../services/dataServices';
import {
  BuildingHeights,
  DevelopmentStatuses,
  PlotUses,
} from './../../services/staticData';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

interface IImage {
  uri: string;
}

@Component({
  selector: 'app-edit-plot',
  templateUrl: './edit-plot.component.html',
  styleUrls: ['./edit-plot.component.css'],
})
export class EditPlotComponent implements OnInit {
  constructor(
    private router: Router,
    private dataService: DataService,
    private toast: HotToastService
  ) {}

  plotFeatureId: number = Number(sessionStorage.getItem('plotFid'));
  developmentstatuses: String[] = DevelopmentStatuses;
  BuildingHeights: String[] = BuildingHeights;
  plotUses: String[] = PlotUses;
  selectedSpatialPlanId = Number(
    sessionStorage.getItem('selectedSpatialPlanId')
  );
  plotFeatureProperty = JSON.parse(
    sessionStorage.getItem('featureProperties')!
  );

  plotDetails = {} as IPlot;

  detailsAdded: boolean = false;
  plotId: string = '';

  editPlotForm = new FormGroup({
    developmentStatus: new FormControl(''),
    plotUse: new FormControl(''),
    maxHeight: new FormControl(''),
    remarks: new FormControl(''),
  });

  images = [] as IImage[];

  ngOnInit(): void {
    this.fetchDataIfExists();
    this.getImages();
  }

  fetchDataIfExists() {
    this.dataService.getPlotDetails(this.plotFeatureId).subscribe((res) => {
      if (res.data) {
        this.detailsAdded = true;
        this.plotDetails = res.data;
        this.editPlotForm.patchValue({
          developmentStatus: res.data.d_status,
          plotUse: res.data.plot_use,
          maxHeight: res.data.max_height,
          remarks: res.data.remarks,
        });
      } else {
        this.detailsAdded = false;
      }
    });
  }

  goBackToMap() {
    this.router.navigate(['map']);
  }

  getImages() {
    this.dataService
      .getImages(sessionStorage.getItem('featureType')!, this.plotFeatureId)
      .subscribe((res) => {
        this.images = res;
        console.log(this.images);
      });
  }

  saveData() {
    this.plotDetails.fid = this.plotFeatureId;
    this.plotDetails.lap_id = this.selectedSpatialPlanId;
    this.plotDetails.d_status =
      this.editPlotForm.get('developmentStatus')?.value!;
    this.plotDetails.max_height = this.editPlotForm.get('maxHeight')?.value!;
    this.plotDetails.plot_use = this.editPlotForm.get('plotUse')?.value!;
    this.plotDetails.remarks = this.editPlotForm.get('remarks')?.value!;
    this.plotDetails.plot_id = this.plotFeatureProperty['plot_id'];

    console.log('UPDATING', this.plotDetails);

    if (this.detailsAdded) {
      this.dataService
        .updatePlotDetails(this.plotFeatureId, this.plotDetails)
        .subscribe((res) => {
          this.toast.success('Data updated!');
        });
    } else {
      this.dataService.postPlotDetails(this.plotDetails).subscribe((res) => {
        if (res.status === 'Success') {
          this.toast.success('Plot Data added');

          this.dataService
            .markPlotShapefileAsCompleted(this.plotFeatureId)
            .subscribe((resp) => {
              this.toast.success('Shapefile marked green!');
            });
        }
      });
    }
  }
  takePhoto() {
    this.router.navigate(['camera']);
  }
}
