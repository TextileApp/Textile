import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class ShareService {  
  
  canDelete: boolean;
  showDresses:boolean;
  isUploading:boolean;
    constructor() {
       this.canDelete = false;
       this.showDresses = false;
    }
  
    setCanDelete(can) {
       this.canDelete = can; 
    }
  
    getCanDelete() {
       return this.canDelete;
    }   
     setShowDresses(can) {
       this.showDresses = can; 
    }
  
    getShowDresses() {
       return this.showDresses;
    }   
    setIsUploading(can) {
       this.isUploading = can; 
    }
  
    getIsUploading() {
       return this.isUploading;
    }   
}