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
const lotesDePersonas: CoordenadaAsiento[] = [
	[1, 1],
	[1, 2],
	[1, 3],
	[1, 4],
	[1, 5],
	[1, 6],
	[1, 7],
	[1, 8],
	[1, 9],
	[1, 10],
	[2, 1],
	[2, 2],
	[2, 3],
	[2, 4],
	[2, 5],
	[2, 6],
	[2, 7],
	[2, 8],
	[2, 9],
	[2, 10],
	[3, 1],
	[3, 2],
	[3, 3],
	[3, 4],
	[3, 5],
	[3, 6],
	[3, 7],
	[3, 8],
	[3, 9],
	[3, 10],
	[4, 1],
	[4, 2],
	[4, 3],
	[4, 4],
	[4, 5],
	[4, 6],
	[4, 7],
	[4, 8],
	[4, 9],
	[4, 10],
	[5, 1],
	[5, 2],
	[5, 3],
	[5, 4],
	[5, 5],
	[5, 6],
	[5, 7],
	[5, 8],
	[5, 9],
	[5, 10],
	[6, 1],
	[6, 2],
	[6, 3],
	[6, 4],
	[6, 5],
	[6, 6],
	[6, 7],
	[6, 8],
	[6, 9],
	[6, 10],
	[7, 1],
	[7, 2],
	[7, 3],
	[7, 4],
	[7, 5],
	[7, 6],
	[7, 7],
	[7, 8],
	[7, 9],
	[7, 10],
	[8, 1],
	[8, 2],
	[8, 3],
	[8, 4],
	[8, 5],
	[8, 6],
	[8, 7],
	[8, 8],
	[8, 9],
	[8, 10],
];

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

