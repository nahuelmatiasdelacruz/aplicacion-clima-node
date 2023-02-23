import fs from "fs";
import axios from "axios";

class Busquedas{
    dbPath = "./db/database.json";
    historial = [];
    constructor(){
        this.leerDb();
    }
    get historialCapitalizado(){
        return this.historial.map(lugar=>{
            let palabras = lugar.split(" ");
            palabras = palabras.map(palabra=>palabra[0].toUpperCase() + palabra.substring(1));
            return palabras.join(" ");
        });
    }
    get paramsOpenWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: "metric",
            lang: "es"
        }
    }
    get paramsMapbox(){
        return {
            "access_token": process.env.MAPBOX_KEY,
            "limit": 5,
            "language": "es"
        }
    }
    async buscarCiudad(lugar = ""){
        try{

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
            const response = await instance.get();
            return response.data.features.map((lugar)=>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
        }catch(e){
            return [];
        }
    }
    async climaLugar(lat,lon){
        try{
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather,lat,lon}
            })
            const resp = await instance.get();
            const {weather,main} = resp.data;
            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        }catch(e){
            console.log(e);
        }
    }
    agregarHistorial(lugar){
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDb();
    }
    guardarDb(){
        const payLoad = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payLoad));
    }
    leerDb(){
        if(!fs.existsSync(this.dbPath)) return;
        const info = fs.readFileSync(this.dbPath,{encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial;
    }
}

export {Busquedas};