import ajax from "./ajax";
// export const GetPosts = () => ajax.get('posts/1')
// export const GetsearchData = (params) => ajax.get('/list',{params})
// export const PostPosts = (params) => ajax.post('posts',params)
export const LoginPost = (params) => ajax.post('/login/',params)
export const LoginOutPost = () => ajax.post('/LoginOut/')

export const GetOrders = (params) => ajax.get('/Orders/', {params})
export const OrderAddPost = (params) => ajax.post('/OrderAdd/', params)
export const OrderEditPost = (params) => ajax.post('/OrderEdit/', params)
export const OrderDetailGet = (params) => ajax.get('/OrderDetail/', {params})
export const OrderDelPost = (params) => ajax.post('/OrderDel/', params)
