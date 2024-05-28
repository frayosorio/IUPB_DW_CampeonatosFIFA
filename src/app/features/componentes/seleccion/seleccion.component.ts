import { Component, OnInit } from '@angular/core';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { FormsModule } from '@angular/forms';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { Seleccion } from '../../../core/entidades/Seleccion';
import { SeleccionService } from '../../servicios/seleccion.service';
import { MatDialog } from '@angular/material/dialog';
import { SeleccionEditarComponent } from '../seleccion-editar/seleccion-editar.component';
import { DecidirComponent } from '../decidir/decidir.component';

@Component({
  selector: 'app-seleccion',
  standalone: true,
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgxDatatableModule
  ],
  templateUrl: './seleccion.component.html',
  styleUrl: './seleccion.component.css'
})
export class SeleccionComponent implements OnInit {

  constructor(private servicio: SeleccionService,
    private servicioDialogo: MatDialog
  ) {
  }

  public textoBusqueda: string = "";
  public selecciones: Seleccion[] = [];
  public columnas = [
    { name: "Selección", prop: "nombre" },
    { name: "Entidad", prop: "entidad" }
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  public seleccionEscogida: Seleccion | undefined;
  public indiceSeleccionEscogida: number = -1;

  ngOnInit(): void {
    this.listar();
  }

  escoger(event: any) {
    if (event.type == "click") {
      this.seleccionEscogida = event.row;
      this.indiceSeleccionEscogida = this.selecciones.findIndex(seleccion => seleccion === this.seleccionEscogida);
    }
  }

  listar() {
    this.servicio.listar().subscribe({
      next: response => {
        this.selecciones = response;
      },
      error: error => {
        window.alert(error.message);
      }
    });
  }
  buscar() {
    if (this.textoBusqueda.length == 0) {
      this.listar();
    }
    else {
      this.servicio.buscar(this.textoBusqueda).subscribe({
        next: response => {
          this.selecciones = response;
        },
        error: error => {
          window.alert(error.message);
        }
      });
    }
  }
  agregar() {
    const dialogRef = this.servicioDialogo.open(SeleccionEditarComponent,
      {
        width: "400px",
        height: "300px",
        data: {
          seleccion: {
            id: 0,
            nombre: "",
            entidad: ""
          },
          encabezado: "Agregando una Selección",
        },
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe({
      next: datos => {
        if (datos) {
          this.servicio.agregar(datos.seleccion).subscribe({
            next: response => {
              this.servicio.buscar(datos.seleccion.nombre).subscribe({
                next: response => {
                  this.selecciones = response;
                },
                error: error => {
                  window.alert(error.message);
                }
              });
            },
            error: error => {
              window.alert(error.message);
            }
          });
        }
      }
    });
  }
  modificar() {
    if (this.seleccionEscogida) {
      const dialogRef = this.servicioDialogo.open(SeleccionEditarComponent,
        {
          width: "400px",
          height: "300px",
          data: {
            seleccion: this.seleccionEscogida,
            encabezado: `Editando selección [${this.seleccionEscogida.nombre}]`,
          },
          disableClose: true,
        }
      );
      dialogRef.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.servicio.modificar(datos.seleccion).subscribe({
              next: response => {
                this.selecciones[this.indiceSeleccionEscogida] = response;
              },
              error: error => {
                window.alert(error.message);
              }
            });
          }
        }
      });
    }
    else {
      window.alert("Debe seleccionar una Selección de la lista");
    }
  }
  verificarEliminar() {
    if (this.seleccionEscogida) {
      const dialogRef = this.servicioDialogo.open(DecidirComponent,
        {
          width: "300px",
          height: "200px",
          data: {
            encabezado: "Está seguro de eliminar la Selección",
            id: this.seleccionEscogida.id
          },
          disableClose: true,
        }
      );

      dialogRef.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.servicio.eliminar(datos.id).subscribe({
              next: response => {
                if (response) {
                  this.listar();
                  window.alert("Selección retirada con éxito");
                }
                else {
                  window.alert("No se pudo retirar la Selección");
                }
              },
              error: error => {
                window.alert(error.message);
              }
            });
          }
        }
      });

    }
    else {
      window.alert("Debe seleccionar una Selección de la lista");
    }
  }

}
