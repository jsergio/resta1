import { Injectable } from '@angular/core';

export interface Jogada{
    id:number,
    direcao:string
  }
  


@Injectable({
  providedIn: 'root'
})

export class StorageService {

  private storage: Storage;

  pilha:Jogada[]=[]
  
  pilhasalva:Jogada[]=[]

  agora:number=-1 
  
  constructor() {
    this.storage = window.localStorage;
  }

  set(key: string, value: any): boolean {
    if (this.storage) {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

  get(key: string): any {
    
    if (this.storage) {
      if(this.storage.getItem(key)!==null){
        const tmp:any = this.storage.getItem(key)     
         return JSON.parse(tmp);
      }
      return null
    }
    return null;
  }

  remove(key: string): boolean {
    if (this.storage) {
      this.storage.removeItem(key);
      return true;
    }
    return false;
  }

  clear(): boolean {
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    return false;
  }
  
  pegastorage():void{
    let tmp=this.get('resta1')
    if(typeof(tmp)=="undefined"){
      this.pilhasalva = []
      this.agora=0
    } else {
      this.pilhasalva= tmp===null?[]:tmp.pilha
      this.agora=tmp===null?0:tmp.data
    }
    console.log('EM STG\n',this.pilhasalva)
    console.log('\nAGORA\n',this.agora)  
  }

  salva():void{
   const agora:number=new Date().getTime()
   const dados={data:agora,pilha:this.pilha}

   this.remove('resta1')
  //  console.log('Salvou',dados)
  //  this.set('resta1',dados)
   this.set('resta1',dados)
  //  this.set('resta13',agora)
   console.log('SALVOU\n',this.pilha,'\nTAMANHO\n',this.pilha.length)
  }

  formatadata(dt: number): string {
    const data = new Date(dt)
    return `${this.pad2(data.getDate())} ${this.getMonthName(data)} ${data.getFullYear()} ${this.pad2(data.getHours())}:${this.pad2(data.getMinutes())}`
  }

  pad2(tmp: number): string {
    const result: string = '00' + tmp
    return result.slice(-2)
  }

getMonthName(dt: Date): string {
    const meses: string[] = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEC']
    return meses[dt.getMonth()]
  }

}
