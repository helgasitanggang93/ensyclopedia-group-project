const axios = require('axios')
let news = axios.create({
    baseURL:`https://newsapi.org/v2`
})

class Controller{
    static fetch(req,res){
        console.log('################### masuk fetch');
        
        news
        .get(`/everything?q=${req.params.title}&sortBy=publishedAt&apiKey=${process.env.GOOGLE_NEWS_KEY}`)
        .then(({data}) => {
            console.log('adlkjflksdfkdlaflkdsjfa', data);
            res.status(200).json(data.articles)
        })
        .catch(err => {
            console.log(err);
            
            res.status(500).json({
                message:'Error'
            })
        })
    }
}

module.exports = Controller