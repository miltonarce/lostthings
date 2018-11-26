const getAllMock = [
    {
        usuario: {
            nombre: 'Veronica',
            avatar: 'https://randomuser.me/api/portraits/women/81.jpg'
        },
        producto: {
            id: '33',
            fecha_publicacion: '23/12/2018',
            nombre: 'Impresora',
            foto: 'https://via.placeholder.com/350x150',
            descripcion: 'Hola encontre este articulo perdido, si pueden encontrar',
            cantComentarios: '33'
        }
    },
    {
        usuario: {
            nombre: 'Veronica',
            avatar: 'https://randomuser.me/api/portraits/women/81.jpg'
        },
        producto: {
            id: '55',
            fecha_publicacion: '23/12/2018',
            nombre: 'Notebook',
            foto: 'https://via.placeholder.com/350x150',
            descripcion: 'Hola encontre este articulo perdido, si pueden encontrar',
            cantComentarios: '33'
        }
    },
    {
        usuario: {
            nombre: 'Veronica',
            avatar: 'https://randomuser.me/api/portraits/women/81.jpg'
        },
        producto: {
            id: '44',
            fecha_publicacion: '23/12/2018',
            nombre: 'Control remoto',
            foto: 'https://via.placeholder.com/350x150',
            descripcion: 'Hola encontre este articulo perdido, si pueden encontrar',
            cantComentarios: '33'
        }
    },
    {
        usuario: {
            nombre: 'Veronica',
            avatar: 'https://randomuser.me/api/portraits/women/81.jpg'
        },
        producto: {
            id: '21',
            fecha_publicacion: '23/12/2018',
            nombre: 'Agenda Electronica',
            foto: 'https://via.placeholder.com/350x150',
            descripcion: 'Hola encontre este articulo perdido, si pueden encontrar',
            cantComentarios: '33'
        }
    }
];

const searchItemsMock = [{
    usuario: {
        nombre: 'Veronica',
        avatar: 'https://randomuser.me/api/portraits/women/81.jpg'
    },
    producto: {
        id: '33',
        fecha_publicacion: '23/12/2018',
        foto: 'https://via.placeholder.com/350x150',
        descripcion: 'Hola encontre este articulo perdido, si pueden encontrar',
        cantComentarios: '33'
    }
}];

const publishItemMock = {
    id: '78',
    fecha_publicacion: '24/12/2018',
    foto: 'https://via.placeholder.com/350x150',
    descripcion: 'Nuevo item publicado texto mock',
    cantComentarios: 0
};


const mockgetDetail = {
    id: '33',
    fecha_publicacion: '24/12/2018',
    foto: 'https://via.placeholder.com/350x150',
    descripcion: 'Nuevo item publicado texto mock',
    nombre: 'Notebook perdida',
    comentarios: [
        {
            usuario: 'Veronica',
            avatar: 'https://randomuser.me/api/portraits/women/81.jpg',
            descripcion: 'Esto es horrible'
        },
        {
            usuario: 'Juan',
            avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
            descripcion: 'testing mobile'
        }
    ]
}

const commentPublicationMock = {
    id: '222',
    usuario: 'Veronica',
    avatar: 'https://randomuser.me/api/portraits/women/81.jpg',
}
