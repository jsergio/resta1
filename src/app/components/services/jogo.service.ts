import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

export interface Peca {
  id: number,
  url: string,
  stat: number,
  estado: number,
  borda: boolean
}

export interface Jogada{
  id:number,
  direcao:string
}


/*
estado == 0 peca
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

  pilhajogadas:Jogada[]=[] //[{id:0,direcao:'nenhuma'}]
  pilhasalvas:Jogada[]=[]
  pilhalocalstore?:Jogada[]

  melhor:number=44
  pegoupilhamelhor:boolean=false

  pilhamelhor:Jogada[]=[
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
  objant: Peca= {
    id: 0,
    url: '',
    stat: 0,
    estado: 0,
    borda: false
  } //this.objArr[0]

  constructor(private stg: StorageService) { }

  iniciar(){
    const tmp:Jogada[] = this.stg.get('resta1')
    
    this.pilhalocalstore =  tmp===null ? [] : tmp
    
    // console.log('Inicio Melhor',this.pilhalocalstore)
   
    this.numpecas = 44
   
    this.objArr = this.criaObjArr()
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
        url: cond ? '' : this.strpeca,
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

  emcima(obj:Peca):boolean{ //O objeto eh marcavel por cima
    const ind: number = obj.id
    const lin: number = Math.floor(ind / 9)
    const col: number = ind % 9

    return (lin > 1) && (this.objArr[(lin - 1) * 9 + col].estado === 0) 
    && (this.objArr[(lin - 2) * 9 + col].estado === 2)
  }

  embaixo(obj:Peca):boolean{ //O objeto eh marcavel por baixo
    let result:boolean = false

    const ind: number = obj.id
    const lin: number = Math.floor(ind / 9)
    const col: number = ind % 9
    result =(lin < 7) && (this.objArr[(lin + 1) * 9 + col].estado === 0) 
    && (this.objArr[(lin + 2) * 9 + col].estado === 2)
   
    return result
  }

  aesquerda(obj:Peca):boolean{ //O objeto eh marcavel aesquerda
    let result:boolean = false

    const ind: number = obj.id
    const lin: number = Math.floor(ind / 9)
    const col: number = ind % 9
  
    result =(col > 1) && (this.objArr[lin * 9 + (col - 1)].estado === 0) 
    && (this.objArr[lin * 9 + (col - 2)].estado === 2)
   
    return result
  }

  adireita(obj:Peca):boolean{ //O objeto eh marcavel direita
    let result:boolean = false

    const ind: number = obj.id
    const lin: number = Math.floor(ind / 9)
    const col: number = ind % 9

    result =(col < 7) && (this.objArr[lin * 9 + (col + 1)].estado === 0) 
    && (this.objArr[lin * 9 + (col + 2)].estado === 2)   
    
    return result
  }

  marcavel(obj: Peca): boolean {

    const result:boolean = this.aesquerda(obj)||this.adireita(obj)||this.emcima(obj)||this.embaixo(obj)
    // const cond: boolean = ((obj.stat === 0) && (obj.estado === 0))
    
    return result //&&cond

  }

      //  cond = cond&&(lin<8)&&(this.objArr[(lin+1)*9+col].estado==1)
    // console.log('CONDFINAL', cond, obj)

  marca(obj: Peca): void {
    if(obj.id != this.objant.id){
        this.objant.stat = 0 //dismarca anterior
        this.objant.borda = false
    }
    if (obj.stat == 0) {
      obj.stat = 1  //Marca obj
      obj.borda = true
      // console.log('Marcado ', obj, this.objant)
      this.objant = obj
      // console.log('Marcado ',obj)
      return
    } else { //dismarca obj

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
        if(col1===col2)
            st='cima'
      }
     else {
      if(n1>n2)
          if(lin1===lin2)
            st='dir'
          else  
          if(col1===col2)
            st='baixo'
    }
    return st  
  }

  poepeca(obj:Peca,i:number=0):void{
    if(i===1){
      obj.stat = 0
      obj.estado = 0
      obj.url = this.strpeca
    } else {
      obj.stat = 0
      obj.estado = 2
      obj.url = this.strvazio
    }
    return
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

  
  secapilha(p:Jogada[]):void
    {
      while(p.length>0)
         p.pop()  
      return   
    }

  iniciojogo(i:number):void
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
      const tmp:Jogada[] = this.stg.get('resta1')
      this.pilhalocalstore = tmp===null ? [] : tmp
  }
  return
}

pegalocalstorage():void{

  const tmp:Jogada[] = this.stg.get('resta1')!=null?this.stg.get('resta1'):[]
  if(tmp!=[]){
    this.pilhajogadas=[]
    this.pilhasalvas=[]
    while(tmp.length>0)
    {
      const tt = tmp.pop()
      if(typeof(tt)!= "undefined")
          this.pilhasalvas.push(tt)
    }  
    // console.log('Pegou Local Storage',this.pilhasalvas)    
  }
}

pegamelhor():void{
  const tmp:Jogada[]=this.pilhamelhor || []
   
  this.pilhajogadas=[]
  this.pilhasalvas=[]
  // if(typeof(tmp)!="undefined" && tmp != [])
  while(tmp!=[] && tmp.length>0){
    const tt = tmp.pop()//||{id:-1,direcao:'indefinida'}
    if(typeof(tt)!= "undefined")
       this.pilhasalvas.push(tt)
  }
  this.numpecas = 44
  this.pegoupilhamelhor = true 
    //  console.log('Pegou ',this.pilhasalvas)
  return
}

checatermino():void {

  if(this.numpecas < 10)
  {
    this.terminou = !this.veseterminou()
    // console.log('ENTROU0',this.terminou,'MELHOR0',this.melhor)
    const tam:Jogada[] = this.pilhalocalstore!= null ? this.pilhalocalstore : [] 
    
    this.melhor = 44 - tam.length
    
    if(this.terminou){
      if((this.numpecas<this.melhor) && !this.pegoupilhamelhor)
      {
        // console.log('ENTROU1',this.terminou,'MELHOR1',this.melhor)
        this.stg.pilha = this.pilhajogadas
        this.stg.salva()
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
       const tmp= p1.pop()||{id:-1,direcao:'indefinida'}
      //  const tmp = isDefined(tmp1)?tmp1:{id:-1,direcao:'indefinida'}
      //  if(isDefined(tmp))
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
        default:
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

    // this.pilhafiltrada = tmp

    tmp.forEach(
      ele => result = this.marcavel(ele) || result 
      )
      // console.log('FALTAM AGORA',tmp,'TAMANHO ',tmp.length,'Result',result)
      return result
  }

  distancia(p1:Peca,p2:Peca):number{
    const l1:number= Math.floor(p1.id/9)
    const l2:number= Math.floor(p2.id/9)
    const c1:number=p1.id%9
    const c2:number=p2.id%9
    
    if(l1===l2)
      return Math.abs(c1-c2)
    
    if(c1===c2)
       return Math.abs(l1-l2)
    
    return -1     
  }

  joga(obj: Peca): void {
    const ind:number=obj.id
    const lin: number = Math.floor(ind / 9)
    const col: number = ind % 9
    
    const indant:number=this.objant.id
    const linant: number = Math.floor(indant / 9)
    // const colant: number = indant % 9

    const distancia:number= this.distancia(obj,this.objant)
    
    const cond:boolean=(this.objant.stat===1)&& (distancia===2) 
    //obj anterior marcado e distancia ===2 
   
    if (cond && (obj.estado === 2)){ //&& ((lin === linant) || (col === colant))) { 
      //se eh um buraco e anterior marcado
      
      const tmp : Jogada = {id:obj.id, direcao:this.getdir(obj.id,this.objant.id)}      
    
      this.secapilha(this.pilhasalvas)
    
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
            this.checatermino()
      } else {
      if(obj.id < this.objant.id){
          if (lin === linant) {
            this.objArr[lin * 9 + col + 1].estado = 2  //a direita
            this.objArr[lin * 9 + col + 1].url = this.strvazio
            } else {
            this.objArr[(lin + 1) * 9 + col].estado = 2 //em baixo
            this.objArr[(lin + 1) * 9 + col].url = this.strvazio
          }
      }
        this.checatermino()
      }
    } else {  //nao eh um buraco ou anterior nao marcado
      return
    }
  }

  jogada(ind: number): void {

    const obj: Peca = this.objArr[ind]

    if (obj.stat === 1) { //se ja foi marcada
      this.marca(obj)  //Dismarca
      return
    }

    if (this.marcavel(obj)) {
      this.marca(obj)
      return
    } else {
      this.joga(obj)
      return
    }
  }
}
