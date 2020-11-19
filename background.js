const rule1 = {
  conditions: [
    // new chrome.declarativeContent.PageStateMatcher({
    //   pageUrl: { hostEquals: 'developer.chrome.com' }
    // })
    new chrome.declarativeContent.PageStateMatcher({
      css: ['div']
    })
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()]
}

chrome.tabs.onActivated.addListener(function () {
  const notifOptions = {
    type: 'basic',
    iconUrl: '../images/alert_16px.png',
    title: 'Alarm Notification',
    message:
      'Alarms reset when you move tabs, to create another alarm click on the alarm icon again',
    requireInteraction: true
  }
  // chrome.storage.sync.get('isAlarmOn', ({ isAlarmOn }) => {
  //   if (isAlarmOn) {
  //     chrome.notifications.create(notifOptions)
  //   }
  // })
})

chrome.storage.onChanged.addListener((changes) => {
  console.log({ changes })
  if ('isAlarmOn' in changes && changes.isAlarmOn.newValue) {
    getItem('alertTime', ({ alertTime }) => {
      console.log(alertTime)
      chrome.alarms.create('timer', { delayInMinutes: alertTime })
      createTimer(alertTime)
    })
  }
})
//
//  setItem({ isAlarmOn: true })
//  createTimer()

chrome.alarms.onAlarm.addListener(function () {
  let notifOptions
  let soundUrl
  console.log('Alarm has happened!!!!')
  setItem({ isAlarmOn: false })

  getItem('notif', ({ notif }) => {
    notifOptions = {
      type: 'basic',
      iconUrl: '../images/alert_16px.png',
      title: notif.title,
      message: notif.message,
      requireInteraction: true
    }
    createNotif(notifOptions)
  })
  getItem('alertSound', ({ alertSound }) => {
    playAudioAlert(alertSound.url)
  })
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

function createTimer(alertDelay) {
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

    // store the Display the result
    setItem({ timerDisplay: ` ${hours} hours ${minutes} min(s) ${seconds} second(s)` })
    // If the count down is finished, write some text

    if (distance < 0) {
      clearInterval(internalTimer)
      setItem({ timerDisplay: 'EXPIRED' })
    }
  }, 1000)
}

function createNotif(options) {
  chrome.notifications.create(options)
}
function getItem(item, func = (data) => console.log(data)) {
  chrome.storage.sync.get(item, func)
}
function setItem(item) {
  chrome.storage.sync.set(item)
}

chrome.runtime.onInstalled.addListener(function () {
  setItem(
    {
      alertTime: 1,
      timerDisplay: '',
      isAlarmOn: false,
      alertSound: { url: '../music/alert1.mp3', name: 'Upbeat alarm 1' },
      notif: {
        title: 'Timer has Ended!',
        message:
          'This is a general alert message, you can customize this alert on the extension options page'
      }
    },
    function () {
      console.log(`'Alert time starting at 5 min'`)
    }
  )
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([rule1])
  })
})
