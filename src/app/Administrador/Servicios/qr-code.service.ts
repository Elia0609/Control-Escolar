import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  generateQRCode(text: string): Promise<string> {
    return QRCode.toDataURL(text);
  }
}
