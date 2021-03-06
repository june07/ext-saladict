import React from 'react'
import { storiesOf } from '@storybook/react'
import { jsxDecorator } from 'storybook-addon-jsx'
import { withPropsTable } from 'storybook-addon-react-docgen'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import {
  withSaladictPanel,
  withSideEffect,
  mockRuntimeMessage
} from '@/_helpers/storybook'
import { Waveform } from './Waveform'

storiesOf('Content Scripts|Dict Panel', module)
  .addParameters({
    backgrounds: [
      { name: 'Saladict', value: '#5caf9e', default: true },
      { name: 'Black', value: '#000' }
    ]
  })
  .addDecorator(withPropsTable)
  .addDecorator(jsxDecorator)
  .addDecorator(withKnobs)
  .addDecorator(
    withSaladictPanel({
      head: <style>{require('./Waveform.scss').toString()}</style>,
      height: 'auto'
    })
  )
  .addDecorator(
    withSideEffect(
      mockRuntimeMessage(async message => {
        switch (message.type as string) {
          case 'PAGE_INFO':
            return {
              pageId: 'page-id'
            }
          case '[[LAST_PLAY_AUDIO]]':
            return require('@sb/assets/shewalksinbeauty.mp3')
          default:
            break
        }
      })
    )
  )
  .add('Waveform', () => {
    const darkMode = boolean('Dark Mode', true)

    const rootStyles: React.CSSProperties = darkMode
      ? {
          backgroundColor: '#222',
          color: '#ddd',
          '--color-brand': '#218c74',
          '--color-background': '#222',
          '--color-rgb-background': '34, 34, 34',
          '--color-font': '#ddd',
          '--color-divider': '#4d4748'
        }
      : {
          backgroundColor: '#fff',
          color: '#333',
          '--color-brand': '#5caf9e',
          '--color-background': '#fff',
          '--color-rgb-background': '255, 255, 255',
          '--color-font': '#333',
          '--color-divider': '#ddd'
        }

    return <Waveform darkMode={darkMode} rootStyles={rootStyles} />
  })
