export interface Jenisbahan {
  id?:number
  NamaJenis?:String
  created_by?:string
  created_date?:string
  updated_by?:string
  updated_date?:string
  is_deleted?:number
}
export interface Bahan {
  id?:number
  itemcode?:string
  itemname?:string
  idjenis?:number
  created_by?:string
  created_date?:string
  updated_by?:string
  updated_date?:string
  is_deleted?:number
}
export interface User {
  id?:string
  id_auth?:string
  stuser?:number //0=nonaktif 1:aktif
  idrole?:number
  //global
  username?:string
  email?:string
  nmlengkap?:string
  gender?:string
  nowa?:string
  photo?:string
  photo_url?:string
  alamat:string
  created_by?:string
  created_date?:string
  updated_by?:string
  updated_date?:string
  is_deleted?:number
}
export interface Profile{
  id?:string
  idauth?:string
  gender?:string
  nowa?:any
  alamat?:string
  created_by?:string
  created_date?:string
  updated_by?:string
  updated_date?:string
  is_deleted?:number
}
export interface Settingapp{
  nmapp?:string
  version?:string
}