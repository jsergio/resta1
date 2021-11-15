import { JogoService } from './../../services/jogo.service';
import { Component, OnInit, Input  } from '@angular/core';

export interface Peca{
  id:number,
  url:string,
  stat:number,
  estado:number,
  borda:boolean
}
@Component({
  selector: 'app-peca',
  templateUrl: './peca.component.html',
  styleUrls: ['./peca.component.css']
})
export class PecaComponent implements OnInit {
  @Input() linha=0
  @Input() coluna=0
  @Input() obj:Peca=
    {
      id:0,
      url:'assets/img/peca1C.png',
      stat:1,
      estado:0,
      borda:false
    }
    
  objazul:boolean=false
  // borda:boolean=false
  est:number[]=[]
  
  // obj:Peca={
  // id:[0,0],
  // url:'assets/img/peca1C.png',
  // stat:2
  // }
  
  constructor(public srv:JogoService) { }
 
  onclick(){
    if(this.srv.marcavel(this.obj))
        this.objazul = true
    // this.borda=!this.borda
    // alert(tmp)
  }

onhover():void{
  if(this.srv.marcavel(this.obj))
     this.objazul = true
}
onleave():void{
  // if(this.srv.marcavel(this.obj))
      this.objazul = false
 }

  ngOnInit(): void {}
}
