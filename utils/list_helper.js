
const dummy = (blogs) => {
    return 1
    }

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
        }
    return blogs.reduce(reducer, 0)
    }  
    const favoriteBlog = (blogs) => {
        
        if (blogs.length === 0) {
          return null;
        }
      

        const favorite = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0]);
      
        
        return {
          title: favorite.title,
          author: favorite.author,
          likes: favorite.likes
        };
      };
    const mostblog =(blogs) =>{
      if (blogs.length === 0) {
        return null;
      }
      const blogcount = {}
      blogs.forEach(blog => {
        if(blog.author in blogcount){
          blogcount[blog.author]++
        }
        else{
          blogcount[blog.author] = 1
        }
      });

      let maxblog = 0;
      let topauthor = ''
      
      for(const author in blogcount){
        if(blogcount[author] > maxblog){
          maxblog = blogcount[author]
          topauthor = author;
        }
      }
      return{author : topauthor,blog : maxblog}
    }
    const mostlike = (blogs) => {
      if (blogs.length === 0) {
        return null;
      }
      const likecount = {}
      blogs.forEach(blog => {
        if(blog.author in likecount){
          likecount[blog.author] += blog.likes
        }
        else{
          likecount[blog.author] = blog.likes
        }
      });

      let maxlike = 0;
      let topauthor = ''
      
      for(const author in likecount){
        if(likecount[author] > maxlike){
          maxlike = likecount[author]
          topauthor = author;
        }
      }
      return{author : topauthor,likes : maxlike}
    }
   module.exports = {
    dummy, totalLikes, favoriteBlog,mostblog,mostlike
    } 