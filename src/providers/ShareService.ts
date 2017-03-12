import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ShareService {  
  
  canDelete: boolean;
  isUploading:boolean;
  showDresses:boolean;
    constructor() {
       this.canDelete = false;
    }
    setShowDresses(istrue){
    this.showDresses = istrue;
  }
   getShowDresses() {
       return this.showDresses;
    }  
    setCanDelete(can) {
       this.canDelete = can; 
    }
  
    getCanDelete() {
       return this.canDelete;
    }   
    setIsUploading(can) {
       this.isUploading = can; 
    }
  
    getIsUploading() {
       return this.isUploading;
    }   
}