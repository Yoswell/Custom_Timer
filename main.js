var canvas = document.querySelector( 'canvas' );
var context = canvas.getContext( '2d' );

var time = 0,
    velocity = 0.1,
    velocityTarget = 0.1,
    width,
    height,
    lastX,
    lastY;

var MAX_OFFSET = 400;
var SPACING = 4;
var POINTS = MAX_OFFSET / SPACING;
var PEAK = MAX_OFFSET * 0.25;
var POINTS_PER_LAP = 6;
var SHADOW_STRENGTH = 6;

setup();

function setup() {

  resize();
  step();
  
  window.addEventListener( 'resize', resize );
  window.addEventListener( 'mousedown', onMouseDown );
  document.addEventListener( 'touchstart', onTouchStart );
  
}

function resize() {

  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  
}

function step() {
  
  time += velocity;
  velocity += ( velocityTarget - velocity ) * 0.3;
  
  clear();
  render();
  
  requestAnimationFrame( step );
  
}

function clear() {
  
  context.clearRect( 0, 0, width, height );

}

function render() {
  var x, y,
      cx = width / 2,
      cy = height / 2;

  context.globalCompositeOperation = 'lighter';
  context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--spiral-color').trim();
  context.shadowColor = getComputedStyle(document.documentElement).getPropertyValue('--spiral-color').trim();
  context.lineWidth = 2;
  context.beginPath();

  for( var i = POINTS; i > 0; i -- ) {
    var value = i * SPACING + ( time % SPACING );
    
    var ax = Math.sin( value/POINTS_PER_LAP ) * Math.PI,
        ay = Math.cos( value/POINTS_PER_LAP ) * Math.PI;

    x = ax * value,
    y = ay * value * 0.1;
    
    var o = 1 - ( Math.min( value, PEAK ) / PEAK );
    
    y -= Math.pow( o, 2 ) * 200;
    y += 500 * value / MAX_OFFSET;
    y += x / cx * width * 0.1;
    
    context.globalAlpha = 1 - ( value / MAX_OFFSET );
    context.shadowBlur = SHADOW_STRENGTH * o;
  
    context.lineTo( cx + x, cy + y );
    context.stroke();
 
    context.beginPath();
    context.moveTo( cx + x, cy + y );
  }

  context.lineTo( cx, cy - 200 );
  context.lineTo( cx, 0 );
  context.stroke(); 
}

function onMouseDown( event ) {
  lastX = event.clientX;
  lastY = event.clientY;
  
  document.addEventListener( 'mousemove', onMouseMove );
  document.addEventListener( 'mouseup', onMouseUp );
}

function onMouseMove( event ) {
  var vx = ( event.clientX - lastX ) / 100;
  var vy = ( event.clientY - lastY ) / 100;
  
  if( event.clientY < height/2 ) vx *= -1;
  if( event.clientX > width/2 ) vy *= -1;
  
  velocityTarget = vx + vy;
  
  lastX = event.clientX;
  lastY = event.clientY; 
}

function onMouseUp( event ) {
  document.removeEventListener( 'mousemove', onMouseMove );
  document.removeEventListener( 'mouseup', onMouseUp );
}

function onTouchStart( event ) {
  event.preventDefault();
  
  lastX = event.touches[0].clientX;
  lastY = event.touches[0].clientY;
  
  document.addEventListener( 'touchmove', onTouchMove );
  document.addEventListener( 'touchend', onTouchEnd );
}

function onTouchMove( event ) {
  var vx = ( event.touches[0].clientX - lastX ) / 100;
  var vy = ( event.touches[0].clientY - lastY ) / 100;
  
  if( event.touches[0].clientY < height/2 ) vx *= -1;
  if( event.touches[0].clientX > width/2 ) vy *= -1;
  
  velocityTarget = vx + vy;
  
  lastX = event.touches[0].clientX;
  lastY = event.touches[0].clientY;
}

function onTouchEnd( event ) {
  document.removeEventListener( 'touchmove', onTouchMove );
  document.removeEventListener( 'touchend', onTouchEnd );
}

const fileInput1 = document.getElementById('fileInput1');
const imagePreview1 = document.getElementById('imagePreview1');

fileInput1.addEventListener('change', function(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview1.innerHTML = `<img src="${e.target.result}" alt="Imagen subida">`;
    };
    reader.readAsDataURL(file);
  }
});

const fileInput2 = document.getElementById('fileInput2');
const imagePreview2 = document.getElementById('imagePreview2');

fileInput2.addEventListener('change', function(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview2.innerHTML = `<img src="${e.target.result}" alt="Imagen subida">`;
    };
    reader.readAsDataURL(file);
  }
});

const fileInput3 = document.getElementById('fileInput3');
const imagePreview3 = document.getElementById('back-preview');

fileInput3.addEventListener('change', function(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview3.innerHTML = `<img src="${e.target.result}" alt="Imagen subida">`;
    };
    reader.readAsDataURL(file);
  }
});

function mostrarHora() {
    const fecha = new Date();
    const horaUtc6 = fecha.toLocaleString('es-CR', { 
        timeZone: 'America/Costa_Rica', 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
  });
  document.getElementById('hour').innerHTML = horaUtc6;
}

mostrarHora();
setInterval(mostrarHora, 1000);

document.getElementById('settings').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.edit-cont').style.display = 'grid';
});

document.getElementById('settings-close').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.edit-cont').style.display = 'none';
});

let timerInterval; // Intervalo global
let totalSeconds = 0; // Tiempo total en segundos
let isPaused = false; // Control para saber si está en pausa

// Botón de PLAY
document.getElementById('play-timer').addEventListener('click', () => {
    // Si ya se pausó antes, no recalcular totalSeconds
    if (!isPaused) {
        // Obtener valores de los inputs solo si el temporizador no ha iniciado
        const horas = parseInt(document.getElementById('hora-input').value) || 0;
        const minutos = parseInt(document.getElementById('minutes-input').value) || 0;
        const segundos = parseInt(document.getElementById('segundos-input').value) || 0;
        totalSeconds = (horas * 3600) + (minutos * 60) + segundos; // Calcular tiempo total
    }
    isPaused = false; // Cambiar el estado de pausa
    clearInterval(timerInterval); // Limpiar cualquier temporizador previo
    iniciarTemporizador(); // Iniciar el temporizador
});

// Botón de PAUSE
document.getElementById('pause-timer').addEventListener('click', () => {
    isPaused = true; // Cambiar el estado de pausa
    clearInterval(timerInterval); // Detener el intervalo
});

// Función para iniciar el temporizador
function iniciarTemporizador() {
    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval); // Detener el temporizador si llega a 0
        } else {
            totalSeconds--; // Decrementar el tiempo
            // Convertir segundos a formato de horas:minutos:segundos
            const hrs = Math.floor(totalSeconds / 3600);
            const mins = Math.floor((totalSeconds % 3600) / 60);
            const secs = totalSeconds % 60;
            // Mostrar el tiempo en el formato HH:MM:SS
            document.getElementById('time1').textContent = String(hrs).padStart(2, '0');
            document.getElementById('time2').textContent = String(mins).padStart(2, '0');
            document.getElementById('time3').textContent = String(secs).padStart(2, '0');
        }
    }, 1000);
}

document.getElementById('btn-increment-hour').addEventListener('click', () =>  {
    document.getElementById('hora-input').stepUp(); 
});

document.getElementById('btn-decrement-hour').addEventListener('click', () =>  {
    document.getElementById('hora-input').stepDown(); 
});

document.getElementById('btn-increment-min').addEventListener('click', () =>  {
  document.getElementById('minutes-input').stepUp(); 
});

document.getElementById('btn-decrement-min').addEventListener('click', () =>  {
  document.getElementById('minutes-input').stepDown(); 
});

document.getElementById('btn-increment-seg').addEventListener('click', () =>  {
  document.getElementById('segundos-input').stepUp(); 
});

document.getElementById('btn-decrement-seg').addEventListener('click', () =>  {
  document.getElementById('segundos-input').stepDown(); 
});

function updateText(inputId, textId) {
  const inputElement = document.getElementById(inputId);
  const textElement = document.getElementById(textId);

  inputElement.addEventListener('input', function() {
      textElement.textContent = inputElement.value;
  });
}

// Llamamos a la función para cada par de elementos
updateText('editText1', 'text1');
updateText('editText2', 'text2');
updateText('editText3', 'text3');
updateText('editText4', 'text4');

const colorPicker1 = document.getElementById('color1');

colorPicker1.addEventListener('input', (event) => {
    const color = event.target.value;
    document.documentElement.style.setProperty('--third-color', color);
});

const colorPicker2 = document.getElementById('color2');

colorPicker2.addEventListener('input', (event) => {
    const color = event.target.value;
    document.documentElement.style.setProperty('--icon-color', color);
});

const colorPicker3 = document.getElementById('color3');

colorPicker3.addEventListener('input', (event) => {
    const color = event.target.value;
    document.documentElement.style.setProperty('--border-color', color);
});

const colorPicker4 = document.getElementById('color4');

colorPicker4.addEventListener('input', (event) => {
    const color = event.target.value;
    document.documentElement.style.setProperty('--back-color', color);
});

const colorPicker5 = document.getElementById('color5');

colorPicker5.addEventListener('input', (event) => {
    const color = event.target.value;
    document.documentElement.style.setProperty('--eight-color', color);
});
