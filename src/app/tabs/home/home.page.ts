import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { NgModule } from '@angular/core';




@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


task: Task[] = [
  {
    id:'1',
    title: 'titulo',
    description:'texto texto text',
    items:[
      {name: 'Actividad 1',completed:true },
      {name: 'Actividad 2',completed:false },
      {name: 'Actividad 3',completed:false },
      {name: 'Actividad 4',completed:false },

    ]
  },
  {
    id:'2',
    title: 'titulo',
    description:'texto texto text',
    items:[
      {name: 'Actividad 1',completed:true },
      {name: 'Actividad 2',completed:false },
      {name: 'Actividad 3',completed:false },
      {name: 'Actividad 4',completed:false },
    ]
  },
  {
    id:'3',
    title: 'titulo',
    description:'texto texto text',
    items:[
      {name: 'Actividad 1',completed:true },
      {name: 'Actividad 2',completed:false },
      {name: 'Actividad 3',completed:false },
      {name: 'Actividad 4',completed:false },

    ]
  },
  {
    id:'4',
    title: 'titulo',
    description:'texto texto text',
    items:[
      {name: 'Actividad 1',completed:true },
      {name: 'Actividad 2',completed:false },
      {name: 'Actividad 3',completed:false },
      {name: 'Actividad 4',completed:false },

    ]
  },
]

  constructor() { }

  ngOnInit() {
  }

}
