import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';



@Component({
  selector: 'app-kyc-result',
  standalone: true,
  imports:[
    CommonModule
  ],
  templateUrl: './kyc-result.component.html',
  styleUrls: ['./kyc-result.component.css']
})
export class KycResultComponent  implements OnChanges {
  @ViewChild('responseContainer') responseContainer: ElementRef | undefined
  @Input() resultData: any;
  displayData: { key: string; value: any }[] = [];
  showToast = false;
  percentageDeg = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resultData']) {
      this.formatDisplayData();
      this.updateGauge();
      this.showToastMessage();
    }
    if (changes['resultData'] && this.resultData) {
      this.scrollToResponse();
    }
  }
  private scrollToResponse(): void {
    if (this.responseContainer) {
      this.responseContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // formatDisplayData(): void {
  //   this.displayData = Object.keys(this.resultData?.data || {}).map(key => ({
  //     key,
  //     value: this.resultData.data[key]
  //   }));
  // }
  // formatDisplayData(): void {
  //   this.displayData = Object.keys(this.resultData?.data || {}).map(key => ({
  //     key: this.convertToSentenceCase(key),
  //     value: this.resultData.data[key]
  //   }));
  // }
  formatDisplayData(): void {
    this.displayData = Object.keys(this.resultData?.data || {})
      .filter(key => {
        const value = this.resultData.data[key];
        return value !== null && value !== undefined && value !== '';
      })
      .map(key => ({
        key: this.convertToSentenceCase(key),
        value: this.resultData.data[key]
      }));
  }  

  convertToSentenceCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  }
  

  updateGauge(): void {
    const percentage = this.resultData?.parcentage || 0;
    this.percentageDeg = (percentage / 100) * 180; 
  }

  showToastMessage(): void {
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }
  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  objectKeys(value: any): string[] {
    return Object.keys(value);
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
  isPhoto(value: any): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    
    const base64Pattern = /^data:image\/[a-zA-Z]+;base64,/;
    const urlPattern = /^(http|https):\/\/[^\s]+/;
    
    return base64Pattern.test(value) || urlPattern.test(value);
  }
}