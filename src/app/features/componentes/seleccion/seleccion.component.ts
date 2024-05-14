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

  public textoBusqueda: String = "";
  public selecciones: Seleccion[] = [];
  public columnas = [
    { name: "Selección", prop: "nombre" },
    { name: "Entidad", prop: "entidad" }
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  ngOnInit(): void {
    this.listar();
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
        }
      }
    );

  }
  modificar() {

  }
  verificarEliminar() {
    const dialogRef = this.servicioDialogo.open(DecidirComponent,
      {
        width: "300px",
        height: "200px",
        data: {
          encabezado: "Está seguro de eliminar la Selección",
          id: 0
        }
      }
    );
  }

}
