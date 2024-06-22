// helper.js
const initialblogs = [
    {
        title: 'jwt',
        author: 'subham',
        url: 'how to jwt',
        likes: 1,
        id: '6671ad1a4f1b73cde2c574c9'
    },
    {
        title: 'auth',
        author: 'asit',
        url: ' how to do auth',
        likes: 1,
        id: '6671ae0b0b7efdc395095592'
    },
    {
        title: 'auth',
        author: 'asit',
        url: ' how to do auth',
        likes: 1,
        id: '6675829edfd874b548a7b820'
    }
];

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

module.exports = {
    initialblogs,blogsInDb
};
