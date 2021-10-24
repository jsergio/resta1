// import { StorageService } from './../../services/storage.service';
import { JogoService } from '../../services/jogo.service';
import { Component, OnInit } from '@angular/core';
// import { AnyRecord } from 'dns';

export interface Peca{
  id?:number,
  url:string,
  stat:number,
  estado:number,
  borda:boolean
}

// export enum KEY_CODE {
//   RIGHT_ARROW = 39,
//   LEFT_ARROW = 37
// }


@Component({
  selector: 'app-tela',
  templateUrl: './tela.component.html',
  styleUrls: ['./tela.component.css']
})

export class TelaComponent implements OnInit {

  indice:number=-1

    
  constructor(public srv: JogoService) { }
  
  onclick(ind:number){
    this.srv.jogada(ind)
  }

onkeydown(e:KeyboardEvent){
  console.log(e.code)
  if(e.code==='ArrowLeft')
    this.srv.desjoga(0)
  if(e.code==='ArrowRight')
    this.srv.desjoga(1)
  if(e.code==='ArrowUp')
  {
    // console.log('Aqui')
    this.srv.iniciojogo(1)    
  }
  if(e.code==='ArrowDown')
  {
    // console.log('Aqui')
    this.srv.iniciojogo(0)    
  }
  if(e.code==='Digit0')
  {
    // console.log('Aqui')
    this.srv.pegamelhor()    
  }
  if(e.code==='Digit1')
  {
     console.log('Muito Bom',this.srv.pilhajogadas)
  }
    // console.log('OK')
  // console.log('OK De Novo',e.code)
}

onrover(i:number){
  this.indice=i;
}

ngOnInit(): void {
  // const cont=document.getElementsByName('cont')
  document.addEventListener('keydown', ev => this.onkeydown(ev))
  this.srv.iniciar()
  // console.log(typeof(document),cont)
}
}
