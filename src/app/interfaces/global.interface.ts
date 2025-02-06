export interface Jenisbahan {
  id?:number
  nama_jenis?:String
  created_by?:string
  created_date?:string
  updated_by?:string
  updated_date?:string
  is_deleted?:number
}
export interface Bahan {
  id?: number,
  item_code?: string,
  item_name?: string,
  id_jenis?: number,
  ukuran?: string,
  keterangan?: string,
  harga_jual?: number,
  harga_beli?: number,
  created_by?: string,
  created_date?: string,
  updated_by?: string,
  updated_date?: string,
  is_deleted?: number,
}
export interface Projek {
  id?: number,
  no_project?: string, 
  tgl_project?: string, 
  ket_project?: string, 
  nama_customer?: string, 
  addr_customer?: string, 
  contact_customer?: string, 
  status_project?: string, 
  created_by?: string,
  created_date?: string,
  updated_by?: string,
  updated_date?: string,
  is_deleted?: number,
}
export interface DetailProjek {
  id?:number,
  id_project_header?:number,
  lebar_bahan?:number,
  lantai?:string,
  ruangan?:string,
  bed?:string,
  tipe?:string,
  uk_room_l?:number,
  uk_room_p?:number,
  uk_room_t?:number,
  stik?:number,
  elevasi?:number,
  tinggi_vitrase?:number,
  tinggi_lipatan?:number,
  nilai_pembagi?:number,
  created_by?: string,
  created_date?: string,
  updated_by?: string,
  updated_date?: string,
  is_deleted?: number,
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