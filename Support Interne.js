const xapi = require('xapi');
let name;
function push(msg, cb) {

//obs_notify bot token
const token = "YWUzZDU5YTMtYTk3Yy00YjIyLWIwYzQtZjJkODNjY2JmZTg5YjZlOTgzMGMtNzc5_PF84_55eb52da-641e-4a46-8b01-a38b95283c2a"
//replace with a space your bot is part of
const roomId = "xxxxxx"

//Post message
let payload = {
  "markdown": msg,
  "roomId": roomId
}

xapi.command(
  'HttpClient Post',
  {
    Header: ["Content-Type: application/json", "Authorization: Bearer " + token],
    Url : "https://api.ciscospark.com/v1/messages",
    AllowInsecureHTTPS: "True"
  },
  JSON.stringify(payload))
  .then((response) => {
    if (response.StatusCode == 200) {
      console.log("message pushed to webex teams")
      if (cb) cb(null, response.StatusCode)
      return
    }
    
    console.log("failed with status code:" + response.StatusCode)
    if (cb) cb("failed with status code:" + response.StatusCode, response.StatusCode)
  })
  .catch((err) => {
    console.log("failed with error: " + err.message)
    if (cb) cb("Could not post message to Webex Teams")
  })
}

function onInroomEvent(event) {
  let p2 = xapi.status.get('UserInterface ContactInfo Name')
  Promise.all([p2]).then(display_name => {
  name = display_name[0];
  console.log("le nom de la salle est : " + name);
  })
  
  console.log('In-room event occured', event);
  if  (event.WidgetId === 'INCIDENT_1' && event.Type === 'clicked') {
    console.log('execution de la fonction push1')
    push('Problème signalé dans la salle '+ name, console.log)
    }
  else if  (event.WidgetId === 'INCIDENT_2' && event.Type === 'clicked')  {
    console.log('execution de la fonction push2')
    push('Tout va bien dans la salle '+ name, console.log)
    }
  }
xapi.event.on('UserInterface Extensions Widget Action', onInroomEvent);
