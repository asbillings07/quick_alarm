;(function () {
  class Timer {
    constructor(callback, delay) {
      this.timerId = null
      this.startTime = null
      this.remaining = delay * 100000
      this.cb = callback
    }

    calculateDistance = function (distance) {
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      var seconds = Math.floor((distance % (1000 * 60)) / 1000)

      // store the Display the result
      setItem({ timerDisplay: `${hours} hours ${minutes} min(s) ${seconds} second(s)` })
      getItem('timerDisplay', ({ timerDisplay }) => {
        displayTimer = timerDisplay
      })
    }

    pause = function () {
      if (this.timerId !== null) {
        clearTimeout(timerId)
        this.remaining -= Date.now() - startTime
      }
    }

    start = function () {
      console.log('This is a new')
      this.startTime = Date.now()
      clearTimeout(this.timerId)
      this.timerId = setTimeout(() => calculateDistance(this.remaining), this.remaining)
    }
  }

  let takeTimer
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

  chrome.runtime.onInstalled.addListener(function () {
    setItem({
      alertTime: 1,
      timerDisplay: '',
      isRunning: false,
      elapsedTime: 0,
      previousTime: 0,
      // elapsedTime: elapsedTime + (now - previousTime),
      // previousTime: Date.now(),
      isAlarmOn: false,
      alertSound: { url: '../music/alert1.mp3', name: 'Upbeat alarm 1' },
      notif: {
        title: 'Timer has Ended!',
        message:
          'This is a general alert message, you can customize this alert on the extension options page'
      }
    })
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
      chrome.declarativeContent.onPageChanged.addRules([rule1])
    })
  })

  chrome.tabs.onActivated.addListener(function () {
    // chrome.storage.sync.get('isAlarmOn', ({ isAlarmOn }) => {
    //   if (isAlarmOn) {
    //     createNotificationAlert(createNotificationOptions(title, message))
    //   }
    // })
  })

  chrome.storage.onChanged.addListener((changes) => {
    console.log({ changes })
    if ('isAlarmOn' in changes && changes.isAlarmOn.newValue) {
      getItem('alertTime', ({ alertTime }) => {
        console.log(alertTime)
        chrome.alarms.create('timer', { delayInMinutes: alertTime })
        takeTimer = new Timer(() => {
          console.log('Done!')
        }, alertTime)
        takeTimer.start()
        // createTimer(alertTime, tick)
      })
    }
  })

  chrome.storage.onChanged.addListener((changes) => {
    if ('timerDisplay' in changes && changes.timerDisplay?.newValue == 'Timer Cleared') {
      clearInterval(internalTimer)
    }
  })

  chrome.alarms.onAlarm.addListener(function () {
    console.log('Alarm has happened!!!!')
    setItem({ isAlarmOn: false })

    getItem('notif', ({ notif }) => {
      createNotificationAlert(createNotificationOptions(notif.title, notif.message))
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

  function createNotificationOptions(title, message) {
    return {
      type: 'basic',
      iconUrl: '../images/alert_16px.png',
      title: title,
      message: message,
      requireInteraction: true
    }
  }

  function createTimer(alertDelay, tick) {
    var date = new Date()
    var getMins = date.getMinutes() + alertDelay
    var countDownTime = new Date(date.setMinutes(getMins)).getTime()
    let displayTimer
    internalTimer = setInterval(() => tick(countDownTime, displayTimer), 1000)
  }

  function createNotificationAlert(options) {
    chrome.notifications.create(options)
  }
  function getItem(item, func = (data) => console.log(data)) {
    chrome.storage.sync.get(item, func)
  }
  function setItem(item, func = () => false) {
    chrome.storage.sync.set(item, func)
  }

  function calculateDistance(distance) {
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    var seconds = Math.floor((distance % (1000 * 60)) / 1000)

    // store the Display the result
    setItem({ timerDisplay: `${hours} hours ${minutes} min(s) ${seconds} second(s)` })
    getItem('timerDisplay', ({ timerDisplay }) => {
      displayTimer = timerDisplay
    })
  }

  // var timer = new Timer(function () {
  //   alert('Done!')
  // }, 1000)

  // timer.pause()
  // // Do some stuff...
  // timer.resume()

  function tick(countDownTime, displayTimer) {
    // Get today's date and time
    var now = new Date().getTime()

    // Find the distance between now and the count down date
    var distance = countDownTime - now
    console.log(distance)
    setItem({ elapsedTime: distance })

    // Time calculations for hours, minutes and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    var seconds = Math.floor((distance % (1000 * 60)) / 1000)

    // store the Display the result
    setItem({ timerDisplay: `${hours} hours ${minutes} min(s) ${seconds} second(s)` })
    getItem('timerDisplay', ({ timerDisplay }) => {
      displayTimer = timerDisplay
    })
    // If the count down is finished, write some text
    if (displayTimer == 'Cleared') {
      distance = -1
    }

    if (distance < 0) {
      console.log(distance)
      clearInterval(internalTimer)
      setItem({ timerDisplay: 'EXPIRED' })
    }
  }
})()
