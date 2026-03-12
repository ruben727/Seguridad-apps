export class Group {

groups = [

{id:1,name:'Equipo Dev'},
{id:2,name:'Soporte'},
{id:3,name:'UX'}

]

constructor(private router:Router){}

openGroup(group:any){

this.router.navigate(['/dashboard',group.id])

}

}