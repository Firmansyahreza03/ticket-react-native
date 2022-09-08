import React from 'react'

function Loading(props) {
  return (
    {props.loading && <ActivityIndicator animating={props.loading} color="#49983b" size="large" style={styles.loading} />}
  )
}

export default Loading