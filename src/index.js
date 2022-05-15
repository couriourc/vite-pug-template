import 'virtual:windi.css'
import '@purge-icons/generated'
import './index.css'
import $ from 'jquery'

$(document).ready(function () {
  $('#button').click(() => {
    window.location.href = '/frontend/index.html'
  })
})
