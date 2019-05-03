const axios = require('axios')

class YoutubeContoller {

    static show(req, res) {
        
        
       let {annotate} = req.headers
       
        /* axios
            .get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${annotate}&type=video&key=${process.env.YOUTUBE}`)
            .then(({ data }) => {
                res.status(200).json(data)
                
            })
            .catch((err) => {
                res.status(500).json(err)
            }) */
    }
}

module.exports = YoutubeContoller