require('colors');

const { guardarDB, leerDb } = require('./helpers/guardarArchivo');
const { inquirerMenu,
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
} = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

const main = async() => {

    let opt= '';
    const tareas = new Tareas();

    const tareasDB = leerDb();

    if ( tareasDB ) {
        tareas.cargarTareasFromArray( tareasDB );
    }

    // await pausa();

    do {
        // Imprimir Menu
        opt = await inquirerMenu();


        switch (opt) {
            case 1:
                //Crear opcion
                const desc = await leerInput('Descripción:');
                tareas.crearTarea( desc );
                
                break;
            case 2:
                //Listar todas las tareas
                tareas.listadoCompleto();
                break;

            case 3:
                //Listar tareas completadas
                tareas.listarPendientesCompletadas();
                break;

            case 4:
                //Listar tareas pendientes
                tareas.listarPendientesCompletadas( false );
                break;

            case 5:
                //Completar
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas(ids);
                break;

            case 6:
                //Listar tareas pendientes
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id !== 0) {
                    const ok = await confirmar('¿Esta Seguro?');
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }
                }
                break;
        
            default:
                break;
        }
        // console.log({ opt });

        guardarDB( tareas.listadoArr );

        if ( opt !== 0 ) await pausa();

    } while ( opt !== 0 );
    
}

main();