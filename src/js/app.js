let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', () => {
    iniciarApp();
});

const iniciarApp = () => {
    mostrarSeccion(); //Muestra y oculta las secciones
    tabs();//cambia la seccion cuando se presionen los tabs
    botonesPaginador(); // agraega o quita los botones del paginador
    paginaSiguinete();
    paginaAnterior();

    consultarApi(); // Consulta la Api en el backend de PHP
    idCliente();
    nombreCliente(); // Añade el nombre del cliente alobjeto de cita
    seleccionarFecha(); //Añade la fecha de la ciata en ele objeto
    seleccionarHora(); // Añade la hora de la cita al objeto

    mostrarResumen();//Muestra el resumnen de la cita

}

const mostrarSeccion = () => {
    //Ocultar la seccion que tenga la clase mostrar
    const seccionAnterior = document.querySelector('.mostrar')
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar')
    }
    

    //Selecionar la seccion con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual')
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

const tabs = () => {
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach(boton => {
        boton.addEventListener('click', (e) => {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        })
    })
};

const botonesPaginador = () => {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguinete = document.querySelector('#siguiente');

    if (paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguinete.classList.remove('ocultar');
    } else if (paso ===3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguinete.classList.add('ocultar');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguinete.classList.remove('ocultar');
    }

    mostrarSeccion();
}

const paginaAnterior = () => {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
       
        if (paso <= pasoInicial) return;
            
        paso--;

        botonesPaginador();
    })
}

const paginaSiguinete = () => {
    const paginaSiguinete = document.querySelector('#siguiente');
    paginaSiguinete.addEventListener('click', () => {
       
        if (paso >= pasoFinal) return;
            
        paso++;

        botonesPaginador();
    })

}

const consultarApi = async () => {
    try {
        const url = '/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }
}

const mostrarServicios = (servicios) => {
    servicios.forEach( servicio => {
        const {id, nombre, precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idservicio = id;
        servicioDiv.onclick = () => {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
        
    });
}

const seleccionarServicio = (servicio) => {
    const { id } = servicio;
    const { servicios } = cita;

    //Identificar ele elemento al que se le da click
    const divServicio = document.querySelector(`[data-idservicio="${id}"]`);

    //Comprobar si un servicio ya fue agregado
    if (servicios.some( agregado => agregado.id === id) ) {
        //Elimiarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');

    } else {
        //Agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
    //console.log(cita);
}

const idCliente = () => {
    cita.id = document.querySelector('#id').value;
}

const nombreCliente = () => {
     cita.nombre = document.querySelector('#nombre').value;
}

const seleccionarFecha = () => {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', (e) => {

        const dia = new Date(e.target.value).getUTCDay();

        if ( [6,0].includes(dia) ) {
            e.target.value = '';
            mostarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }
    })
}

const mostarAlerta = (mensaje, tipo, elemento, desaparece = true) => {

    //Previene que se genere mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        alertaPrevia.remove();
    }

    //scripting para crear la alerta 
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo)

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if (desaparece) {
        //Eliminar la alerta
        setTimeout( () => {
            alerta.remove();
        },3000);
    }

    
}

const seleccionarHora = () => {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', (e) => {
        
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];

        if (hora < 10 || hora > 18) {
            e.target.value = '';
            mostarAlerta('Hora no valida', 'error', '#paso-2');
        } else {
            cita.hora = e.target.value
        }
    })
}

const mostrarResumen = () => {
    const resumen = document.querySelector('.contenido-resumen');

    //Limpiar el contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if (Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostarAlerta('Faltan datos de servicios Fecha u Hora', 'error', '.contenido-resumen', false);

        return;
    }

    //Formatear el dic de resumen
    const {fecha, nombre, hora, servicios} = cita;

    //Heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';
    resumen.appendChild(headingServicios);

    //Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const {id, precio, nombre} = servicio;
        const ContenedorServicio = document.createElement('DIV');
        ContenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P')
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P')
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        ContenedorServicio.appendChild(textoServicio);
        ContenedorServicio.appendChild(precioServicio);

        resumen.appendChild(ContenedorServicio);
    })

    //Heading para servicios en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('p');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

     //Formatear la fecha en español
     const fechaObj = new Date(fecha);
     const mes = fechaObj.getMonth();
     const dia = fechaObj.getDate();
     const year = fechaObj.getFullYear();
 
     const fechaUTC = new Date(Date.UTC(year, mes, dia));
     
     const opciones = { wekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
     const fechaFormateada = fechaUTC.toLocaleDateString('es-CO', opciones);
 
    const fechaHora = document.createElement('p');
    fechaHora.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    const fechaCita = document.createElement('p');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    //Boton para Crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;
    

    resumen.appendChild(nombreCliente);
    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(fechaHora);

    resumen.appendChild(botonReservar);
}

const reservarCita = async () => {

    const { nombre, fecha, hora, servicios, id } = cita;

    const idServicios = servicios.map( servicio => servicio.id )

    const datos = new FormData();
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);

    //console.log([...datos]);

    try {
        // Petición hacia la API
    const url = '/api/citas';

    const respuesta = await fetch(url, {
        method: 'POST',
        body: datos
    });

    const resultado = await respuesta.json();
    console.log(resultado.resultado);

    if (resultado.resultado) {
        Swal.fire({
            icon: "success",
            title: "Cita Creada...",
            text: "Tu cita fue creada correctamanete",
            button: 'OK'
          }).then ( () => {
            setTimeout(() => {
                window.location.reload();
            }, 3000);
         
          })
    }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita",
          });
    }

    

    // console.log([...datos]);
};

