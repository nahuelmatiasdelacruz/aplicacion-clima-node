//console.clear();
import { config } from "dotenv";
import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquierer.js"
import { Busquedas } from "./models/Busquedas.js";
config();

const main = async () => {
    const busquedas = new Busquedas();
    let opt;
    do{
        opt = await inquirerMenu();
        switch(opt){
            case 1:
                const lugar = await leerInput("Ciudad a buscar: ");
                const lugares = await busquedas.buscarCiudad(lugar);
                const idSeleccionado = await listarLugares(lugares);
                if(idSeleccionado === "0") continue;
                const lugarSel = lugares.find((l)=>l.id===idSeleccionado);
                busquedas.agregarHistorial(lugarSel.nombre);
                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);
                console.clear();
                console.log("\nInformacion de la ciudad:\n".green);
                console.log("Ciudad: " + lugarSel.nombre.yellow);
                console.log("Latitud: " + lugarSel.lat);
                console.log("Longitud: " + lugarSel.lng);
                console.log("Temperatura: " + clima.temp);
                console.log("Mínima: " + clima.min);
                console.log("Máxima: " + clima.max);
                console.log("Cómo está el clima: " + clima.desc.green);
            break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar,i)=>{
                    const idx = `${i + 1}`.green;
                    console.log(`${idx} ${lugar}`);
                })
            break;
        }

        if(opt !== 0) await pausa();

    }while(opt !== 0)
}

main();