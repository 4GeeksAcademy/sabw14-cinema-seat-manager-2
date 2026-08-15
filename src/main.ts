import "./style.css";

let filas = 8;
let columnas = 10;

function inicializarMatrizAsientos(filas: number, columnas: number): number[][] {
	const matriz: number[][] = [];

	for (let i = 0; i < filas; i++) {
		const fila: number[] = [];
		for (let j = 0; j < columnas; j++) {
			fila.push(0);
		}
		matriz.push(fila);
	}

	return matriz;
}

function reservarAsiento(matriz: number[][], numeroFila: number, numeroColumna: number): boolean {
	const fila = numeroFila - 1;
	const columna = numeroColumna - 1;

	if (fila < 0 || fila >= filas) {
		return false;
	}

	if (columna < 0 || columna >= columnas) {
		return false;
	}

	if (matriz[fila][columna] === 1) {
		return false;
	}

	matriz[fila][columna] = 1;
	return true;
}

function contarAsientos(matriz: number[][]): { ocupados: number; disponibles: number } {
	let ocupados = 0;
	let disponibles = 0;

	for (let i = 0; i < matriz.length; i++) {
		for (let j = 0; j < matriz[i].length; j++) {
			if (matriz[i][j] === 1) {
				ocupados++;
			} else {
				disponibles++;
			}
		}
	}

	return { ocupados, disponibles };
}

function mostrarEstadoSala(matriz: number[][]): void {
	let encabezado = "    ";
	for (let c = 1; c <= columnas; c++) {
		encabezado += `${String(c).padStart(2, " ")} `;
	}
	console.log(encabezado.trimEnd());

	for (let i = 0; i < matriz.length; i++) {
		let filaVisual = `F${String(i + 1).padStart(2, "0")} `;
		for (let j = 0; j < matriz[i].length; j++) {
			filaVisual += matriz[i][j] === 1 ? " X " : " L ";
		}
		console.log(filaVisual.trimEnd());
	}
}

function buscarDosAsientosLibresContiguos(
	matriz: number[][],
): { fila: number; columnaInicio: number; columnaFin: number } | null {
	for (let i = 0; i < matriz.length; i++) {
		for (let j = 0; j < matriz[i].length - 1; j++) {
			if (matriz[i][j] === 0 && matriz[i][j + 1] === 0) {
				return {
					fila: i + 1,
					columnaInicio: j + 1,
					columnaFin: j + 2,
				};
			}
		}
	}

	return null;
}

type CoordenadaAsiento = [number, number];

function estaEnRango(numeroFila: number, numeroColumna: number): boolean {
	return numeroFila >= 1 && numeroFila <= filas && numeroColumna >= 1 && numeroColumna <= columnas;
}

function procesarLotesDePersonas(matriz: number[][], lotes: CoordenadaAsiento[]): void {
	if (lotes.length === 0) {
		console.log("No llegaron personas. La sala queda vacia.");
		return;
	}

	console.log("\nProcesando llegadas:");
	for (let i = 0; i < lotes.length; i++) {
		const [fila, columna] = lotes[i];
		const enRango = estaEnRango(fila, columna);
		const yaOcupado = enRango ? matriz[fila - 1][columna - 1] === 1 : false;
		const reservado = reservarAsiento(matriz, fila, columna);
		console.log(
			`- [${fila}, ${columna}] -> en rango: ${enRango}, reservado: ${reservado}, ya ocupado: ${yaOcupado}`,
		);
	}
}

const sala = inicializarMatrizAsientos(filas, columnas);

// Solo edita este bloque para simular personas que llegan.
// Si lo dejas vacio ([]), la sala se mantiene completamente libre (todo en L).
const lotesDePersonas: CoordenadaAsiento[] = [];

const enNavegador = typeof document !== "undefined";
const seatGrid = enNavegador ? document.querySelector<HTMLDivElement>("#seat-grid") : null;
const ocupadosEl = enNavegador ? document.querySelector<HTMLParagraphElement>("#ocupados") : null;
const disponiblesEl = enNavegador ? document.querySelector<HTMLParagraphElement>("#disponibles") : null;
const sugerenciaEl = enNavegador ? document.querySelector<HTMLParagraphElement>("#sugerencia") : null;
const mensajeEl = enNavegador ? document.querySelector<HTMLParagraphElement>("#mensaje") : null;

function actualizarPanel(matriz: number[][]): void {
	if (!ocupadosEl || !disponiblesEl || !sugerenciaEl) {
		return;
	}

	const resumen = contarAsientos(matriz);
	ocupadosEl.textContent = String(resumen.ocupados);
	disponiblesEl.textContent = String(resumen.disponibles);

	const par = buscarDosAsientosLibresContiguos(matriz);
	if (par) {
		sugerenciaEl.textContent = `Par recomendado: fila ${par.fila}, columnas ${par.columnaInicio} y ${par.columnaFin}.`;
	} else {
		sugerenciaEl.textContent = "No hay asientos contiguos disponibles.";
	}
}

function actualizarMensaje(texto: string): void {
	if (!mensajeEl) {
		return;
	}

	mensajeEl.textContent = texto;
}

function crearEncabezados(contenedor: HTMLDivElement): void {
	contenedor.style.gridTemplateColumns = `repeat(${columnas + 1}, minmax(0, 1fr))`;

	const esquina = document.createElement("div");
	esquina.className = "text-center text-[10px] font-semibold uppercase tracking-widest text-slate-300/60";
	esquina.textContent = "F/C";
	contenedor.appendChild(esquina);

	for (let columna = 1; columna <= columnas; columna++) {
		const celdaColumna = document.createElement("div");
		celdaColumna.className = "text-center text-xs font-bold text-slate-200";
		celdaColumna.textContent = String(columna);
		contenedor.appendChild(celdaColumna);
	}
}

function crearBotonAsiento(numeroFila: number, numeroColumna: number, ocupado: boolean): HTMLButtonElement {
	const boton = document.createElement("button");
	boton.type = "button";
	boton.textContent = ocupado ? "X" : "L";
	boton.dataset.fila = String(numeroFila);
	boton.dataset.columna = String(numeroColumna);
	boton.className = [
		"h-9 rounded-lg border text-sm font-extrabold transition",
		ocupado
			? "cursor-not-allowed border-amber-200/40 bg-amber-300 text-amber-950"
			: "border-emerald-200/40 bg-emerald-300/90 text-emerald-950 hover:-translate-y-0.5 hover:bg-emerald-200",
	].join(" ");
	boton.disabled = ocupado;

	return boton;
}

function renderizarSala(matriz: number[][]): void {
	if (!seatGrid) {
		return;
	}

	seatGrid.innerHTML = "";
	crearEncabezados(seatGrid);

	for (let fila = 1; fila <= filas; fila++) {
		const etiquetaFila = document.createElement("div");
		etiquetaFila.className = "self-center text-center text-xs font-bold text-slate-200";
		etiquetaFila.textContent = `F${String(fila).padStart(2, "0")}`;
		seatGrid.appendChild(etiquetaFila);

		for (let columna = 1; columna <= columnas; columna++) {
			const ocupado = matriz[fila - 1][columna - 1] === 1;
			const boton = crearBotonAsiento(fila, columna, ocupado);
			boton.addEventListener("click", () => {
				const exito = reservarAsiento(matriz, fila, columna);
				if (exito) {
					actualizarMensaje(`Reserva confirmada: fila ${fila}, columna ${columna}.`);
				} else {
					actualizarMensaje(`No se pudo reservar fila ${fila}, columna ${columna}.`);
				}
				actualizarPanel(matriz);
				renderizarSala(matriz);
			});
			seatGrid.appendChild(boton);
		}
	}
}

function iniciarAplicacion(): void {
	if (!enNavegador) {
		return;
	}

	if (!seatGrid || !ocupadosEl || !disponiblesEl || !sugerenciaEl || !mensajeEl) {
		return;
	}

	procesarLotesDePersonas(sala, lotesDePersonas);
	actualizarPanel(sala);
	renderizarSala(sala);
	actualizarMensaje("Selecciona un asiento libre para reservar.");
}

if (enNavegador) {
	iniciarAplicacion();
} else {
	console.log("Estado inicial de la sala:");
	mostrarEstadoSala(sala);

	procesarLotesDePersonas(sala, lotesDePersonas);

	console.log("\nEstado final de la sala:");
	mostrarEstadoSala(sala);

	const resumen = contarAsientos(sala);
	console.log("\nResumen:", resumen);

	const asientosContiguos = buscarDosAsientosLibresContiguos(sala);
	if (asientosContiguos) {
		console.log(
			`Primer par contiguo libre: fila ${asientosContiguos.fila}, columnas ${asientosContiguos.columnaInicio} y ${asientosContiguos.columnaFin}`,
		);
	} else {
		console.log("No hay asientos contiguos disponibles.");
	}
}

