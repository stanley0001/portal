import { Component } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import jsPDF from 'jspdf';
import { KycResultComponent } from '../kyc-result/kyc-result.component';


@Component({
  selector: 'app-kyc',
  standalone: true,
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.css',
  imports: [CommonModule, FormsModule, KycResultComponent],
  providers: [HttpClient],
})
export class KycComponent {
  selectedTab: string = 'queries'; 
  selectedOperation: string = 'Q1'; 
  startDate: string = '';
  endDate: string = '';
  idNumber: string = '';
  vehicleReg: string = '';
  taxId: string = '';
  insurancePolicy: string = '';
  responseData: any;
  selectedFile: File | null = null;
  selectedDocumentType='idCard';

  // constructor(private http: HttpClient) {}

  // Handles the selection of a file for OCR
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

//   // Sends the selected file to the OCR API
  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      // this.http.post('YOUR_OCR_API_ENDPOINT', formData).subscribe(
      //   (res) => (this.responseData = res),
      //   (err) => console.error('Upload error:', err)
      // );
    }
  }

//   // Handles the search based on selected operation and date range
  onSearch() {
    let apiUrl = this.getApiEndpoint(this.selectedOperation);
    let queryParams = `?startDate=${this.startDate}&endDate=${this.endDate}`;

    // this.http.get(`${apiUrl}${queryParams}`).subscribe(
    //   (res) => (this.responseData = res),
    //   (err) => console.error('Search error:', err)
    // );
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
  onQuery() {
    let apiUrl = this.getApiEndpoint("test");
    let queryParams = this.buildQueryParams();
  //   this.responseData={
  //     "data": {
  //         "certificateDate": "21/01/2022",
  //         "county": "N/A",
  //         "effectiveFromDate": "11/06/2017",
  //         "emailAddress": "KIMKIRWA35@GMAIL.COM",
  //         "personalIdentificationNumber": "A01100400ET",
  //         "taxObligations": "Individual",
  //         "taxObligationsRegistration": "Income Tax Resident",
  //         "taxpayerName": "ISAYA MURGOR KOSGEI"
  //     },
  //     "message": "Data retrived",
  //     "parcentage": 87.5,
  //     "success": true
  // };
  // this.responseData={
  //   "parcentage": 100.0,
  //   "status_code": 200,
  //   "query_type": "GetDataByIdCard",
  //   "ref_number": "35759328",
  //   "data": {
  //     "ErrorCode": "",
  //     "ErrorMessage": "",
  //     "ErrorOcurred": false,
  //     "Citizenship": "Kenyan",
  //     "Clan": null,
  //     "Date_of_Birth": "6\/14\/1998 12:00:00 AM",
  //     "Date_of_Death": null,
  //     "Ethnic_Group": null,
  //     "Family": null,
  //     "Fingerprint": null,
  //     "First_Name": "STANLEY",
  //     "Gender": "M",
  //     "ID_Number": "35759328",
  //     "Occupation": "STUDENT",
  //     "Other_Name": "MUNGAI",
  //     "Photo": "data:image/png;base64,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Lm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIgICB4bWxuczpHZXR0eUltYWdlc0dJRlQ9Imh0dHA6Ly94bXAuZ2V0dHlpbWFnZXMuY29tL2dpZnQvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIiAgeG1sbnM6aXB0Y0V4dD0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcEV4dC8yMDA4LTAyLTI5LyIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgZGM6UmlnaHRzPSIyMDI0IEdldHR5IEltYWdlcyIgcGhvdG9zaG9wOkNyZWRpdD0iR2V0dHkgSW1hZ2VzIiBHZXR0eUltYWdlc0dJRlQ6QXNzZXRJRD0iMjE3MzI0NDU1OSIgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cHM6Ly93d3cuZ2V0dHlpbWFnZXMuY29tL2V1bGE/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmwiIHBsdXM6RGF0YU1pbmluZz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi92b2NhYi9ETUktUFJPSElCSVRFRC1FWENFUFRTRUFSQ0hFTkdJTkVJTkRFWElORyIgPgo8ZGM6Y3JlYXRvcj48cmRmOlNlcT48cmRmOmxpPktldmluIERpZXRzY2g8L3JkZjpsaT48L3JkZjpTZXE+PC9kYzpjcmVhdG9yPjxkYzpkZXNjcmlwdGlvbj48cmRmOkFsdD48cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPldBU0hJTkdUT04sIERDIC0gU0VQVEVNQkVSIDE5OiBSZXB1YmxpY2FuIHByZXNpZGVudGlhbCBub21pbmVlIGZvcm1lciBVLlMuIFByZXNpZGVudCBEb25hbGQgVHJ1bXAgc3BlYWtzIGF0IHRoZSBJc3JhZWxpIEFtZXJpY2FuIENvdW5jaWwgTmF0aW9uYWwgU3VtbWl0IGF0IHRoZSBXYXNoaW5ndG9uIEhpbHRvbiBvbiBTZXB0ZW1iZXIgMTksIDIwMjQgaW4gV2FzaGluZ3RvbiwgREMuIFRydW1wIGFkZHJlc3NlZCB0aGUgcHJvLUlzcmFlbCBjb25mZXJlbmNlLCBzdGF0aW5nIHRoYXQgaWYgaGUgaXMgbm90IGVsZWN0ZWQgcHJlc2lkZW50IElzcmFlbCB3aWxsIGJlIOKAnGVyYWRpY2F0ZWTigJ0gd2l0aGluIHR3byB5ZWFycy4gKFBob3RvIGJ5IEtldmluIERpZXRzY2gvR2V0dHkgSW1hZ2VzKTwvcmRmOmxpPjwvcmRmOkFsdD48L2RjOmRlc2NyaXB0aW9uPgo8cGx1czpMaWNlbnNvcj48cmRmOlNlcT48cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz48cGx1czpMaWNlbnNvclVSTD5odHRwczovL3d3dy5nZXR0eWltYWdlcy5jb20vZGV0YWlsLzIxNzMyNDQ1NTk/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmw8L3BsdXM6TGljZW5zb3JVUkw+PC9yZGY6bGk+PC9yZGY6U2VxPjwvcGx1czpMaWNlbnNvcj4KCQk8L3JkZjpEZXNjcmlwdGlvbj4KCTwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InciPz4KAA==",
  //     "Pin": null,
  //     "Place_of_Birth": "THIKA WEST\nDISTRICT - THIKA WEST\n",
  //     "Place_of_Death": null,
  //     "Place_of_Live": "CHIEF\nNYACABA\nNYACABA\nLOCATION - KOMO\nDIVISION - JUJA\nDISTRICT - JUJA\n",
  //     "Signature": null,
  //     "Surname": "WARUGURU",
  //     "Date_of_Issue": "11\/3\/2017 12:00:00 AM",
  //     "RegOffice": null,
  //     "Serial_Number": "700731642"
  //   },
  //   "response_code": 200
  // };
//   this.responseData={
//     "data": {
//         "chassisNumber": "GD1-2388301",
//         "colour": "SILVER",
//         "dateOfRegistration": "2014-11-30 00:00:00.0",
//         "duty": "PAID",
//         "engineNo": "L13A-2310727",
//         "fuelType": "PETROL",
//         "make": "HONDA",
//         "numberOfPassengers": "5",
//         "ownersdetails": [
//             {
//                 "name": "SMEP MFI LIMITED",
//                 "pin": "P0512433121"
//             },
//             {
//                 "name": "PERIS MUTHONI WANJIRU",
//                 "pin": "A017086492D"
//             }
//         ],
//         "rating": "1330",
//         "registrationNumber": "KCB287F",
//         "tareWeight": "1000.0",
//         "vehicleUse": "PRIVATE",
//         "yearOfManufacture": "2007"
//     },
//     "message": "Data retrived",
//     "parcentage": 100.0,
//     "success": true
// };
// this.responseData={
//   "data": {
//       "chassisNumber": "GD1-2388301",
//       "colour": "SILVER",
//       "dateOfRegistration": "2014-11-30 00:00:00.0",
//       "duty": "PAID",
//       "engineNo": "L13A-2310727",
//       "fuelType": "PETROL",
//       "make": "HONDA",
//       "numberOfPassengers": "5",
//       "ownersdetails": [
//           {
//               "name": "SMEP MFI LIMITED",
//               "pin": "P0512433121"
//           },
//           {
//               "name": "PERIS MUTHONI WANJIRU",
//               "pin": "A017086492D"
//           }
//       ],
//       "rating": "1330",
//       "registrationNumber": "KCB287F",
//       "tareWeight": "1000.0",
//       "vehicleUse": "PRIVATE",
//       "yearOfManufacture": "2007"
//   },
//   "message": "Data retrived",
//   "parcentage": 100.0,
//   "success": true
// };
// this.responseData={
//   "successStatus": "success",
//   "message": "Success",
//   "parcentage": 100.0,
//   "data": {
//       "vehicleDetails": {
//           "registrationNo": "KCK688Q",
//           "make": "MERCEDES-BENZ",
//           "model": "E250",
//           "engineNo": "27186030485566",
//           "chassisNo": "WDD2120472A633503",
//           "yearOfManufacture": "2012",
//           "vehicleUse": "PRIVATE",
//           "registrationDate": "2017-01-16T00:00:00",
//           "grossWeight": "2500",
//           "tareWeight": "2500",
//           "taxClass": null,
//           "dutyStatus": "PAID",
//           "dutyAmount": "1034927",
//           "dutyDate": "",
//           "numberOfAxles": null,
//           "numberOfPrevOwners": null,
//           "fuelType": "NA",
//           "seatCapacity": 5,
//           "color": "BLACK.",
//           "bodyType": "SALOON",
//           "logbookNo": {
//               "LOGBOOK_SERIAL": "1234",
//               "LOGBOOK_NUMBER": "214235"
//           },
//           "cc_rating": "1796"
//       },
//       "owner": {
//           "ownerType": "INDIVIDUAL",
//           "address": "72763",
//           "code": "00100",
//           "phoneNumber": "+254722834303",
//           "name": "DOROTHY AWINO OGOLA",
//           "idNumber": "14551725"
//       },
//       "Status": "Ok",
//       "Details": "Success"
//   },
//   "responseCode": 0,
//   "httpStatus": "OK"
// };
this.responseData={
  "data": {
      "countryCode": "KEN",
      "dateOfBirth": "27 AUG 1988",
      "dateOfExpiry": "19 AUG 2031",
      "dateOfIssue": "20 AUG 2021",
      "givenNames": "EDWIN MWORIA",
      "issuingAuthority": "GOVERNMENT OF KENYA",
      "nationality": "KENYAN",
      "passportNo": "BK245229",
      "personalNo": "2737844",
      "sex": "M",
      "surname": "NJONGE",
      "type": "P"
  },
  "message": "Data retrived",
  "parcentage": 100.0,
  "success": true
};
    // this.http.get(`${apiUrl}${queryParams}`).subscribe(
    //   (res) => (this.responseData = res),
    //   (err) => console.error('Query error:', err)
    // );
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


