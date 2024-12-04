import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import jsPDF from 'jspdf';
import { KycResultComponent } from '../kyc-result/kyc-result.component';

declare var bootstrap: any; 

@Component({
  selector: 'app-kyc',
  standalone: true,
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.css',
  imports: [
    CommonModule,
    FormsModule, 
    KycResultComponent,
    HttpClientModule
  ],
  providers: [HttpClient],
})
export class KycComponent {
  selectedTab: string = 'queries'; 
  selectedOperation: string = 'IPRS'; 
  startDate: string = '';
  endDate: string = '';
  idNumber: string = '';
  vehicleReg: string = '';
  taxId: string = '';
  insurancePolicy: string = '';
  responseData: any;
  selectedFile: File | null = null;
  selectedDocumentType='NATIONAL_ID';
  httpRequest:any={};
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  responseReportData: any[] = [];
  paginatedData: any[] = [];
  selectedResult: any = null;
  constructor(private http: HttpClient) {}

  // Handles the selection of a file for OCR
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  toggleResult(item: any) {
    //get data from backend
    let apiUrl = "https://api-v2.mfs.co.ke/mymobi-kyc/1.0.0/api/kyc/requests/response";
    let queryParams = `?uniqueReference=${item.uniqueReference}`;
    const headers = this.getHeaders();
    this.http.get(`${apiUrl}${queryParams}`,{ headers }).subscribe(
      (res:any) =>{
        // (this.responseData = res)
        this.selectedResult=res
        this.selectedResult.data=res?.body
        this.selectedResult.data.results=res?.body.results[0].result
      },
      (err) => console.error('Search error:', err)
    );
  }
  openModal(item: any) {
    let apiUrl = "https://api-v2.mfs.co.ke/mymobi-kyc/1.0.0/api/kyc/requests/response";
    let queryParams = `?uniqueReference=${item.uniqueReference}`;
    const headers = this.getHeaders();
    this.http.get(`${apiUrl}${queryParams}`,{ headers }).subscribe(
      (res:any) =>{
        // (this.responseData = res)
        this.selectedResult=res
        this.selectedResult.data=res?.body
        this.selectedResult.data.results=res?.body.results[0].result
      },
      (err) => console.error('Search error:', err)
    );
    const modalElement = document.getElementById('resultModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

//   // Sends the selected file to the OCR API
  onUpload() {
    console.log("uploading....")
    console.log("this.selectedFile",this.selectedFile)
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('file_type', this.selectedDocumentType);
      this.http.post('http://127.0.0.1:5052/upload', formData).subscribe(
        (res: any) =>{
          this.responseData = res
        },
        (err: any) => console.error('Upload error:', err)
      );
    }
  }

  //   // Handles the search based on selected operation and date range
  formatDate() {
    if (this.startDate) {
      const [year, month, day] = this.startDate.split('-');
      this.startDate = `${month}/${day}/${year}`;
    }
  
    if (this.endDate) {
      const [year, month, day] = this.endDate.split('-');
      this.endDate = `${month}/${day}/${year}`;
    }
  }
  
  onSearch() {
    this.formatDate();
    let apiUrl = "https://api-v2.mfs.co.ke/mymobi-kyc/1.0.0/api/kyc/requests/";
    let queryParams = `27?start=${this.startDate}&end=${this.endDate}&orderBy=id&page=0&size=30&direction=DESC`;
    const url="https://api-v2.mfs.co.ke/mymobi-kyc/1.0.0/api/kyc/search?sync=true";
    const headers = this.getHeaders();
    this.http.get(`${apiUrl}${queryParams}`,{ headers }).subscribe(
      (res:any) =>{
        // (this.responseData = res)
        this.paginatedData=res?.body.data
      },
      (err) => console.error('Search error:', err)
    );
  }

//   // Returns the API endpoint based on the selected operation
  getApiEndpoint(operation: string): string {
    switch (operation) {
      case 'Q1':
        return 'YOUR_PERSONAL_INFO_API';
      case 'Q2':
        return 'YOUR_VEHICLE_INFO_API';
      case 'Q3':
        return 'YOUR_TAX_INFO_API';
      case 'Q4':
        return 'YOUR_INSURANCE_INFO_API';
      case 'Q5':
        return 'YOUR_OCR_API_ENDPOINT';
      default:
        return '';
    }
    
  }
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  private getHeaders(): HttpHeaders {
    const clientToken = sessionStorage.getItem('appToken');
    const clientKey = sessionStorage.getItem('appKey');
    const bearerToken = sessionStorage.getItem('ws02Token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Client-Token': clientToken ? clientToken : '', 
      'Client-Key': clientKey ? clientKey : '',  
      Authorization: bearerToken ? `Bearer ${bearerToken}` : '',
    });
    // ws02Token
    return headers;
  }
  private prepareRequest(){
    switch (this.selectedOperation) {
      case 'IPRS':
        this.httpRequest={
          search: [
            {
              param: 'id_no',
              value: this.idNumber,
            },
          ],
          sources: ['IPRS_Q'],
          uniqueReference: `${this.generateUUID()}-${Date.now()}`,
        };
        if(this.selectedDocumentType==='PASSPORT'){
          this.httpRequest.search[0].param="NKENR"
        }
        if(this.selectedDocumentType==='ALIENID'){
          this.httpRequest.search[0].param="NKE"
        }
        break;
        case 'NTSA':
          this.httpRequest={
            search: [
              {
                param: 'reg_no',
                value: this.vehicleReg,
              },
            ],
            sources: ['NTSA_Q'],
            uniqueReference: `${this.generateUUID()}-${Date.now()}`,
          };
          break;
        case 'KRA':
         this.httpRequest={
          search: [
            {
              param: 'KE',
              value: this.idNumber,
            },
          ],
          sources: ['KRA_Q'],
          uniqueReference: `${this.generateUUID()}-${Date.now()}`,
        };
        if(this.selectedDocumentType==='PASSPORT'){
          this.httpRequest.search[0].param="NKENR"
        }
        if(this.selectedDocumentType==='ALIENID'){
          this.httpRequest.search[0].param="NKE"
        }
        break;
      default: 
      alert('operation not implemented') 
    }
    
  }
  private prepareResponse(response:any){
    console.log("this.selectedOperation",this.selectedOperation)
    console.log("response",response)
    switch (this.selectedOperation) {
      case 'IPRS':
        this.responseData = response
        this.responseData.data = response.body.results[0]
        this.responseData.data.result = response.body.results[0].result.response_data;
        break;
      case 'KRA':
        this.responseData = response
        this.responseData.data = response.body.results[0].result
        break;
      case 'NTSA':
        this.responseData = response
        this.responseData.data = response.body.results[0].result
        break;
      default:
        this.responseData = response
        this.responseData.data = response.body.results[0]
       }
  }
  onQuery() {
    this.prepareRequest()
    const url="https://api-v2.mfs.co.ke/mymobi-kyc/1.0.0/api/kyc/search?sync=true";
    const headers = this.getHeaders();
    this.http.post(url, this.httpRequest, { headers }).subscribe(
      (res: any) =>{
        console.log("response",res)
        this.prepareResponse(res)
      },
      (err: any) => console.error('fetch error:', err)
    );
  
  }
  downloadPDF() {
    // const doc = new jsPDF();
    // doc.text(JSON.stringify(this.responseData, null, 2), 10, 10);
    // doc.save('report.pdf');
    const printContents = document.querySelector('.kyc-result-container');
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents?.outerHTML || '';
    window.print();

    document.body.innerHTML = originalContents; 
  }
  buildQueryParams(): string {
    switch (this.selectedOperation) {
      case 'Q1':
        return `?idNumber=${this.idNumber}`;
      case 'Q2':
        return `?vehicleReg=${this.vehicleReg}`;
      case 'Q3':
        return `?taxId=${this.taxId}`;
      case 'Q4':
        return `?insurancePolicy=${this.insurancePolicy}`;
      default:
        return '';
    }
  }

  
}


