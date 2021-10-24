import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export interface Peca {
  id: number,
  url: string,
  stat: number,
  estado: number,
  borda: boolean
}

/*
estado == 1 peca
estado == 3 sem imgem
estado == 2 buraco
*/


@Injectable({
  providedIn: 'root'
})

export class JogoService {

  numpecas:number=44
  direcao:string='nenhuma'
  strpeca: string = 'assets/img/peca1C.png'
  strvazio: string = 'assets/img/pecax2.png'
  terminou:boolean=false

  objArr: Peca[] = [] //this.criaObjArr()

  pilhajogadas:any[]=[] //[{id:0,direcao:'nenhuma'}]
  pilhasalvas:any[]=[]
  
  melhor:number=44

  pilhamelhor:any[]=[
  {id: 40, direcao: 'esq'},
  {id: 41, direcao: 'baixo'},
  {id: 23, direcao: 'baixo'},
  {id: 5, direcao: 'dir'},
  {id: 32, direcao: 'cima'},
  {id: 14, direcao: 'cima'},
  {id: 23, direcao: 'baixo'},
  {id: 14, direcao: 'dir'},
  {id: 32, direcao: 'baixo'},
  {id: 23, direcao: 'dir'},
  {id: 41, direcao: 'baixo'},
  {id: 32, direcao: 'esq'},
  {id: 34, direcao: 'cima'},
  {id: 33, direcao: 'esq'},
  {id: 35, direcao: 'cima'},
  {id: 34, direcao: 'dir'},
  {id: 33, direcao: 'esq'},
  {id: 32, direcao: 'dir'},
  {id: 31, direcao: 'esq'},
  {id: 42, direcao: 'dir'},
  {id: 33, direcao: 'cima'},
  {id: 30, direcao: 'dir'},
  {id: 32, direcao: 'dir'},
  {id: 31, direcao: 'esq'},
  {id: 40, direcao: 'cima'},
  {id: 49, direcao: 'baixo'},
  {id: 28, direcao: 'cima'},
  {id: 29, direcao: 'dir'},
  {id: 27, direcao: 'cima'},
  {id: 30, direcao: 'cima'},
  {id: 28, direcao: 'esq'},
  {id: 29, direcao: 'dir'},
  {id: 48, direcao: 'cima'},
  {id: 46, direcao: 'esq'},
  {id: 47, direcao: 'baixo'},
  {id: 48, direcao: 'dir'},
  {id: 50, direcao: 'dir'},
  {id: 41, direcao: 'cima'},
  {id: 66, direcao: 'esq'},
  {id: 57, direcao: 'cima'},
  {id: 75, direcao: 'esq'}
]
  pilhafiltrada:any[]=[]
  
  objant: Peca= {
    id: 0,
    url: '',
    stat: 0,
    estado: 0,
    borda: false
  } //this.objArr[0]

  constructor(private stg: StorageService) { }

  iniciar(){
    this.melhor = this.stg.get('melhorresta')
    this.numpecas = 44
    this.objArr = this.criaObjArr()
  }

  gravapilha(p:any):boolean{
    // const obj={"melhorjogo",p}
    if(this.stg.remove('melhorjogo')){
      console.log('MelhorJogo Removido!')
    }
    if(this.stg.remove('melhorresta')){
      console.log('Restamelhor Removido!')
    }

    if(this.stg.set('melhorjogo',p)){
      console.log('MelhorJogo',JSON.stringify(p),p.length)
      if(this.stg.set('melhorresta',this.melhor)){
        console.log('MelhorResta',this.melhor)
      }
      return true
    }
    return false
  }

  criaObjArr(): Peca[] {

    const tmp: Peca[] = []
    let lin: number = 0
    let col: number = 0
    let cond: boolean = false
    for (let i = 0; i < 81; i++) {
      lin = Math.floor(i / 9)
      col = i % 9
      cond = (lin < 3 || lin > 5) && (col < 3 || col > 5)
      const obj: Peca = {
        id: i,
        url: this.strpeca,
        stat: 0,
        estado: cond ? 3 : 0,
        borda: false
      }
      //  this.obj.id=i
      tmp.push(obj)
    }

    tmp[40].url = this.strvazio
    tmp[40].estado = 2 //buraco
    // console.log('NA CRIACAO ', tmp)
    return tmp
  }

  marcavel(obj: Peca): boolean {

    const ind: number = obj.id
    const lin: number = Math.floor(ind / 9)
    const col: number = ind % 9

    const cond_esq: boolean = (col > 1) && (this.objArr[lin * 9 + (col - 1)].estado === 0) && (this.objArr[lin * 9 + (col - 2)].estado === 2)
    const cond_dir: boolean = (col < 7) && (this.objArr[lin * 9 + (col + 1)].estado === 0) && (this.objArr[lin * 9 + (col + 2)].estado === 2)
    const cond_baixo: boolean = (lin < 7) && (this.objArr[(lin + 1) * 9 + col].estado === 0) && (this.objArr[(lin + 2) * 9 + col].estado === 2)
    const cond_cima: boolean = (lin > 1) && (this.objArr[(lin - 1) * 9 + col].estado === 0) && (this.objArr[(lin - 2) * 9 + col].estado === 2)

    let cond: boolean = ((obj.stat === 0) && (obj.estado === 0))
    
    // console.log('CONDICOES,esq,dir,baixo,cima', cond_esq, cond_dir, cond_baixo, cond_cima)
    // console.log('COND0', cond, obj, lin, col)

    if (cond) {
      //  if(col>1)
      //     if((this.objArr[lin*9+(col-1)].estado==1)&&(this.objArr[lin*9+(col-2)].estado==2))
      if (cond_esq) {
        // console.log('CONDESQ', cond_esq, obj)
        return cond_esq
      }

      //  cond = cond&&(col>0)&&(this.objArr[lin*9+(col-1)].estado==1)
      //  if(col<7)
      //    if(this.objArr[lin*9+(col+1)].estado==1&&this.objArr[lin*9+(col+2)].estado==2)
      if (cond_dir) {
        // console.log('CONDDIR', cond_dir, obj)
        return cond_dir
      }

      //  cond = cond&&(col<8)&&(this.objArr[lin*9+(col+1)].estado==1)
      //  if(lin>1)
      //    if(this.objArr[(lin-1)*9+col].estado==1&&this.objArr[(lin-2)*9+col].estado==2)
      if (cond_cima) {
        // console.log('CONDCIMA', cond_cima, obj)
        return cond_cima
      }

      //  cond = cond&&(lin>0)&&(this.objArr[(lin-1)*9+col].estado==1)
      //  if(lin<7)
      //    if(this.objArr[(lin+1)*9+col].estado==1&&this.objArr[(lin+2)*9+col].estado==2)
      if (cond_baixo) {
        // console.log('CONDBAIXO', cond_baixo, obj)
        return cond
      }

      //  cond = cond&&(lin<8)&&(this.objArr[(lin+1)*9+col].estado==1)
    } else {
      // console.log('NADA')
      return false
    }
    // console.log('CONDFINAL', cond, obj)
    return false
  }

  marca(obj: Peca): void {
    if (obj.stat === 0) {
      this.objant.stat = 0
      this.objant.borda = false
      obj.stat = 1
      obj.borda = true
      // console.log('Marcado ', obj, this.objant)
      this.objant = obj
      // console.log('Marcado ',obj)
      return
    } else {
      this.objant.stat = 0
      this.objant.borda = false
      obj.stat = 0
      obj.borda = false
      // this.objant=obj
      // console.log('Dismarcado ', obj, this.objant)
    }
  }

  
  getdir(n1:number,n2:number):string{
    let st:string='indefinida'
  
    const lin1:number=Math.floor(n1/9)
    const col1:number= n1%9
    const lin2:number= Math.floor(n2/9)
    const col2:number= n2%9
  
    if(n1<n2)
     {
      if(lin1===lin2)
        st='esq'
      else  
        st='cima'
      }
     else {
      if(lin1===lin2)
        st='dir'
      else  
        st='baixo'
    }
    return st  
  }

  poepeca(obj:Peca,i:number){
    if(i===1){
      obj.stat = 0
      obj.estado = 0
      obj.url = this.strpeca
    } else {
      obj.stat = 0
      obj.estado = 2
      obj.url = this.strvazio
    }
  }

  escolhepilha(i:number){
    if(i===0)
      return [this.pilhajogadas,this.pilhasalvas]
    else  
    if(i===1)
      return [this.pilhasalvas,this.pilhajogadas]
    else
      return []  
  }

  
  secapilha(p:any[])
    {
      while(p.length>0)
         p.pop()  
    }

  iniciojogo(i:number)
  {
  if(i===1)  
  {
    // console.log('Pilha Tamanho',this.pilhasalvas.length)
    while(this.pilhasalvas.length>0)
          this.desjoga(1)
  } else {
      while(this.pilhajogadas.length>0)
          this.desjoga(0)
      this.numpecas = 44
      this.terminou = false
      this.melhor = this.stg.get('melhorresta')        
  }
}

pegamelhor(){
  let tmp:any[]=this.pilhamelhor
  // if(tmp=this.stg.get("melhorjogo"))
  {  
     this.pilhasalvas=[]
     while(tmp.length>0)
     {
      this.pilhasalvas.push(tmp.pop())
     }  
     console.log('Pegou ',this.pilhasalvas)
     
  }
  // else {  
  //   this.pilhasalvas=[]
  //   console.log('Problemas ')
  // // this.copiapilha(this.pilhamelhor,this.pilhasalvas)
  // }
  this.numpecas = 44
}

checatermino():void {

  if(this.numpecas < 10)
  {
    this.terminou = !this.veseterminou()
    console.log('ENTROU0',this.terminou,'MELHOR',this.melhor)
    if(this.terminou){
      if(this.numpecas<this.melhor)
      {
        console.log('ENTROU1',this.terminou,'MELHOR',this.melhor)
        this.melhor = this.numpecas
        // this.copiapilha(this.pilhasalvas,this.pilhamelhor)
        this.gravapilha(this.pilhajogadas)
      }
    }
  }
    return
}

desjoga(i:number){
    const p1= this.escolhepilha(i)[0]//(i===0)?this.pilhajogadas:this.pilhasalvas
    const p2= this.escolhepilha(i)[1]  //(i===0)?this.pilhasalvas:this.pilhajogadas
    
    if(p1.length==0)
        return
     else{
       const tmp=p1.pop()
       p2.push(tmp)
       const obj= this.objArr[tmp.id]
       this.poepeca(obj,i)
      //  console.log('Direcao',tmp.direcao)
       switch(tmp.direcao){
        case 'esq': 
                    // this.objant=this.objArr[tmp.id+2]
                    this.poepeca(this.objArr[tmp.id+1],1-i)
                    this.poepeca(this.objArr[tmp.id+2],1-i)
                    // this.marca(this.objant)
                    break            
        case 'dir': 
                    // this.objant=this.objArr[tmp.id-2]
                    
                    this.poepeca(this.objArr[tmp.id-1],1-i)
                    this.poepeca(this.objArr[tmp.id-2],1-i)
                    // this.marca(this.objant)
                    break            
        case 'cima': 
                    // this.objant=this.objArr[tmp.id+18]
                    this.poepeca(this.objArr[tmp.id+9],1-i)
                    this.poepeca(this.objArr[tmp.id+18],1-i)
                    // this.marca(this.objant)
                    break                                
        case 'baixo':
                    // this.objant=this.objArr[tmp.id-18]
                    this.poepeca(this.objArr[tmp.id-9],1-i)
                    this.poepeca(this.objArr[tmp.id-18],1-i)
                    // this.marca(this.objant)
                    break   
       }
       if(i==0)
          this.numpecas++
        else{
          this.numpecas--
          this.checatermino()
        }                                                
     } 
  }

  veseterminou():boolean{
    let result = false
    
    const tmp = this.objArr.filter(ele => ele.estado===0)
    this.pilhafiltrada = tmp
    tmp.forEach(
      ele => result = this.marcavel(ele) || result 
      )
      console.log('FALTAM AGORA',tmp,'TAMANHO ',tmp.length,'Result',result)
    
      return result
  }

  joga(obj: Peca): void {
    const lin: number = Math.floor(obj.id / 9)
    const col: number = obj.id % 9
    const linant: number = Math.floor(this.objant.id / 9)
    const colant: number = this.objant.id % 9
    const cond:boolean=(this.objant.stat===1) //obj anterior marcado
   
    if ((cond)&&(obj.estado === 2) && ((lin === linant) || (col === colant))) { //se eh um buraco
      
      const tmp={id:obj.id,direcao:'indefinida'}      
      if(this.pilhasalvas.length>0)
        this.secapilha(this.pilhasalvas)
      tmp.direcao = this.getdir(obj.id,this.objant.id)
      this.pilhajogadas.push(tmp)

      obj.estado = 0
      obj.url = this.strpeca
      this.numpecas--
      
      this.objant.borda=false
      this.objant.estado = 2
      this.objant.url = this.strvazio
      this.objant.stat=0

      if (this.objant.id < obj.id) {
        if (lin === linant) {
          this.objArr[lin * 9 + col - 1].estado = 2 //a esquerda
          this.objArr[lin * 9 + col - 1].url = this.strvazio
        } else {
          this.objArr[(lin - 1) * 9 + col].estado = 2 //em cima
          this.objArr[(lin - 1) * 9 + col].url = this.strvazio
        }
      } else {
        if (lin === linant) {
          this.objArr[lin * 9 + col + 1].estado = 2  //a direita
          this.objArr[lin * 9 + col + 1].url = this.strvazio
        } else {
          this.objArr[(lin + 1) * 9 + col].estado = 2 //em baixo
          this.objArr[(lin + 1) * 9 + col].url = this.strvazio
        }
        this.checatermino()

        // if(this.numpecas < 10)
        //     {
        //       this.terminou = !this.veseterminou()
        //       console.log('ENTROU0',this.terminou,'MELHOR',this.melhor)
        //       if(this.terminou){
        //         if(this.numpecas<this.melhor)
        //         {
        //           console.log('ENTROU1',this.terminou,'MELHOR',this.melhor)
        //           this.melhor = this.numpecas
        //           // this.copiapilha(this.pilhasalvas,this.pilhamelhor)
        //           this.gravapilha(this.pilhajogadas)
        //         }
        //       }
        //     }
      }
    } else {
      return
    }
  }

  jogada(ind: number): void {
    const obj: Peca = this.objArr[ind]
    // if(!this.marcavel(obj))
    //   return
    if (obj.stat === 1) { //se ja foi marcada
      this.marca(obj)  //Dismarca
      return
    }
    // console.log('Antes ', this.objArr[ind])
    if (this.marcavel(obj)) {
      this.marca(obj)
      return
    } else {
      this.joga(obj)
      return
    }

    // if(obj.stat<3){
    //   {
    //     if(obj.stat===0)
    //     {
    //       obj.stat=1
    //       obj.borda=true
    //       this.objant=obj
    //       console.log('Aqui ',obj)
    //       return
    //     }else{
    //       obj.stat=0
    //       if(obj.estado===1){
    //       obj.estado=2
    //       obj.url=this.strvazio
    //       } else{
    //               obj.estado=1
    //               obj.url=this.strpeca
    //       }
    //       this.objant.borda=false
    //       this.objant.url= this.objant.estado===1?this.strvazio:this.strpeca
    //       this.objant.stat=0
    //       this.objant.estado = this.objant.estado===1?2:1
    //       console.log('Acola ',this.objArr[ind])
    //       console.log('objAnt ',this.objant)
    //       return
    //     }
    //   }
    // } else{
    //   return
    // }

  }

}
