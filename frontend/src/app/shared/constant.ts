

export const breadcrumbsMenu=[
    {
        label:'Categories',
        path:'/categories',
        children:[
            {
                path:':category'
            },
            {
                path:'/product/:id'
            }
        ]
    }
];

export const MENU:{
    title:string;
    path:string;
}[]
=[
    {
        title:'HOME',
        path:'/'
    },
    {
        title:'Categories',
        path:'/categories'
    },
    {
        title:'Store List',
        path:'/store-list'
    },
    {
        title:'All Product',
        path:'/product-master'
    }
]

