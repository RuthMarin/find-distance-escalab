import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
//servicio que obtiene los datos de los productos en venta

export class DistanceService {
	getDistance (address: string, city: string, country: string): Promise<any> {
    	return this.request.get( address + '+' + city + '%2C+' + country +'&format=geojson').then((res) => {
			return res;
		}, (err) => {
			console.log(err);
		});
    }

	constructor(
		private request: RequestService ) { }
}