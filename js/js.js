'use strict'

//Variables globales
var respuestaImagenes;
var numPagina = 0;
const IMAGENES_POR_PAGINA = 8;

//apiKey para utilizar la API de imágenes
var apiKey = '5f362672-adaf-46da-bddf-d985b0f952bb';


//Función para realizar las peticionas AJAX
function datos_JSON(url){
    const json_recibido = new Promise (function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('x-api-key', apiKey);
        xhr.onload = function(){
            if(xhr.status == 200 && xhr.readyState == 4){
                resolve(xhr.response);
            }
            else{
                reject(xhr.status);
            }
        };
        xhr.send();
    });
    return json_recibido;
}


//Petición AJAX al archivo db.json de categorias
//var urlCategorias = 'http://localhost:3000/categorias';
var urlCategorias = 'https://my-json-server.typicode.com/DWEC-18-19/TheCatApi/categorias';
datos_JSON(urlCategorias).then(function(json_recibido){
    //Llamamos a la función que muestra el select de categorías
    crearCategorias(json_recibido);
});


//Función para crear el select de las categorías
function crearCategorias(json_recibido){
    //Seleccionamos el elemento categorías
    var categorias = document.getElementById('categorias');
    //Creamos el elemento select
    var select = document.createElement('select');
    var option = document.createElement('option');
    option.setAttribute('value', '');
    option.textContent = 'Seleccionar categoria...';
    select.appendChild(option);
    categorias.appendChild(select);

    //Recorremos los objetos del array de Categorías
    for(var i = 0; i<json_recibido.length; i++){
        //Creamos el elemento option
        var option = document.createElement('option');
        //Asignamos el nombre de cada categoría
        option.textContent += json_recibido[i].name;
        //Asignamos el atributo value con el id de cada categoría
        option.setAttribute('value', json_recibido[i].id);
        
        //Añadimos evento click a cada opción
        option.addEventListener('click', seleccionarCategoria, false);
        
        //Añadimos el elemento option al elemento select creado previamente
        select.appendChild(option);                
    } 
}


//Funcion para seleccionar una categoría
function seleccionarCategoria(e){
    //Guardamos en una variable el id de la categoría seleccionada
    var id = e.target.getAttribute('value');

    //Guardamos en una variable la url de la API para filtrar por categoría
    //Además, añadimos el parámetro limit=50 para coger 50 imágenes
    var urlGatos = "https://api.thecatapi.com/v1/images/search?category_ids=" + id + "&limit=50";

    //Petición AJAX a la API de las imágenes
    datos_JSON(urlGatos).then(function(response){
        //Guardamos la respuesta en una variable global
        respuestaImagenes = response;
        //Incializamos el número de la página a 1
        numPagina = 1;
        //Llamamos a la función que muestra la paginación
        mostrarPaginacion();
        //Llamamos a la función que muestra las imágenes de la categoría seleccionada
        mostrarImagenes();
    });
}


//Funcion para mostrar las imágenes,
function mostrarImagenes(){
    //Seleccionamos el div de imagen
    var imagen = document.getElementById('imagen');
    //Vacíamos el div de imágenes
    imagen.textContent='';

    //Creamos un bucle de 8 iteraciones, que son las imágenes por página que se mostrarán
    for(var i = 0; i<IMAGENES_POR_PAGINA; i++){
        //Guardamos en una variable las posiciones de las imagenes del array que mostraremos
        var posicionImagen = (numPagina-1) * IMAGENES_POR_PAGINA + i;
        console.log(posicionImagen);

        if (posicionImagen >= respuestaImagenes.length) break;

        //Creamos elemento img
        var nueva = document.createElement('img');
        //Añadimos el atributo src con la url de la imagen de la posición en la que esté
        nueva.setAttribute('src', respuestaImagenes[posicionImagen]['url']);
        //Añadimos el atributo class
        nueva.setAttribute('class', 'imagen');
       
        //Añadimos las imágenes al div
        imagen.appendChild(nueva);        
    }
}


//Función para mostrar la paginacion
function mostrarPaginacion(){
    //Seleccionamos el elemento de paginacion y lo mostramos
    var pagina = document.getElementById('paginacion');
    pagina.style.display = 'block';
    
    //Seleccionamos el input posterior
    var inputPosterior = document.getElementById('posterior');
    
    //Inicializamos la variable cont a 0
    var cont = 0;
    
    //Seleccionamos las páginas
    var classNumPage = document.getElementsByClassName('numPag');

    //Borramos las páginas creadas para que al seleccionar otra categoría no se dupliquen
    for(var k = 0; k<classNumPage.length; k){
        classNumPage[k].remove();
    }

    //Recorremos el array de imágenes cada 8 elementos
    for(var i=0; i<respuestaImagenes.length; i += IMAGENES_POR_PAGINA){
        //Creamos las páginas
        var numPag = document.createElement('input');
        numPag.setAttribute('type', 'button');
        numPag.setAttribute('class', 'numPag');
        //Sumamos uno al atributo value
        numPag.setAttribute('value', ++cont);
        //Añadimos la nueva página antes del input posterior
        pagina.insertBefore(numPag, inputPosterior);
    }
    
    //Asignamos evento a cada página
    for (var j = 0; j<classNumPage.length; j++){
        classNumPage[j].addEventListener('click', seleccionarPagina, false);
    }
    
    //Asiganamos eventos a los botones de la paginación anterior y posterior
    document.getElementById('anterior').addEventListener('click', anterior, false);
    document.getElementById('posterior').addEventListener('click', posterior, false);
}

function seleccionarPagina(e){
    //Guardamos el numero de la página seleccionada
    numPagina = e.target.getAttribute('value');
    //Llamamos a la función para mostrar las imágenes de la página seleccionada
    mostrarImagenes();
}


//Funcion para ir a la página anterior
function anterior(){
    //Si el numero de la página es mayor que 1
    if (numPagina > 1)
    {
        //restamos 1 a la página
        numPagina--;
    }
    //Mostramos las imágenes
    mostrarImagenes();
}


//Funcion para ir a la página siguiente
function posterior(){
    //Si el número de la página es menor que el número de páginas totales
    if(numPagina < respuestaImagenes.length/IMAGENES_POR_PAGINA)
    {
        //Sumamos 1 a la página
        numPagina++;
    }
    //Mostramos las imágenes
    mostrarImagenes();
}