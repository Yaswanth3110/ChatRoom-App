const socket = io('https://yaswanth-chatroom.herokuapp.com/');
{
  /* <div class="incoming_msg">
              <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
              <div class="received_msg">
                <div class="received_withd_msg">
                 <p>Hi yaswanth whatsapp</p>
                  <span class="time_date"> 11:01 AM    |    June 9</span></div>
              </div>
            </div> */
}

// <div class="outgoing_msg">
//   <div class="sent_msg">
//     <p>Hello Rajesh this is aravapp not whatsapp</p>
//     <span class="time_date"> 11:01 AM    |    June 9</span>
//   </div>
// </div>
socket.on('allMessages', (data) => {
  console.log(data.message);
  let chatList = data.message;
  for (let i = 0; i < chatList.length; i++) {
    if (chatList[i].username === document.getElementById('username').value) {
      let element = document.createElement('div');
      element.setAttribute('class', 'outgoing_msg');
      element.innerHTML = `<div class="sent_msg">
            <p>${chatList[i].message}</p>
            <span class="time_date">${chatList[i].time}</span>
          </div>`;
      document.getElementById('dropzone').appendChild(element);
      document.getElementById('dropzone').scrollIntoView(false);
    } else {
      let element = document.createElement('div');
      element.setAttribute('class', 'incoming_msg');
      element.innerHTML = ` <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
            <div class="received_msg">
              <div class="received_withd_msg">
              <b>${chatList[i].username}</b>
               <p>${chatList[i].message}</p>
                <span class="time_date">${chatList[i].time}</span></div>
            </div>
          </div>`;
      document.getElementById('dropzone').appendChild(element);
      document.getElementById('dropzone').scrollIntoView(false);
    }
  }
});

socket.on('someOneTyping', (data) => {
  document.getElementById('typing').innerHTML =
    '<b>' + data.username + '<b>' + '    <i>is Typing.....</i>';
});
socket.on('receiveMessage', (data) => {
  let element = document.createElement('div');
  element.setAttribute('class', 'incoming_msg');
  element.innerHTML = ` <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
    <div class="received_msg">
      <div class="received_withd_msg">
      <b>${data.username}</b>
       <p>${data.message}</p>
        <span class="time_date">${data.time}</span></div>
    </div>
  </div>`;
  document.getElementById('dropzone').appendChild(element);
  document.getElementById('dropzone').scrollIntoView(false);
  let audio = new Audio('./done-for-you-612.mp3');
  audio.play();
  var objDiv = document.getElementById('dropzone');
  objDiv.scrollTop = objDiv.scrollHeight;
  loadUsers();
});

function getAllMessages() {
  socket.emit('getAllMessages', document.getElementById('roomid').value);
}
function sendMessage() {
  let time = moment(new Date().getTime()).format('h:mm a');
  let data = {
    roomid: document.getElementById('roomid').value,
    username: document.getElementById('username').value,
    time: time,
    message: document.getElementById('message').value,
  };
  document.getElementById('message').value = '';
  if (data.roomid == '' || data.username == '' || data.message == '') {
    return;
  }
  socket.emit('sendMessage', data, (result) => {
    if (result.status === 'error') return;
    let element = document.createElement('div');
    element.setAttribute('class', 'outgoing_msg');
    element.innerHTML = `<div class="sent_msg">
        <p>${data.message}</p>
        <span class="time_date">${data.time}</span>
      </div>`;
    document.getElementById('dropzone').appendChild(element);
    var objDiv = document.getElementById('dropzone');
    objDiv.scrollTop = objDiv.scrollHeight;
    loadUsers();
  });
}
function joinRoom() {
  let username = document.getElementById('username').value;
  let roomid = document.getElementById('roomid').value;

  if (username === '' || roomid === '') {
    alert("username and roomid cann't be empty ");
    return;
  }
  if (username.length > 20 || roomid.length > 20) {
    alert('room id and username should be of atmost 20 charecters');
    return;
  }
  document.getElementById('form').style.display = 'none';
  document.getElementById('chatzone').style.display = 'block';
  // setTimeout(getAllMessages, 1000);
  // setTimeout(loadUsers, 500);
  getAllMessages();
  loadUsers();
  document.getElementById('roomname').innerHTML = roomid;

  socket.emit('joinRoom', document.getElementById('roomid').value);
}
//<div class="inbox_chat">
{
  /* <div class="chat_list active_chat">
<div class="chat_people">
  <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
  <div class="chat_ib">
    <h5>Samudrala Aravind</h5>
  </div>
</div>
</div>
</div> */
}
function loadUsers() {
  socket.emit(
    'loadUsers',
    document.getElementById('roomid').value,
    (userList) => {
      console.clear();
      console.log(userList);
      console.log(userList[0].username);
      document.getElementById('users').innerHTML = '';
      for (let i = 0; i < userList.length; i++) {
        let element = document.createElement('div');
        element.setAttribute('class', 'chat_list active_chat');
        element.innerHTML = `<div class="chat_people">
            <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
            <div class="chat_ib">
              <h5>${userList[i].username}</h5>
            </div></div>`;
        document.getElementById('users').appendChild(element);
      }
    }
  );
}
setInterval(() => {
  $('#typing').html('');
}, 2000);
$('document').ready(() => {
  $('#message').keydown(() => {
    let username = $('#username').val();
    let roomid = $('#roomid').val();
    console.log(username);
    socket.emit('typing', { username: username, roomid: roomid });
  });
});
