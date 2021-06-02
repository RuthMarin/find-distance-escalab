import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {DistanceService} from './services/distance.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	distance = "";
	start = true;
	public record: any = [];
	public lat_origin: any;
	public lon_origin: any;
	public lat_destination: any;
	public lon_destination: any;
	public history: any = [];
	record_= [];
	form = new FormGroup({
		origin_address: new FormControl(''),
		origin_country: new FormControl(''),
		origin_city: new FormControl(''),
		destination_address: new FormControl(''),
		destination_city: new FormControl(''),
		destination_country: new FormControl(''),  
  	});

	constructor(private http: HttpClient, public distanceService: DistanceService) { }

	ngOnInit() {}
    // Formula para el calculo de la distancia
    // Fuente: https://stackoverflow.com/questions/31332989/how-to-calculate-distance-between-two-latitude-and-longitude-using-angulajs
    // ng serve
	distanceFunction() {
		//this.form.value.origin_city = "estacion central"; 
		//this.form.value.destination_city = "san ramon";
		//this.form.value.origin_country = "chile"; 
		//this.form.value.destination_country  = "chile";
		//this.form.value.origin_address = "matucana 100"; 
		//this.form.value.destination_address  = "rancagua 7130";
		console.log(this.form.value.origin_city);
        //origin 
    	this.distanceService.getDistance(this.form.value.origin_address, this.form.value.origin_city, this.form.value.origin_country ).then(data=> {
    		if (data.features[0] === undefined){
    			this.distance = "No se puede calcular la distancia"
    		}else{
    			this.lat_origin = data.features[0].geometry.coordinates[1];
        		this.lon_origin = data.features[0].geometry.coordinates[0];
        		//destination
	        	this.distanceService.getDistance(this.form.value.destination_address, this.form.value.destination_city, this.form.value.destination_country ).then(data=> {
		        	if (data.features[0] === undefined){
	    				this.distance = "No se puede calcular la distancia"
	    			}else{
			            this.lat_destination = data.features[0].geometry.coordinates[1];
			            this.lon_destination = data.features[0].geometry.coordinates[0];
			            var R = 6371; // Radius of the earth in kilometers
						var dLat = this.deg2rad(this.lat_destination - this.lat_origin); // deg2rad below
						var dLon = this.deg2rad(this.lon_destination - this.lon_destination);
						var a =
						Math.sin(dLat / 2) * Math.sin(dLat / 2) +
						Math.cos(this.deg2rad(this.lat_origin)) * Math.cos(this.deg2rad(this.lat_destination)) *
						Math.sin(dLon / 2) * Math.sin(dLon / 2);
						var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
						var d = R * c; // Distance in KM
					    console.log( Math.round(d * 100)/ 100 + " km");
					    this.distance =  "La Distancia es: "+ Math.round(d * 100)/ 100 + " km";
					    console.log(this.distance);
					    this.history.push([this.distance + ' entre ' + this.form.value.origin_address + ', ' + this.form.value.origin_city + ', ' + this.form.value.origin_country + ' y ' +this.form.value.destination_address + ', ' + this.form.value.destination_city + ', ' + this.form.value.destination_country]);
					    localStorage.setItem('distance', JSON.stringify(this.history))
	    			}

	    		}, (err) => {
	      			console.error(err)
	      			this.distance = "No se puede calcular la distancia"
	      			console.log('Ocurrió un error');
	    		});
    		}	

    	}, (err) => {
      		console.error(err)
      		this.distance = "No se puede calcular la distancia"
      		console.log('Ocurrió un error');
    	});


   }
   // Formula para el calculo de la distancia
   // Fuente: https://stackoverflow.com/questions/31332989/how-to-calculate-distance-between-two-latitude-and-longitude-using-angulajs
   deg2rad(deg?: any) {
  		return deg * (Math.PI / 180)
	}

	change(){
		if (localStorage.getItem("distance") != null) {
			this.record = localStorage.getItem("distance");
			//this.record = JSON.parse(this.record);
			this.record_ = JSON.parse(this.record);
     		console.log(this.record_[0]);
			this.start = false;
		}else{
			this.start = false;
			this.record = "No hay historial para mostrar"
		}

	}
	home(){
		this.start = true;
	}
}



