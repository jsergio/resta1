import { StorageService } from './../../services/storage.service';
import { JogoService } from './../../services/jogo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-placar',
  templateUrl: './placar.component.html',
  styleUrls: ['./placar.component.css']
})
export class PlacarComponent implements OnInit {

  constructor(public srv:JogoService,
    public stg:StorageService) { }

  ngOnInit(): void {
  }

}
