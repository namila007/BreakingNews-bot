const twit = require('twit')
const config = require('../config/config')
const T = new twit(config)


var users = [config.userid]//following user id, can give more ['xxx','yyy']
var botid = config.botid  //bot user id

//starting stream
var stream = T.stream('statuses/filter', { follow: users }) 

stream.on('tweet', function (tweet) {
  
    console.log('New tweet: '+ tweet.id_str)
    console.log('Text: '+tweet.text)

    //send rt and likes<3 (only users tweets)
    //only rt n fav monitoring userid  and not to any replies
   if(!tweet.retweeted && !tweet.favorited && tweet.user.id == users && tweet.in_reply_to_user_id == null ){
    T.post(
        'statuses/retweet/:id',{id: tweet.id_str},(err, response) => {
          if (err) {
            console.log('ERRORDERP: Retweet! ' + err + ' ' + tweet.id_str)
          }
          else{
            console.log('SUCCESS RT: '+ tweet.id_str)
          }
        })  
    
     
        T.post('favorites/create',{id: tweet.id_str},(err, response) => {
              if (err) {
                console.log('ERRORDERP: fav! '+ err + ' ' + tweet.id_str)
              }
              else{
              console.log('SUCCESS Fav: '+tweet.id_str)
              }
            })  
        }

})

//getting mentions and replying to the relevent thread
var reply = T.stream('statuses/filter', { track: 'nb_bot007'  }) 
reply.on('tweet', function(tweet){
  console.log("Hola! got a mention " +tweet.id_str)
  //here tweet id is not working, so try tweet string if
  //replying to all tweets except bots userid 1018580921740492800
  if(tweet.user.id != botid && tweet.in_reply_to_status_id == null) { 
    //sending random quote to the mention
    //quote is sliced to 210 max length
    
      T.post('statuses/update', { 
        
        in_reply_to_status_id : tweet.id_str, 
        status: 'Hi @'+tweet.user.screen_name + ', thanks for mentioning me.Have a great day !😊'
        
      }, function(err, data, response) {
        if(err) console.log("Didn't replied :( "+err)
        console.log("Replied to mention :)")
      })
    
   
    
  }
})



module.exports = stream


