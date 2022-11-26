import { Component, OnDestroy } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  qrCodeString: string = 'ooof';
  scanResult: any;
  visible: boolean = true;

  constructor() {}


  async checkPermission() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if(status.granted) {
        return true;
      }
      return false;
    }
    catch(err) {
      console.log(err);
      return false;
    }
  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if(!permission) return;


      await BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');
      this.visible = false;
      const result = await BarcodeScanner.startScan();
      console.log(result);
      this.visible = true;

      if(result.hasContent) {
        this.scanResult = result.content;
        console.log(this.scanResult);
      }
    }
    catch(err) {
      console.log(err);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body')?.classList.remove('scanner-active');
  };

  ngOnDestroy(): void {
    this.stopScan();
    this.visible = true;
  }
}
