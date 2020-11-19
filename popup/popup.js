const setAlert = document.getElementById('alert')
const clearAlert = document.getElementById('clearAlert')
const anchor = document.getElementById('anchor')
let alertDelay
let soundUrl
let notifInfo
let internalTimer
let soundOn = true

chrome.storage.sync.get('alertTime', function (data) {
  alertDelay = +data.alertTime
  setAlert.value = alertDelay
  setAlert.textContent = `Start ${alertDelay} min timer`
  clearAlert.textContent = 'Clear timer'
})

// chrome.storage.sync.get('alertSound', ({ alertSound }) => {
//   soundUrl = alertSound.url
// })
getItem('alertSound', ({ alertSound }) => {
  soundUrl = alertSound.url
})
getItem('notif', ({ notif }) => {
  notifInfo = notif
})

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // chrome.tabs.executeScript(tabs[0].id, {
  //   file: 'getImages.js'
  // })
})

// const alertSound1 = new Audio(chrome.extension.getURL('../music/alert1.mp3'))
// const alertSound2 = new Audio(chrome.extension.getURL('../music/alert2.mp3'))
// const alertSound3 = new Audio(chrome.extension.getURL('../music/alert3.mp3'))

setAlert.onclick = function (e) {
  setItem({ isAlarmOn: true })
}

clearAlert.onclick = function (e) {
  chrome.alarms.clear('timer', (wasCleared) => {
    console.log('The Timer was cleared!', wasCleared)
  })
  setItem({ isAlarmOn: false })
  if (internalTimer) {
    clearInterval(internalTimer)
  }
}

chrome.storage.onChanged.addListener((changes, area) => {
  console.log({ changes, area })
})

function playAudioAlert(soundUrl) {
  var count = 1
  const alertSound = new Audio(chrome.extension.getURL(soundUrl))
  alertSound.play()

  alertSound.onended = function () {
    if (count <= 3) {
      count++
      this.play()
    }
  }
}

function stopAudioAlert(soundUrl) {}

// Update the count down every 1 second
function createTimer() {
  var date = new Date()
  var getMins = date.getMinutes() + alertDelay
  var countDownTime = new Date(date.setMinutes(getMins)).getTime()
  internalTimer = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime()

    // Find the distance between now and the count down date
    var distance = countDownTime - now
    console.log(distance)
    console.log(countDownTime > now)

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24))
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    var seconds = Math.floor((distance % (1000 * 60)) / 1000)

    // Display the result in the element with id="demo"
    document.getElementById('demo').innerHTML =
      days + ' days ' + hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds '

    // If the count down is finished, write some text

    if (distance < 0) {
      clearInterval(internalTimer)
      document.getElementById('demo').innerHTML = 'EXPIRED'
    }
  }, 1000)
}

let x = setInterval(() => {
  getItem('timerDisplay', ({ timerDisplay }) => {
    console.log('Display', timerDisplay)
    document.getElementById('demo').innerHTML = timerDisplay
    if (timerDisplay === 'EXPIRED') clearInterval(x)
  })
}, 500)

function createNotif(options) {
  chrome.notifications.create(options)
}

function getItem(item, func = (data) => console.log(data)) {
  chrome.storage.sync.get(item, func)
}
function setItem(item) {
  chrome.storage.sync.set(item)
}
