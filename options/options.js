;(function () {
  let page = document.getElementById('buttonDiv')
  let banner = document.getElementById('word')
  let soundBanner = document.getElementById('sound-p')
  let soundPage = document.getElementById('soundDiv')
  let notifInputs = document.getElementById('notifInputs')
  let custNotifButton = document.getElementById('custNotifButton')
  let createNotif = document.getElementById('createNotif')
  let notifTitle = document.getElementById('notifTitle')
  let notifMessage = document.getElementById('notifMessage')
  let updateHeader = document.getElementById('updated')
  let message
  let title
  let timer
  let sound

  notifInputs.style.display = 'none'
  const alarmTimes = ['1', '5', '10', '15', '30', '45', '60']
  const sounds = [
    {
      url: '../music/alert1.mp3',
      name: 'Upbeat alarm 1'
    },
    {
      url: '../music/alert2.mp3',
      name: 'Upbeat alarm 2'
    },
    {
      url: '../music/alert3.mp3',
      name: 'Upbeat alarm 3'
    }
  ]

  chrome.storage.sync.get('alertTime', function (data) {
    timer = data.alertTime
    banner.textContent = `Current timer set at ${timer} min(s)`
  })

  chrome.storage.sync.get('alertSound', function (data) {
    sound = data.alertSound
    soundBanner.textContent = `Current alarm sound is set to: "${sound.name}"`
  })

  custNotifButton.onclick = (e) => {
    notifInputs.style.display = ''
    custNotifButton.style.visibility = 'hidden'
  }

  notifTitle.onchange = (e) => {
    title = e.target.value
  }

  notifMessage.onchange = (e) => {
    message = e.target.value
  }

  createNotif.onclick = (e) => {
    console.log({ title, message })
    chrome.storage.sync.set({ notif: { title, message } }, function () {
      notifInputs.style.display = 'none'
      updateHeader.textContent =
        'Notification title and message have been saved and will appear on the next alert.'
    })
  }

  function constructOptions(alertTimes) {
    for (let time of alertTimes) {
      const button = document.createElement('button')
      button.className = 'alertButton'
      button.style.backgroundColor = 'tomato'
      button.style.color = 'white'
      button.textContent = `${time} mins`
      button.addEventListener('click', function () {
        chrome.storage.sync.set({ alertTime: +time }, function () {
          console.log('alert is set for ' + time)
        })
        banner.textContent = `Current timer set at ${time} min(s)`
      })
      page.appendChild(button)
    }
  }

  function constructSoundOptions(sounds) {
    for (let sound of sounds) {
      const button = document.createElement('button')
      button.style.backgroundColor = 'lightGreen'
      button.id = 'soundButton'
      button.style.color = 'white'
      button.textContent = `${sound.name}`
      button.addEventListener('click', function () {
        chrome.storage.sync.set({ alertSound: sound.url })
        soundBanner.textContent = `Current alarm sound is set to: "${sound.name}"`
      })
      soundPage.appendChild(button)
    }
  }

  constructOptions(alarmTimes)
  constructSoundOptions(sounds)
})()
