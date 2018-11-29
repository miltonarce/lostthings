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

const mockgetDetail = {
    data: {
        data: {
            idpublicacion: '33',
            fecha_publicacion: '24/12/2018',
            img: 'https://via.placeholder.com/350x150',
            descripcion: 'Nuevo item publicado texto mock',
            titulo: 'Notebook perdida',
            ubicacion: 'Jonte',
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
        },
        status: 1
    }
}

const commentPublicationMock = {
    id: '222',
    usuario: 'Veronica',
    avatar: 'https://randomuser.me/api/portraits/women/81.jpg',
}
