const mensajesDeError = {
  campoVacio: 'Complete los campos con valores válidos',
  valorInvalido: 'Ingrese un valor válido',
};

// Cargar historial desde localStorage
const cargarHistorial = () => {
  const historialGuardado = localStorage.getItem('historial');
  return historialGuardado ? JSON.parse(historialGuardado) : [];
};

const guardarHistorial = () => {
  localStorage.setItem('historial', JSON.stringify(historial));
};

const calcularIMC = (altura, peso) => parseFloat((peso / (altura * altura)).toFixed(2));

const clasificarIMC = (imc) =>
  imc < 18.5 ? 'Bajo de peso' :
  imc < 25 ? 'Peso normal' :
  imc < 30 ? 'Sobrepeso' :
  imc < 35 ? 'Obesidad grado I' :
  imc < 40 ? 'Obesidad grado II' :
  'Obesidad grado III';

const agregarCalculoAlHistorial = (altura, peso, imc, clasificacion) => {
  const fecha = new Date().toLocaleString();
  const calculo = { fecha, altura, peso, imc, clasificacion };
  historial.push(calculo);
  guardarHistorial();  // Guardar en localStorage
};

const calcularEstadisticas = () => {
  const imcPromedio = historial.reduce((total, calculo) => total + calculo.imc, 0) / historial.length;
  const personasConSobrepeso = historial.filter(calculo => calculo.clasificacion === 'Sobrepeso').length;
  return {
    promedioIMC: imcPromedio.toFixed(2),
    sobrepeso: personasConSobrepeso,
  };
};

const mostrarMensaje = (mensaje) => {
  resultado.innerHTML = mensaje;
};

const mostrarResultado = (imc, clasificacion) => {
  resultado.innerHTML = `IMC: ${imc} (${clasificacion})`;
};

const mostrarGrafico = () => {
  const ctx = document.getElementById('grafico').getContext('2d');
  const clasificaciones = ['Bajo de peso', 'Peso normal', 'Sobrepeso', 'Obesidad grado I', 'Obesidad grado II', 'Obesidad grado III'];
  const conteo = Array(clasificaciones.length).fill(0);

  // Contar las clasificaciones en el historial
  historial.forEach(calculo => {
    const index = clasificaciones.indexOf(calculo.clasificacion);
    if (index !== -1) conteo[index]++;
  });

  const datos = {
    labels: clasificaciones,
    datasets: [{
      label: 'Número de personas',
      data: conteo,
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const config = {
    type: 'bar',
    data: datos,
  };

  new Chart(ctx, config);
};

const historial = cargarHistorial();  // Cargar historial al inicio

const calcularIMCYMostrarResultado = () => {
  const alturaValor = parseFloat(document.querySelector('#altura').value.replace(',', '.'));
  const pesoValor = parseFloat(document.querySelector('#peso').value.replace(',', '.'));

  if (!isNaN(alturaValor) && !isNaN(pesoValor) && alturaValor > 0 && pesoValor > 0) {
    const imc = calcularIMC(alturaValor, pesoValor);
    const clasificacion = clasificarIMC(imc);
    agregarCalculoAlHistorial(alturaValor, pesoValor, imc, clasificacion);
    mostrarResultado(imc, clasificacion);
  } else {
    mostrarMensaje(mensajesDeError.valorInvalido);
  }
};

document.querySelector('#mostrarGrafico').addEventListener('click', mostrarGrafico);
