import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(private toastr: ToastrService) {}

  private defaultOptions: Partial<IndividualConfig> = {
    timeOut: 5000,
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    enableHtml: true,
  };

  success(message: string, title: string = 'Success', options?: Partial<IndividualConfig>) {
    this.toastr.success(message, title, { ...this.defaultOptions, ...options });
  }

  info(message: string, title: string = 'Info', options?: Partial<IndividualConfig>) {
    this.toastr.info(message, title, { ...this.defaultOptions, ...options });
  }

  warning(message: string, title: string = 'Warning', options?: Partial<IndividualConfig>) {
    this.toastr.warning(message, title, { ...this.defaultOptions, ...options });
  }

  error(message: string, title: string = 'Error', options?: Partial<IndividualConfig>) {
    this.toastr.error(message, title, { ...this.defaultOptions, ...options });
  }
}