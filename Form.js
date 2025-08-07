const tituloPregunta = document.getElementById("tituloPregunta");
const formRespuestas = document.getElementById("formRespuestas");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnAtras = document.getElementById("btnAtras");
const progresoTexto = document.getElementById("progresoTexto");
const progresoBarra = document.getElementById("progresoBarra");

let indice = 0;
const total = preguntas.length;
const respuestasUsuario = Array(total).fill(null).map(() => []); // ← guarda arrays por cada pregunta

function cargarPregunta() {
  const pregunta = preguntas[indice];
  const opciones = respuestas.filter(r => r.preguntaId === pregunta.Id);
  const respuestasPrevias = respuestasUsuario[indice];

  tituloPregunta.textContent = `${indice + 1}. ${pregunta.title}`;
  formRespuestas.innerHTML = "";

  opciones.forEach((op, idx) => {
    const label = document.createElement("label");
    const idInput = `chk_${pregunta.id}_${idx}`;
    label.innerHTML = `
      <input type="checkbox" id="${idInput}" name="respuesta" value="${op.respuesta}"
        ${respuestasPrevias.includes(op.respuesta) ? "checked" : ""}>
      ${op.respuesta}
    `;
    formRespuestas.appendChild(label);
  });

  actualizarProgreso();
  actualizarBoton();
  btnAtras.classList.toggle("oculto", indice === 0);
}

function actualizarProgreso() {
  progresoTexto.textContent = `${indice + 1} de ${total}`;
  const porcentaje = Math.round(((indice + 1) / total) * 100);
  progresoBarra.value = porcentaje;
}

function actualizarBoton() {
  const algunoSeleccionado = [...formRespuestas.querySelectorAll("input[type='checkbox']")]
    .some(input => input.checked);
  btnSiguiente.disabled = !algunoSeleccionado;
}

formRespuestas.addEventListener("change", () => {
  actualizarBoton();
});

btnSiguiente.addEventListener("click", () => {
  const seleccionados = [...formRespuestas.querySelectorAll("input:checked")]
    .map(input => input.value);

  respuestasUsuario[indice] = seleccionados;

  if (indice < total - 1) {
    indice++;
    cargarPregunta();
  } else {
    mostrarResumen();
  }
});

btnAtras.addEventListener("click", () => {
  if (indice > 0) {
    const seleccionados = [...formRespuestas.querySelectorAll("input:checked")]
      .map(input => input.value);
    respuestasUsuario[indice] = seleccionados;
    indice--;
    cargarPregunta();
  }
});

function mostrarResumen() {
  document.getElementById("tituloPregunta").classList.add("oculto");
  formRespuestas.classList.add("oculto");
  btnSiguiente.classList.add("oculto");
  btnAtras.classList.add("oculto");
  progresoTexto.classList.add("oculto");
  progresoBarra.classList.add("oculto");

  const divResumen = document.getElementById("resumen");
  const listaResumen = document.getElementById("listaResumen");
  listaResumen.innerHTML = "";

  preguntas.forEach((preg, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${preg.title}</strong>: ${respuestasUsuario[i].join(", ") || "Sin respuesta"}`;
    listaResumen.appendChild(li);
  });

  divResumen.classList.remove("oculto");
}

document.getElementById("btnReiniciar").addEventListener("click", () => {
  indice = 0;
  respuestasUsuario.forEach((_, i) => respuestasUsuario[i] = []);
  document.getElementById("resumen").classList.add("oculto");

  document.getElementById("tituloPregunta").classList.remove("oculto");
  formRespuestas.classList.remove("oculto");
  btnSiguiente.classList.remove("oculto");
  progresoTexto.classList.remove("oculto");
  progresoBarra.classList.remove("oculto");

  cargarPregunta();
});

cargarPregunta();
