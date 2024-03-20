import type { Component } from 'vue'
import { h } from 'vue'
import { NIcon } from 'naive-ui'

export default function () {
  return function (icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }
}
