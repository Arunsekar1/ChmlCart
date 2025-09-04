import React from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'

export default function MetaData({title}) {
  return (
    <Helmet>
        <title>{`${title} - ChmlCart`}</title>
    </Helmet>
  )
}
