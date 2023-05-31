import { DataService } from './../../services/dataServices';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
})
export class CameraComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private location: Location,
    private toast: HotToastService
  ) {}

  fileUploaded = false;
  fid = 0;
  featureTypeSelected = sessionStorage.getItem('featureType');

  ngOnInit(): void {
    if (this.featureTypeSelected === 'Plots') {
      this.fid = Number(sessionStorage.getItem('plotFid'));
    } else if (this.featureTypeSelected === 'Roads') {
      this.fid = Number(sessionStorage.getItem('roadFid'));
    } else if (this.featureTypeSelected === 'Footpaths') {
      this.fid = Number(sessionStorage.getItem('footpathFid'));
    } else if (this.featureTypeSelected === 'Proposals') {
      this.fid = Number(sessionStorage.getItem('proposalFid'));
    } else if (this.featureTypeSelected === 'Wetlands') {
      this.fid = Number(sessionStorage.getItem('wetlandFid'));
    }
  }

  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let jsonObject = {
        fid: this.fid,
        ftype: this.featureTypeSelected,
        uri: reader.result,
      };
      this.dataService.uploadImage(jsonObject).subscribe((response) => {
        this.fileUploaded = true;
        this.toast.success('Image Uploaded');
      });
    };
  }

  goBack() {
    this.location.back();
  }
}
