import React from 'react'
import { Appbar } from 'react-native-paper'

function Header(props) {
  return (
    <Appbar.Header>
        <Appbar.Action icon={props.icon} />
        <Appbar.Content title={props.title} />
      </Appbar.Header>
  )
}

export default Header