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
 
  // onClick(){
  //   const tmp:boolean=this.obj.borda
  //   // this.borda=!this.borda
  //   // alert(tmp)
  // }

onhover():void{
  if(this.srv.marcavel(this.obj))
     this.objazul = true
}
onleave():void{
  this.objazul = false
 }


  ngOnInit(): void {
    // const linha=Math.floor(this.obj.id / 9)
    // const coluna= this.obj.id%9
    // console.log(linha,coluna)
    // const condicao:boolean=(linha<3 || linha>5)&&(coluna<3||coluna>5)

    // if(condicao)
    // {
    //   this.est[9*linha+coluna] = 3
    //   this.srv.objArr[9*linha+coluna].estado=3
    //   // console.log("OK ",this.obj.estado)
    // } else {
    //   // this.obj.estado=1
    //   this.est[9*linha+coluna] = 1
    //   this.srv.objArr[9*linha+coluna].estado=1
    //   // console.log("NOK ",this.obj.estado)
    // }
    // // this.obj.estado=3
      // console.log("UUU ",this.est)
  }
}
