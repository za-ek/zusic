import Vue from 'vue'

/**
 * NOTICE:
 *
 * Uses Vue.prototype.$eventHub for emit 'playlist-move' event
 */

Vue.directive('order-btn', {
  bind(el, binding, vnode) {
    let clone
    const
      onDown = e => {
        clone = el.parentNode.cloneNode(true)
        clone.style.backgroundColor = '#fff'
        clone.style.position = 'absolute'
        clone.style.top = e.clientY + 'px'
        clone.style.left = e.clientX + 'px'
        document.body.appendChild(clone)
        dragStart()
      },
      onUp = () => {
        if (clone) {
          clone.parentNode.removeChild(clone)
          clone = null
          dragEnd()
        }
      },
      onMove = e => {
        if (clone) {
          clone.style.top = (e.clientY + 1) + 'px'
          clone.style.left = (e.clientX + 1) + 'px'

          let items = document.getElementsByClassName('drag-item-next')
          for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('drag-item-next')
          }

          if ((e.target.className.split(' ').indexOf('playlist-item') > -1)) {
            e.target.classList.add('drag-item-next')
          } else if (e.target.parentNode.className.split(' ').indexOf('playlist-item') > -1) {
            e.target.parentNode.classList.add('drag-item-next')
          } else if ((e.target.className.split(' ').indexOf('playlist-name') > -1)) {
            e.target.classList.add('drag-item-next')
          } else if (e.target.parentNode.className.split(' ').indexOf('playlist-name') > -1) {
            e.target.parentNode.classList.add('drag-item-next')
          }
        }
      },
      disableSelect = evt => {
        evt.preventDefault()
      },
      dragEnd = () => {
        el.parentNode.style.visibility = 'visible'
        window.removeEventListener('selectstart', disableSelect)
        document.body.style.overflow = 'auto'

        let items = document.getElementsByClassName('drag-item-next')
        if (items.length > 0) {
          // album
          if(items[0].classList.contains('playlist-name')) {
            const track_id = el.attributes.getNamedItem("data-id").value;
            const playlist_name = items[0].attributes.getNamedItem('data-name').value;
            Vue.prototype.$eventHub.$emit('add-to-playlist', {track_id, playlist_name})
          } else {
            // list
            let n = Array.prototype.slice.call(el.parentNode.parentNode.children).indexOf(el.parentNode)
            let m = Array.prototype.slice.call(items[0].parentNode.children).indexOf(items[0])
            Vue.prototype.$eventHub.$emit('playlist-move', {n, m})
          }
          items[0].classList.remove('drag-item-next')
        }
      },
      dragStart = () => {
        el.parentNode.style.visibility = 'hidden'
        window.addEventListener('selectstart', disableSelect)
        document.body.style.overflow = 'hidden'
      }

    el.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mousemove', onMove)
  }
})